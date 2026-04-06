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
It has developed slowly, sometimes awkwardly, but still.

Here I won’t talk about why XMPP is great or how to use it.
You can check
<a
  href='https://contrapunctus.codeberg.page/the-quick-and-easy-guide-to-xmpp.html'
  target='_blank'>
  this guide</a>
(one of many) and I’d rather not write another one.
In this post, I want to focus specifically on end-to-end encryption
and the practical aspects of using it.

## Draft

Мне кажется забавным, что двадцать лет назад я уже пытался продвигать своим
одноклассникам XMPP в качестве замены ICQ.
Тогда проприетарный мессенджер начал в очередной раз
вставлять палки в колёса альтернативным
клиентам и я в первый раз ярко осознал,
что "протоколы" мне нравятся гораздо больше чем "сервисы".

В тот раз я больших успехов достигнуть не получилось,
но, к счастью, все эти два десятилетия XMPP не стоял на месте,
а неторопливо и неуверено развивался.

Рассказывать, чем XMPP хорош и как им пользоваться я не буду,
об этом можно почитать в этом гайде, я лучше не напишу.
В этом посте я хочу обсудить вопрос конкретно вопрос e2e-шифрования
и практические аспекты его использования.
