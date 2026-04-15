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
to get people to switch to XMPP.

For a long time, ICQ was extremely popular around me,
but the proprietary messenger kept breaking things for people
using alternative clients, which was quite annoying.
After yet another round of this pointless battle
I realized clearly that I prefer protocols over services.

I didn’t have much success back then,
but fortunately, XMPP (and I hope I have too)
has continued moving forward over the past two decades.
It has developed slowly, sometimes awkwardly, but steadily.

Here, I won’t talk about why XMPP is great or how it works.
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

**OMEMO** is a&nbsp;<a
  href='https://omemo.top/'
  target='_blank'>widely supported</a>
XMPP Extension Protocol (XEP)
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

This section introduces some basics of end-to-end encryption.

If you're already familiar with the concepts and terminology,
you can skip ahead to&nbsp;<a
  href='#practical-aspects-of-omemo-and-xmpp'>how end-to-end encryption affects the XMPP user experience</a>
or jump straight to the <a
  href='#step-by-step-guide'>step-by-step workflow</a>&nbsp;I personally use.

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

In general, the XMPP experience today
could be described as a "WhatsApp with benefits and frictions".
It's kinda ironic, considering that WhatsApp’s protocol
is actually based on XMPP, but incompatibly altered and defederated.

### Keys, Fingerprints and Trust

OMEMO is based on the
<a href='https://en.wikipedia.org/wiki/Double_Ratchet_Algorithm' target='_blank'>
  Double Ratchet Algorithm</a>.
While the internal details are quite interesting,
for practical purposes it's enough to know that
each client stores some cryptographic keys
and can derive a hash from them, commonly called a fingerprint.

Keys are usually managed automatically by the XMPP client,
and in normal use you should never need to handle them manually.
In fact, you probably don’t even need to know what they look like.

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
From a practical standpoint,
the server-side MAM archive is better considered a cache:
it can help you handle recent messages after a short period offline
or synchronize conversations across multiple devices.

At the end of the day, keeping your chat history is your responsibility,
and this is a good place to apply a local-first approach.


### Synchronisation

Seamless switching between clients is handled by
**XEP-0280: Message Carbons**.
Before its introduction, only incoming messages were synced between devices,
while your own outgoing messages were not.
Protocol-level mirroring of your own messages
is a rather non-obvious feature :D

It's important to note that with end-to-end encryption,
the concept of trusted fingerprints also applies to your own clients.
For seamless synchronisation of outgoing messages,
all your clients must trust each other's fingerprints.
A new client,
or an old one that was not trusted at the time messages were sent,
will receive the full history from MAM but will not be able to decrypt it.
<br>Yes, even your own messages.

In theory, re-encrypting messages on already trusted clients
could solve this issue, but no XMPP client implements it yet.
So in practice you may need to manually resend
some data to a new device.

### Message Correction

It’s worth keeping in mind that
features that seem simple and straightforward at first glance,
such as message editing and deletion,
actually rely on client-side implementation
and may not behave for your recipient the way you expect.

They’re fine to use and are well supported in some clients,
but you shouldn’t rely on them to hide anything.

### Maintenance

OMEMO was designed as a set-it-and-forget-it solution,
and it mostly succeeds in that goal.
If you have a basic understanding of how the protocol works
and check in online from time to time,
there shouldn’t be any surprises.

All maintenance comes down to making regular backups
and notifying your contacts
when fingerprints are added or no longer valid
so they can keep their trust list up to date.

## Step-by-Step Guide

Let’s say I have a XMPP account, `me@some.server`,
and a few devices: a phone, a laptop, and a desktop computer.
First I’ll describe my mindset at a high level,
then I’ll add some notes about specific clients.

### Client Roles

On the one hand, I have my phone.
It’s almost always with me and almost always online.
That’s where I keep the full chat history and get real-time notifications.

On the other hand, I have a couple of desktop applications.
I only open them when I need to discuss something using my keyboard
or share some text between devices.
I like to think of them as satellite clients.

### Before the Start

First, enable OMEMO encryption on every client if it isn't enabled by default.

The next step is to add all clients to the trust list on each device:
my phone should trust all my computers,
and my computers should trust each other as well as my phone.

Fingerprints do not have to be secret, so they can be published on
your website or even on social media profiles.
Here is my page with the fingerprints, for example:
<br><a href='https://oddsquat.org/about/keys/' target='_blank'>
  https://oddsquat.org/about/keys/
</a>

### Start the Conversation in Person

Let’s say I meet Alice,
we start talking, and then decide to continue the conversation online.

I open a special QR code on my phone, and Alice scans it with her client.
This QR code already contains the fingerprints of all my devices,
so no extra steps are needed on her phone.
After that, I do the same and scan her QR code as well.

Later at home, I manually mark her devices as trusted on my computers
using the trusted list on my phone, and she does the same.

Now we are both sure that it is really us in the conversation,
and that all messages will be available on all our devices and only on them.

### Start the Conversation Online

Let’s say Bob and I start discussing something
on a forum or in the Fediverse,
and then decide to continue the discussion on XMPP.

Bob starts the chat. I trust the first device he messages me from,
and then we exchange fingerprints for our other devices, if we have any.
This approach is called TOFU (Trust On First Use).

Bob can confirm it’s really me using my page with fingerprints.
I can confirm it’s really him by asking him to send his fingerprints
in a private message on the same forum or via email.

Ideally, Bob also has a public page with his fingerprints.
That way, we can both independently verify
that we are who we say we are.

### New or Lost Devices

If I start using a new device or install another client application,
the first thing I do is add it to the list of trusted clients
on my existing devices.

If I lose one of my devices or delete any private keys,
the first thing I do is remove the corresponding client
from the trusted list on my other devices.

Once I’ve updated all my personal lists,
I should inform my contacts about changes via trusted channels.

I can simply ask Alice to scan my new QR code the next time we meet,
and send Bob a message introducing my new client or letting him know
that the lost device is no longer trusted
and that no real messages will ever come from it again.

## Client Applications

This section describes how OMEMO is used in specific client applications
that I personally use.

### Conversations and Forks

Conversations is a modern, fully featured chat application for Android.
It supports everything a messaging app should support:
chats, voice calls, video calls, and sharing files of any kind.

There are several forks of it where the UI or UX may differ,
but the core features work exactly the same.
I personally use Monocles Chat.

On the Contact Details screen (including your own account),
you can see a list of published fingerprints
and manually mark them as trusted or revoke trust.

To simplify all these routine operations, a QR-code-based system is used:
you can show your own QR code or scan other people’s codes
directly from the main screen.
This makes device verification during in-person meetings simple and effortless.

### Dino

Dino is a lightweight GTK-based GUI client.

It can be considered a fully functional one,
although some non-essential features are still not implemented.
For example,
it is not possible to clear local chat history using built-in methods :D

Trust and untrust decisions can be easily managed
in the Encryption tab of the Conversation Details window.

It is important to note that, by default, Dino is configured
to automatically trust new fingerprints.
I recommend disabling this feature.

### Profanity

Profanity is a powerful TUI client
where everything is controlled through a built-in command system.

If you somehow intend to use it,
you can find a small cheat sheet for the `/omemo` command below.
However, I strongly recommend reading the full documentation.

- Generate a key and add your other clients:
  ```text
  /omemo gen
  /omemo trust me@some.server some-cool-fingerprint-01
  /omemo trust me@some.server another-cool-fingerprint
  /omemo qrcode
  ```

- View the list of your own or someone else’s fingerprints:
  ```text
  /omemo fingerprint me@some.server
  /omemo fingerprint alice@another.server
  ```
  Trusted ones will be marked as `trusted`.

- Start an encrypted conversation:
  ```text
  /omemo start alice@another.server
  ```

- Add fingerprints to the trusted list:
  ```text
  /omemo trust alice@another.server some-cool-fingerprint-02
  /omemo trust alice@another.server some-cool-fingerprint-03
  /omemo trust bob@another.server some-cool-fingerprint-04
  ```

- Revoke trust for a specific client:
  ```text
  /omemo untrust alice@another.server some-cool-fingerprint-02
  ```

## Late Disclaimer

This post was originally intended as a collection of answers to questions
I had when I first started using XMPP with OMEMO.

It isn’t meant to be exhaustive or formal,
but rather to clarify the practical side of things
and reduce that initial feeling of being lost
when you keep running into
"The message was not encrypted for this device"
over and over again.

From now on, I hope you won’t encounter errors like this
or any other issues with end-to-end encryption in XMPP.
