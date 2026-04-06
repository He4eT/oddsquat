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
Not even the server owner or your carrier has the keys
needed to decrypt or modify them.

**XMPP** is an extensible protocol for instant messaging.
It's open, decentralized, and mature.

**OMEMO** is a widely supported XMPP Extension Protocol (XEP)
for secure multi-client end-to-end encryption.
You can read more about
it on a&nbsp;<a
  href='https://contrapunctus.codeberg.page/the-quick-and-easy-guide-to-xmpp.html'
  target='_blank'>dedicated page by Daniel Gultsch</a>.

## Trade-offs Between Safety and Convenience

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
It's kinda funny, considering that WhatsApp’s protocol
is actually based on XMPP, but incompatibly altered and defederated.
