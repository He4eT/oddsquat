---

layout: post

lang: 'ru'
date: '2024-01-15'

year: '2024'
section: 'posts'

title: 'selfhosted LLM'
description: 'Персональная LLM в docker-контейнере на твоём компьютере'

---

# Your Own Private Large Language Models

С&nbsp;одной стороны, я&nbsp;сомневаюсь, что Большие Языковые Модели (LLM) смогут однажды эволюционировать в&nbsp;AGI. С&nbsp;другой&nbsp;— я&nbsp;по-настоящему впечатлён тем, что щепотка статистики справляется с&nbsp;написанием текстов лучше меня.

В&nbsp;любом случае, джина обратно в&nbsp;бутылку уже не&nbsp;вернуть, и&nbsp;все те&nbsp;письма в&nbsp;различные организации, которые я&nbsp;не&nbsp;хочу писать сам, будут теперь написаны месивом из&nbsp;байтиков.

Действительно пугает меня в&nbsp;этой ситуации только то, что флагманом новой эры почему-то стала компания OpenAI, которая, вопреки названию, совершенно не&nbsp;Open.
Множество компаний и&nbsp;людей вписали их&nbsp;продукты в&nbsp;свою рутину и&nbsp;не&nbsp;страшатся такой неподконтрольной зависимости.

Я&nbsp;так не&nbsp;могу. К&nbsp;счастью, я&nbsp;не&nbsp;один такой, и&nbsp;на&nbsp;данный момент уже есть множество альтернативных моделей от&nbsp;разных вендоров. Они отличаются друг от&nbsp;друга качеством, размером, возможностями и&nbsp;лицензиями, так что при желании можно надолго занять себя знакомством с&nbsp;обширным ассортиментом. Например, на&nbsp;портале [HuggingFace](https://huggingface.co/), который можно описать как «GitHub для LLM и&nbsp;всего, что вокруг».

Должен признаться, что очень слабо разбираюсь в&nbsp;параметрах и&nbsp;характеристиках языковых моделей, но&nbsp;оказалось, что для того, чтобы начать, эти знания не&nbsp;так уж&nbsp;и&nbsp;необходимы.

Ниже инструкция, как запустить LLM на&nbsp;своём железе, как упаковать всё это в&nbsp;docker-контейнер, чтобы не&nbsp;размазать случайно по&nbsp;всей файловой системе, как получить совместимый с&nbsp;OpenAI API и&nbsp;как потом этим пользоваться.

---

- [Установка и настройка](#setup)
  - [Установка Ollama](#setup-ollama)
  - [Загрузка модели и диалог с ней](#setup-model)
  - [Кастомные модели и их тонкая настройка](#custom-model)
- [Использование](#usage)
  - [Мимикрия под API от OpenAI](#fake-open-ai)
  - [Интеграция с NeoVim](#ollama-nvim)
- [Обновление и удаление](#update-delete)
- [Производительность](#performance)
- [Зачем всё это нужно?](#why)

---

<div id='setup'></div>

## Установка и&nbsp;настройка

Существует несколько продуктов, которые стараются избавить пользователя от&nbsp;головной боли и&nbsp;возни с&nbsp;инфраструктурой. Мне понятнее всего оказался проект [Ollama](https://ollama.ai/), с&nbsp;ним мы&nbsp;и&nbsp;будем экспериментировать.

Кроме бинарников для Linux и&nbsp;MacOS, они [предоставляют](https://ollama.ai/blog/ollama-is-now-available-as-an-official-docker-image) официальный [docker-образ](https://hub.docker.com/r/ollama/ollama), работу с&nbsp;которым я&nbsp;и&nbsp;опишу.

Использование docker-контейнеров, к&nbsp;сожалению, слегка усложняет взаимодействие с&nbsp;Ollama, так что большая часть текста и&nbsp;кода в&nbsp;этом посте посвящены решению проблем, которые, по&nbsp;сути, я&nbsp;придумал себе сам.

<div id='setup-ollama'></div>

### Установка Ollama

Для создания и&nbsp;первого запуска контейнера нужно выполнить команду:
```
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

Счастливые владельцы видеокарт от&nbsp;Nvidia могут установить [Nvidia container toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installation) и&nbsp;активировать поддержку GPU с&nbsp;помощью флага `--gpus=all`.

После создания запускать и&nbsp;останавливать контейнер `ollama` можно так:
```
docker start ollama
docker stop ollama
```

Контейнер предоставляет доступ к&nbsp;[Ollama API](https://github.com/jmorganca/ollama/blob/main/docs/api.md) на&nbsp;11434&nbsp;порту, а&nbsp;также позволяет устанавливать и&nbsp;общаться с&nbsp;установленными LLM через терминал.

<div id='setup-model'></div>

### Загрузка модели и&nbsp;диалог с&nbsp;ней

Ollama позволяет запускать любые GGUF, PyTorch или Safetensors модели (что&nbsp;бы это ни&nbsp;значило), но&nbsp;самый простой путь&nbsp;— загрузка моделей из&nbsp;специальной [библиотеки](https://ollama.ai/library).

Для того, чтобы скачать модель и&nbsp;начать с&nbsp;ней диалог, нужно выполнить команду:
```
docker exec -it ollama ollama run mistral
```

Вместо `mistral` от&nbsp;одноимённой комании можно выбрать любую другую модель из&nbsp;библиотеки, например, легкую `phi` от&nbsp;Microsoft Research.

Кроме `run` доступны также `list`, `pull` и&nbsp;`rm` для просмотра списка, скачивания и&nbsp;удаления моделей соответственно.

Чтобы не&nbsp;писать такие длинные заклинания каждый раз, я&nbsp;добавил в&nbsp;`.zshrc` пару алиасов:
```
alias summonable='docker exec -it ollama ollama list'
alias summon='clear && docker exec -it ollama ollama run'
```

Теперь можно смотреть на&nbsp;список установленных моделей и&nbsp;запускать диалог с&nbsp;выбранной:
```
summonable
summon phi
```
<div id='custom-model'></div>

### Кастомные модели и&nbsp;их&nbsp;тонкая настройка

Ollama позволяет на&nbsp;основе существующих создавать производные модели с&nbsp;заранее определёнными инструкциями или параметрами. Для этого нужно создать специальный файл, в&nbsp;котором указана родительская модель и&nbsp;определены желаемые значения параметров. Подробнее о&nbsp;формате этих файлов можно прочесть в&nbsp;документации: [Modelfile](https://github.com/jmorganca/ollama/blob/main/docs/modelfile.md).

Чтобы посмотреть, как должен выглядеть Modelfile, можно посетить [OllamaHub](https://ollamahub.com/) от&nbsp;разработчиков стороннего [Ollama Web UI](https://github.com/ollama-webui/ollama-webui/). На&nbsp;сайте есть [примеры очень тонкой настройки множества параметров](https://ollamahub.com/m/smoothbrainape/hu-tao:latest) модели для соответствия образу конкретного персонажа, но&nbsp;в&nbsp;качестве образца я&nbsp;буду использовать небольшой [English Teacher Modelfile](https://ollamahub.com/m/kamjin/english-teacher:latest):

#### EnglishTeacher.Modelfile
```
FROM llama2
SYSTEM """
I want you to act as a English teacher.
Your main responsibility will be to instruct me in all aspects of English, including grammar, vocabulary, reading, writing and speaking.
You should always take the initiative to correct my mistakes in grammar and vocabulary, and you can give me two or three examples at any appropriate time to help me understand better.
"""
```

Вообще, для загрузки кастомной модели достаточно выполнить команду `create`, но&nbsp;в&nbsp;случае использования Ollama внутри docker-контейнера возникает необходимость каким-то образом файл с&nbsp;моделью в&nbsp;этот контейнер передать.

Для решения этой проблемы я&nbsp;набросал небольшой bash-скрипт:

#### applyModelfile.bash
```bash
#!/bin/bash

containerId=$(docker ps | grep ollama/ollama | cut -d' ' -f1)

echo "Container ID:"
echo $containerId
echo ""

if [ -z "$containerId" ]; then
  echo "Container does not exist."
  exit 1
fi

modelName=$1
echo "Model name:"
echo $modelName
echo

sourcePath="./models/${modelName}.Modefile"
targetPath="/home/${modelName}.Modefile"

if ! test -f $sourcePath; then
  echo "File does not exist."
  echo $sourcePath
  exit 1
fi

docker cp $sourcePath "${containerId}:${targetPath}"
clear
docker exec -it ollama ollama create $modelName -f $targetPath
```

Этот скрипт нужно поместить по&nbsp;соседству с&nbsp;директорией `models` и&nbsp;сделать исполняемым с&nbsp;помощью `chmod +x applyModelfile.bash`.
Должна получиться примерно такая структура:
```
├── models
│   └── EnglishTeacher.Modefile
└── applyModelfile.bash
```

После этого модель можно загрузить в&nbsp;контейнер и&nbsp;начать с&nbsp;ней диалог:
```
./applyModelfile.bash EnglishTeacher
summon EnglishTeacher
```

<div id='usage'></div>

## Использование 

Разговоры с&nbsp;галлюцинирующим искусственным интеллектом в&nbsp;терминале&nbsp;— это, конечно, волшебно, но&nbsp;потенциал больших языковых моделeй по-настоящему раскрывается, когда они начинают портить данные в&nbsp;соседних приложениях!

В&nbsp;[GitHub-репозитории Ollama](https://github.com/jmorganca/ollama#community-integrations) можно найти ссылки на&nbsp;множество веб-интерфейсов, библиотек и&nbsp;плагинов для текстовых редакторов и&nbsp;прочих Obsidian'ов.

Не&nbsp;ручаюсь за&nbsp;весь список, но&nbsp;расскажу про то, с&nbsp;чем экспериментировал сам.

<div id='fake-open-ai'></div>

### Мимикрия под API от&nbsp;OpenAI

API Ollama используется в&nbsp;меньшем числе продуктов, чем API от&nbsp;OpenAI. К&nbsp;счастью, это не&nbsp;проблема: с&nbsp;помощью прокси-прослойки под названием [LiteLLM](https://github.com/BerriAI/litellm) можно сделать их&nbsp;совместимыми. Инструкция по&nbsp;установке и&nbsp;использованию в&nbsp;общем случае есть в&nbsp;репозитории и&nbsp;довольно тривиальна, но&nbsp;мне опять потребовалось немного кода, чтобы заставить их&nbsp;работать вместе на&nbsp;моих условиях.

Я&nbsp;хотел, чтобы LiteLLM-прокси и&nbsp;Ollama работали на&nbsp;разных компьтерах, и&nbsp;не&nbsp;хотел ставить pip-пакеты в&nbsp;систему. В&nbsp;результате родилось решение из&nbsp;docker-файла с&nbsp;хаками и&nbsp;скрипта, который в&nbsp;нём запускается. Я&nbsp;не&nbsp;специалист в&nbsp;написании docker-файлов, так что уверен в&nbsp;неоптимальности финального решения. Точно можно и&nbsp;нужно обойтись без `run --net=host` и&nbsp;отдельного скрипта, например.

Несмотря на&nbsp;костыльность связки, она справляется со&nbsp;своей задачей:

#### Dockerfile
```Dockerfile
FROM python:3.10

COPY startProxy.sh /usr/src/app/startProxy.sh
RUN chmod +x /usr/src/app/startProxy.sh

WORKDIR /usr/src/app

# Prevent ollama run attempt
RUN echo '#!/bin/sh\necho "$1"' > /usr/bin/ollama && \
    chmod +x /usr/bin/ollama

CMD ["./startProxy.sh"]
```

#### startProxy.sh
```sh
#!/bin/bash

pip install litellm

litellm --model ollama/mistral --api_base http://ollama.internal:11434 --drop_params
```

Собрать и&nbsp;запустить docker-контейнер можно с&nbsp;помощью этих двух команд:
```sh
docker build -t diy-ollama-proxy .
docker run --net=host diy-ollama-proxy
```
После запуска вы&nbsp;получите API, который совместим с&nbsp;API от&nbsp;OpenAI и&nbsp;доступен по&nbsp;адресу `http://localhost:8000/`.

<div id='ollama-nvim'></div>

### Интеграция с&nbsp;NeoVim

Языковые модели отлично умеют взаимодействовать с&nbsp;текстом, так что использование их&nbsp;в&nbsp;текстовом редакторе кажется разумной идеей.

Мне не&nbsp;очень нравится идея Copilot, который зачем-то постоянно подсовывает тебе странные куски кода. Я&nbsp;пробовал использовать [Codeium](https://codeium.com/) в&nbsp;ручном режиме, но&nbsp;оказалось, что странные куски кода по&nbsp;запросу мне тоже не&nbsp;очень нужны. Гораздо более привлекательной мне кажется возможность выделить существующий фрагмент текста или кода и&nbsp;попросить бездушную машину что-нибудь с&nbsp;ним сделать: упростить, дополнить, изменить или даже перевести с&nbsp;одного языка на&nbsp;другой. Идеальным для такого подхода оказался [плагин ollama.nvim](https://github.com/nomnivore/ollama.nvim).

Кроме того, что он&nbsp;поддерживает кастомные промпты (в&nbsp;том числе интерактивные), он&nbsp;позволил мне обращаться к&nbsp;LLM, которая запущена на&nbsp;другом компьютере в&nbsp;локальной сети (для удобства я&nbsp;указал его адрес в&nbsp;`/etc/hosts/`).

Установка и&nbsp;настройка с&nbsp;использованием пакетного менеджера lazy.nvim выглядит примерно так:
```
{
  'nomnivore/ollama.nvim',
  dependencies = {
    'nvim-lua/plenary.nvim',
  },
  cmd = { 'Ollama', 'OllamaModel' },
  keys = {
    {
      '<leader>j',
      ':Ollama<CR>',
      desc = 'Ollama Menu',
      mode = { 'v' },
    },
    {
      '<leader>j',
      ":lua require('ollama').prompt('Generate_Code')<cr>",
      desc = 'Ollama Code Generation',
      mode = { 'n' },
    },
  },
  opts = {
    model = 'mistral',
    url = 'http://ollama.internal:11434', -- see /etc/hosts
    prompts = {
      Ask_About_Code = false,
      Simplify_Code = false,
      Improve_Text = {
        prompt = 'Check the following sentence for grammar and clarity: "$sel".\nRewrite it for better readability while maintaining its original meaning.',
        extract = false,
        action = 'replace',
      },
      Modify_Text = {
        prompt = 'Modify this text in the following way: $input\n\n```$sel```',
        extract = false,
        action = 'replace',
      },
      Use_Selection_as_Prompt = {
        prompt = '$sel',
        extract = false,
        action = 'replace',
      },
    },
  },
},
```

В&nbsp;этом конфиге я&nbsp;выключил несколько дефолтных промптов и&nbsp;добавил несколько своих:
- `Improve_Text` заменяет выделенный кусок текста «улучшенным».
- `Modify_Text` является аналогом встроенного `Modify_Code` и&nbsp;позволяет делать с&nbsp;выделенным текстом всякие глупости. Например, заменить все числа на&nbsp;слова.
- `Use_Selection_as_Prompt` просто заменяет выделенный текст на&nbsp;ответ от&nbsp;LLM.

В&nbsp;итоге получается два сценария использования, оба доступны по&nbsp;`<leader> + j`:
- В&nbsp;`normal` mode плагин спрашивает меня, какой код мне нужен, и&nbsp;вставляет его.
- В&nbsp;`visual` mode появляется меню действий над выделенным текстом.

Как видно из&nbsp;конфига, я&nbsp;использую только `mistral`, но&nbsp;можно указать модель для кажого промпта и&nbsp;делегировать, например, манипуляции над кодом `codellama`, а&nbsp;операции над текстом&nbsp;— `llama2`.

Возможность добавления кастомных промптов позволяет в&nbsp;будущем реализовать новые сценарии или вынести повторяющиеся действия в&nbsp;отдельный пункт меню или даже на&nbsp;отдельный шорткат.

<div id='update-delete'></div>

## Обновление и&nbsp;удаление

Для обновления и&nbsp;удаления моделей можно использовать команды `pull` и&nbsp;`rm`:
```
docker exec -it ollama ollama pull mixtral
docker exec -it ollama ollama rm&nbsp;mistral
```

Я&nbsp;знаю, что для обновления и&nbsp;удаления docker-образов и&nbsp;docker-контейнеров тоже есть специальные команды (это тоже `pull` и&nbsp;`rm`), но&nbsp;каждый раз ленюсь в&nbsp;этом разобраться, просто сношу всё с&nbsp;помощью утилиты [sen](https://github.com/TomasTomecek/sen) и&nbsp;разворачиваю нужное заново.

<div id='performance'></div>

## Производительность

Для эксплуатации LLM требуется гораздо меньше ресурсов, чем для её&nbsp;обучения. Запустить 7b-модель средней тупости можно практически на&nbsp;любом CPU и&nbsp;8&nbsp;GB&nbsp;RAM, но&nbsp;нагрузка на&nbsp;систему и&nbsp;скорость генерации ответов часто будут далеки от&nbsp;комфортных значений.

Например, на&nbsp;моём немолодом Intel Core i7-10510U @ 8x 4.9GHz неаккуратный запрос к&nbsp;`llama2` может заставить систему шуршать вентиляторами пару-тройку минут. При этом `phi` на&nbsp;этом&nbsp;же процессоре способна отвечать на&nbsp;какие-нибудь не&nbsp;очень сложные вопросы практически мгновенно.

К&nbsp;счастью, у&nbsp;меня случайно завалялся MacBook на&nbsp;процессоре M1&nbsp;и&nbsp;он&nbsp;уже показывает куда более впечатляющие результаты. `Mistral` даже на&nbsp;непростые запросы отвечает за&nbsp;считанные секунды, а&nbsp;в&nbsp;режиме чата токены вылетают на&nbsp;экран заметно быстрее, чем в&nbsp;веб-интерфейсе ChatGPT.

Неприятным открытием стало то, что docker-версия Ollama на&nbsp;MacOS выполняется заметно медленнее (от&nbsp;3&nbsp;до&nbsp;5&nbsp;раз, если верить ощущениям), чем нативная. Возможно, всё дело в&nbsp;том, что я&nbsp;как-то неправильно настроил docker или приложение в&nbsp;контейнере нужно запускать с&nbsp;какими-нибудь специальными флагами для максимальной утилизации ресурсов. В&nbsp;любом случае, к&nbsp;порядку на&nbsp;этом ноутбуке я&nbsp;отношусь гораздо менее трепетно, поэтому просто установил и&nbsp;использую приложение с&nbsp;сайта Ollama.

<div id='why'></div>

## Зачем всё это нужно?

Конечно, GhatGPT умнее и&nbsp;умеет из&nbsp;коробки гораздо больше.<br>
Конечно, ChatGPT требует меньше телодвижений для использования.<br>
Конечно, самые умные модели требуют внушительных ресурсов, ведь для запуска нашумевшей [mixtral](https://ollama.ai/library/mixtral) или аналогичной модели нужно иметь 48&nbsp;Gb&nbsp;оперативной памяти.<br>
Кончено, сидя в&nbsp;кафе задать вопрос Bard от&nbsp;Google гораздо проще, чем достучаться до&nbsp;модели в&nbsp;закрытом ноутбуке, который остался дома.<br>

Я&nbsp;всё это прекрасно понимаю, но&nbsp;ничего из&nbsp;этого не&nbsp;стоит того, чтобы добровольно ставить себя в&nbsp;зависимость от&nbsp;монополистов с&nbsp;их&nbsp;закрытыми чёрными ящиками.

Даже если закрыть глаза на&nbsp;все идеологические вопросы, то&nbsp;любая локальная LLM отличается от&nbsp;любого облачного провайдера тем, что:
- Может работать в&nbsp;оффлайне.
- Не&nbsp;хранит и&nbsp;не&nbsp;сливает вашу переписку.
- Не&nbsp;станет завтра тупее, чем есть сегодня.
- Не&nbsp;забанит тебя за&nbsp;возмутивший кого-то там запрос.
- Обладает тем уровнем цензуры, который выбрал ты&nbsp;сам.

Я&nbsp;искренне рад, что для доступа даже к&nbsp;передовым технологиям, всё ещё не&nbsp;обязательно поступаться своей приватностью и&nbsp;своими свободами.

---

При написании этого поста не&nbsp;была использована ни&nbsp;одна LLM =)
