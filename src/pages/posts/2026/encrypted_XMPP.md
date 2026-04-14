---

layout: post
lang: 'en'
year: '2026'
date: '2026-04-07'
section: 'posts'

title: 'encrypted_XMPP'
description: 'Secure and private messaging with XMPP and OMEMO encryption.'

---

# End-to-End Encryption in XMPP with OMEMO

I find it funny that twenty years ago I was already trying
to promote XMPP over ICQ to my classmates.
At the time, the proprietary messenger kept making life harder
for users of alternative clients.
That’s when I realized that I prefer protocols over services.

I didn’t have much success back then,
but fortunately, XMPP (and I hope I have too)
has continued moving forward over the past two decades.
It has developed slowly, sometimes awkwardly, but steadily.

Here I won’t talk about why XMPP is great or how to use it.
You can check
<a
  href='https://contrapunctus.codeberg.page/the-quick-and-easy-guide-to-xmpp.html'
  target='_blank'>
  this guide</a>
(one of many) and I’d rather not write another one.
In this post, I want to focus specifically on end-to-end encryption
and the practical aspects of using it.

## Short Glossary

**End-to-end encryption** is a way to keep your chats truly private.<br>
Only you and the person you’re messaging can read the messages.
Not even the server owner has the keys needed to decrypt or modify them.

**XMPP** is an extensible protocol for instant messaging.
It's open, decentralized, and mature.

**OMEMO** is a widely supported XMPP Extension Protocol (XEP)
for secure multi-client end-to-end encryption.
You can read more about
it on a&nbsp;<a
  href='https://contrapunctus.codeberg.page/the-quick-and-easy-guide-to-xmpp.html'
  target='_blank'>dedicated page by Daniel Gultsch</a>.

**Client**, in this post,
means a specific instance of an XMPP application on a user device.
<br>OMEMO-related documentation uses the term Device,
but I find it potentially confusing:
in practice, a single physical device can run multiple independent clients.

## Basic Concepts

This section introduces some basic ideas behind end-to-end encryption.

If you're already familiar with the concepts and terminology,
you can skip ahead to&nbsp;<a
  href='#'>how end-to-end encryption affects the XMPP user experience</a>
or jump straight to the <a
  href='#'>step-by-step workflow</a>&nbsp;I personally use.

### Trade-offs Between Safety and Convenience

Unfortunately, things that are truly secure are rarely convenient.
They often require some initial efforts and a bit of ongoing attention.

Telegram, which used to be a benchmark for messenger usability
before its long dive into enshitification,
really draws the line between convenience and security.
Regular chats are easy and flexible,
but "secret" chats come with a full set of limitations:
they’re one-on-one only,
can’t be synced to another device,
aren’t available on desktop at all,
and so on.

All commercial so-called "secure" messengers, like Signal or WhatsApp,
end up with pretty similar limitations,
because it's tricky to make end-to-end encrypted chats
work the way users expect.

Luckily, protocols and cryptography don’t care about
convenience or user expectations.
Many XMPP clients let you do almost anything you’re trying to do.
Sometimes it’s clunky and unintuitive,
sometimes it’s the kind of freedom that lets you shoot yourself in the foot.
At the end of the day, you’d better understand what you’re doing.

It might sound messy, but for that price, XMPP actually
gives you a lot of handy features:
your chats are secured with Signal-grade end-to-end encryption,
and you can use as many devices as you want,
all at the same time,
without being tied to any proprietary service.
This post is here to show how to use it intentionally and safely.

In general, the XMPP experience today
could be described as a "WhatsApp with benefits and frictions".
It's kinda ironic, considering that WhatsApp’s protocol
is actually based on XMPP, but incompatibly altered and defederated.

### Keys, Fingerprints and Trust

OMEMO is based on the Double Ratchet Algorithm.
While the internal details are quite interesting,
for practical purposes it's enough to know that
each client stores some cryptographic keys
and can derive a hash from them, commonly called a fingerprint.

Keys are usually managed automatically by the XMPP client,
and in normal use you should never need to handle them manually.
In fact, you probably don’t even need to know what they look like.
The only thing you need to do is keep them secret
and back them up if necessary.

A fingerprint lets you identify a specific client of your contact
and verify that it hasn’t been spoofed.
Fingerprints for an account are not secret:
clients publish their own fingerprints to the XMPP server
and automatically receive the fingerprints of others.
Only fingerprints you explicitly mark as trusted are relevant.

In an ideal scenario, the contact should confirm in person
or through an already trusted and secure communication channel
that the fingerprint belongs to their device,
and only then you mark it as trusted.
In most XMPP clients this is simply done by ticking a checkbox
or by scanning a QR code.

The list of trusted fingerprints is used at the moment a message is sent.
Behind the scenes, OMEMO performs a certain amount of key management,
and only the clients that are present in the trusted list
at the time of encryption will be able to decrypt the message later.

It's important to understand that trust cannot be applied retroactively:
it's not possible to "extend" trust to new clients
after a message has already been encrypted and sent.

## Practical Aspects of OMEMO and XMPP

### Chat History

In theory, XMPP supports server-side message history storage via
**XEP-0313: Message Archive Management**.

In practice, support for this XEP,
as well as retention policies and message lifetime,
depends on the specific server.
You should never assume that all conversations are stored
indefinitely by default.

At the end of the day, keeping your chat history is your responsibility,
and this is a good place to apply a local-first approach.

From a practical standpoint,
the server-side archive is better considered a cache:
it can help you handle recent messages after a short period offline
or synchronize conversations across multiple devices.

### Synchronisation

За бесшовное переключение между клиентами отвечает
**XEP-0280: Message Carbons**.
До его внедрения можно было переключиться с телефона на лэптоп
и пялиться в загруженную историю переписки,
состоящей только из входящих сообщений от собеседника.
Отправка своих же сообщений ещё и самому себе
на уровне протокола -- это довольно неочевидная фича.

Тут важно упомянуть, что при использовании e2e шифрования,
упомянутая выше концепция доверенных отпечатков пальцев
распространяется и на свои клиенты тоже.

Для бесшовной синхронизации исходящих сообщений
все ваши клиенты должны считать фингерпринты друг друга доверенными,
иначе можно столкнуться с ситуацией,
когда не получается прочитать своё же сообщение.

Логичное, но неприятное следствие:
Новый клиент или старый,
который не был в списке доверенных на момент отправки сообщений,
получит историю из MAM, но не сможет её расшифровать.
Да, даже ваши сообщения.
Теоретически, перепаковка сообщений
на старых доверенных клиентах вроде как возможна,
но на практике, никто такое пока не имплементировал
и важные вещи придётся пересылать вручную.

### Message Correction

Тут же стоит отметить, что такие простые и понятные на первый взгляд фичи
как редактирование и удаление сообщений вообще-то полагаются на
клиентский код и могут не сработать у вашего собеседника так,
как вы этого ожидаете.
Ими можно пользоваться,
это удобно и некоторые клиенты их отлично поддерживают,
но полагаться на них для сокрытия чего-либо не стоит.

### Maintenance

OMEMO был задуман как решение, которое после настройки не требует какого-то
дополнительного вмешательства.
Можно считать, что этой заявленной цели удалось достичь
и при наличии базового понимания работы протокола и регулярном онлайне
никаких сюрпризов быть не должно.

Всё обслуживание заключается в регулярных бэкапах и
уведомлении своих контактов о фингерпринтах,
которые стоит добавить в список доверенных или убрать из него.
В нашем локальном хакспейсе мы даже проводим для этого регулярные события =)

## Step-by-step guide

Представим, что у меня есть аккаунт jid@some.server и несколько устройств:
телефон, ноутбук и настольный компьютер.
Сначала я опишу воркфлоу общими словами,
а потом дам уточнения про использование конкретных приложений.

Я предпочитаю следовать такому майндсету:
С одной стороны,
у меня есть мобильное устройство,
которое всегда со мной и практические всегда онлайн:
на нём я храню полную историю переписок и получаю уведомления в реальном
времени.
С другой стороны, у меня есть несколько десктопных приложений:
я открываю их только когда мне нужно обсудить что-нибудь с использованием
клавиатуры или копи-пастинга.
Мне нравится думать о них, как о приложениях-сателлитах.

### Before the Start

Первым делом мне нужно сгенерировать на каждом устройстве приватные ключи.
Обычно это происходит автоматически.

Потом я должен на каждом своём устройстве добавить остальные:
телефон должен считать все мои компьютеры доверенными устройствами,
а компьютеры доверять друг другу и телефону.

Фингерпринты публичные,
их можно даже разместить у себя на какой-нибудь личной странице.
Вот, например, моя: https://oddsquat.org/about/keys/

### Start the Conversation in Person

Предположим, я встретил Алису и мы решили обменяться контактами.
Я открыл на телефоне специальный QR-код,
затем Алиса считала его своим клиентом.
В этот QR-код уже зашиты фингерпринты всех моих устройств, так что
дополнительных действий не требуется.
Аналогично, я своим мобильным клиентом считываю QR-код с экрана Алисы.

Теперь мы оба уверены, что в переписке будем участвовать именно мы,
а все наши сообщения будут доступны на всех наших устройствах и только на них.

### Start the Conversation Online

Предположим, что мы начали обсуждать что-то с Бобом где-то в сети
(на форуме, в федиверсе, не важно) и решили продолжить обсуждение в мессенджере.

Боб инициирует переписку, я слепо доверяю первому устройству,
с которого он мне написал и уже потом мы обмениваемся в переписке
фингерпринтами остальных наших устройств, если они есть.
Такая стратегия называется ToFu.

Опять же Боб может убедиться, что я это я с помощью моей страницы с ключами,
а я могу убедиться, что Боб на форуме -- тот же самый Боб, попросив его
прислать мне фингерпринты прямо в личных сообщениях на том же самом форуме или
отдельно посредством email, например.

В идеальном случае,
у Боба тоже есть какая-то публичная страница с фингерпринтами.
Тогда мы оба можем независимо убедиться,
что мы именно те, за кого себя выдаём =)

### New or Lost Devices

Если я решил начать использовать
какое-то новое устройство или установить куда-нибудь
ещё одно клиентское приложение,
то первым делом я должен добавить его в список доверенных клиентов
на остальных моих существующих устройствах.

Если я по каким-либо причинам потеряю любое из своих устройств
или зачем-то удалю один из своих приватных ключей,
то первым делом я должен исключить такой клиент из списка доверенных
на остальных моих устройствах.

После актуализации моих личных списков доверенных устройств
стоит сообщить об изменениях моим собеседникам по довереным каналам.
Я могу просто попросить Алису считать мой новый QR-код при следующей встрече,
а Бобу отправить сообщение о том,
что утраченому устройству доверять больше не стоит,
настоящих сообщений с него уже никогда не придёт.

## Client Applications

Этот раздел описывает особенности применения OMEMO для конкретных клиентов,
которыми я пользуюсь сам.

### Conversations, Monocles and Other Forks

Conversation - это современное полнофункциональное чат-приложение.
Оно поддерживает всё, что должно поддерживать:
переписки, звонки, отправку фотографий и файлов.
У него есть несколько форков, в которых UX может отличаться,
но core-фичи работают абсолютно одинаково.

На экране с информацией о конакте (в том числе и о своём аккаунте)
можно увидеть список фингерпринтов,
вручную отметить галочкой доверенные или отозвать доверие.

Упростить все эти рутинные вещи призвана система с QR-кодами:
прямо на главном можно показать свой код или считать чужой.
Так верификация устройств при личной встрече становится простой и ненапряжной.

Правило большого пальца - сканируй QR-код при каждом удобном случае.

### Dino

Это лёгкий GUI-клиент, построенный на GTK фреймвоке.
Опять же, все вопросы доверия и недоверия
можно легко решить на экране "Детали контакта" с помощью чекбоксов.

К сожалению, по умолчанию, Dino настроен на автоматическое доверие
новым фингерпринтам, я рекомендую эту функцию отключить.

### Profanity

Это могучий TUI-клиент,
где всё-всё-всё реализовано через встроенную систему команд.

Если вы зачем-то намерены им пользоваться,
то ниже вас ожидает небольшой читшит по использованию OMEMO,
но я настойчиво рекомендую ознакомиться с полной документацией самостоятельно.

- Генерация ключа и добавление своих устройств:
  ```text
  /omemo gen
  /omemo trust me@some.server some-cool-fingerprint-01
  /omemo trust me@some.server another-cool-fingerprint
  /omemo qrcode
  ```

- Увидеть список своих или чужих fingerprint'ов:
  ```text
  /omemo fingerprint me@some.server
  /omemo fingerprint alice@another.server
  ```
  Доверенные будут помечены как `trusted`.

- Начать зашифрованный диалог:
  ```text
  /omemo start alice@another.server
  ```

- Добавить чужой фингерпринт в список доверенных:
  ```text
  /omemo trust alice@another.server some-cool-fingerprint-02
  /omemo trust alice@another.server some-cool-fingerprint-03
  /omemo trust bob@another.server some-cool-fingerprint-04
  ```

- Перестать доверять кокретному клиенту:
  ```text
  /omemo untrust alice@another.server some-cool-fingerprint-02
  ```
