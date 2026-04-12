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
At that time, the proprietary messenger once again made life harder
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

## Basic Concepts

Here I'm going to explain some basic ideas behind e2e.

Если основные концепции и терминология вам знакомы,
то можете смело пропустить этот раздел
и перейти к особенностям их практического применения касательно XMPP.

Или даже сразу перейти к описанию workflow, которого я придерживаюсь сам.

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

OMEMO построен вокруг Double Ratchet Algorithm.
Там внутри всё очень интересно,
но нам для практического применения важно только то,
что каждый клиент пользователя хранит в себе какие-то там ключи,
и умеет получать из них какой-то там хэш,
который принято называть fingerprint.

Ключи обычно как-то автоматически управляются XMPP клиентом
и в норме вам никогда не стоит трогать их руками.
Возможно, вам лучше даже и не знать, как они выглядят.
Единственное, что с ними нужно делать --
держать в секрете и бэкапить при необходимости.

Фингерпринт позволяет отличать конкретный
клиент собеседника и быть уверенным, что его не подмененили.
Список фингерпринтов для конкретного аккаунта
не является чем-то секретным:
клиентские приложения сами анонсируют свои фингерпнинты на сервере
и автоматически пополняют список чужих.
Значение имеют только те,
которые вы пометили как фингерпринты довереных клиентов.

В идеале, человек должен лично при встрече
или по уже довереному и безопасному каналу связи
сказать вам "Да, фингерпринт XXX принадлежит моему устройству"
и только после этого вы помечаете XXX доверенным.
Обычно в интерфейсе это просто проставление чекбокса или сканирование QR-кода.

Некоторые клиенты для удобства пользователя
довериют любым новым фингерпринтам контактов по-умолчанию,
но я не стал бы рекомендовать использовать такую политику,
это легкомысленно и небезопасно.
Политики доверия или недоверия
можно посмотреть или поменять в настройках вашего клиента.

Список доверенных фингерпринтов используется в момент отправки сообщения:
OMEMO творит какую-то магию с жонглированием ключами и
ни один клиент, кроме перечисленных в списке на момент зашифровки,
не сможет его впоследствии расшифровать.
Передать как-то доверие в прошлое, увы, невозможно.

## Реалии OMEMO и XMPP

### Chat History

Вообще, XMPP поддерживает хранение истории переписок на сервере.
За это отвечает **XEP-0313: Message Archive Management**.

В реальности поддержка этого XEP,
политика хранения истории и особенно сроки хранения сообщений
зависят от конкретного сервера.
Рассчитывать по-умолчанию на бессрочное хранение всех переписок не стоит.

В конечном счёте,
ответственность за хранение переписок лежит исключительно на вас
и это разумное место для применения local-first подхода.

С практической точки зрения
проще всего рассматривать серверный архив сообщений
как некоторый кэш, который выручит вас по возвращении
из непродолжительного офлайна
или поможет с синхронизацей текущей переписки между разными устройствами.

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

### Message Editing

Тут же стоит отметить, что такие простые и понятные на первый взгляд фичи
как редактирование и удаление сообщений вообще-то полагаются на
клиентский код и могут не сработать у вашего собеседника так,
как вы этого ожидаете.
Ими можно пользоваться,
это удобно и некоторые клиенты их отлично поддерживают,
но полагаться на них для сокрытия чего-либо не стоит.

## Mindset
## Before the Start
## Checking the Keys
## In case of fire
