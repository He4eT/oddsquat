---

layout: post
lang: 'en'

title: 'encrypted XMPP'
description: 'Secure and private messaging with XMPP and OMEMO encryption.'

section: 'posts'
year: '2026'
date: '2026-04-07'

---

# End-to-End Encryption in&nbsp;XMPP with OMEMO

I&nbsp;find it&nbsp;funny that twenty years ago I&nbsp;was already trying
to&nbsp;get people to&nbsp;switch to&nbsp;XMPP.

For a&nbsp;long time, ICQ was extremely popular around me,
but the proprietary messenger kept breaking things for people
using alternative clients, which was quite annoying.
After yet another round of&nbsp;this pointless battle
I&nbsp;realized clearly that I&nbsp;prefer protocols over services.

I&nbsp;didn’t have much success back then,
but fortunately, XMPP (and I&nbsp;hope I&nbsp;have too)
has continued moving forward over the past two decades.
It&nbsp;has developed slowly, sometimes awkwardly, but steadily.

Here, I&nbsp;won’t talk about why XMPP is&nbsp;great or&nbsp;how it&nbsp;works.
You can check
<a
  href='https://contrapunctus.codeberg.page/the-quick-and-easy-guide-to-xmpp.html'
  target='_blank'>
  this guide</a>
(one of&nbsp;many) and I’d rather not write another one.
In&nbsp;this post,
I&nbsp;want to&nbsp;focus specifically on&nbsp;end-to-end encryption
and the practical aspects of&nbsp;using it.

## Short Glossary

**End-to-end encryption** is&nbsp;a&nbsp;way
to&nbsp;keep your chats truly private.<br>
Only you and the person you’re messaging can read the messages.
Not even the server owner has the keys
needed to&nbsp;decrypt or&nbsp;modify them.

**XMPP** is&nbsp;an&nbsp;extensible protocol for instant messaging.
It’s open, decentralized, and mature.

**OMEMO** is&nbsp;a&nbsp;<a
  href='https://omemo.top/'
  target='_blank'>widely supported</a>
XMPP Extension Protocol (XEP)
for secure multi-client end-to-end encryption.
You can read more about
it&nbsp;on&nbsp;a&nbsp;<a
  href='https://conversations.im/omemo/'
  target='_blank'>dedicated page by&nbsp;Daniel Gultsch</a>.

**Client**, in&nbsp;this post,
means a&nbsp;specific instance
of&nbsp;an&nbsp;XMPP application on&nbsp;a&nbsp;user device.
<br>OMEMO-related documentation uses the term Device,
but I&nbsp;find it&nbsp;potentially confusing:
in&nbsp;practice, a&nbsp;single physical device
can run multiple independent clients.

## Basic Concepts

This section introduces some basics of&nbsp;end-to-end encryption.

If&nbsp;you’re already familiar with the concepts and terminology,
you can skip ahead to&nbsp;<a
  href='#practical-aspects-of-omemo-and-xmpp'>how end-to-end encryption
  affects the XMPP user experience</a>,
or&nbsp;jump straight to&nbsp;the <a
  href='#step-by-step-guide'>step-by-step workflow</a> I&nbsp;personally use.

### Trade-offs Between Safety and Convenience

Unfortunately, things that are truly secure are rarely convenient.
They often require some initial efforts
and a&nbsp;bit of&nbsp;ongoing attention.

Telegram, which used to&nbsp;be&nbsp;a&nbsp;benchmark for messenger usability
before its long dive into enshitification,
really draws the line between convenience and security.
Regular chats are easy and flexible,
but “secret” chats come with a&nbsp;full set of&nbsp;limitations:
they’re one-on-one only,
can’t be&nbsp;synced to&nbsp;another device,
aren’t available on&nbsp;desktop at&nbsp;all,
and so&nbsp;on.

All commercial so-called “secure” messengers, like Signal or&nbsp;WhatsApp,
end up&nbsp;with pretty similar limitations,
because it’s tricky to&nbsp;make end-to-end encrypted chats
work the way users expect.

Luckily, protocols and cryptography don’t care about
convenience or&nbsp;user expectations.
Many XMPP clients let you do&nbsp;almost anything you’re trying to&nbsp;do.
Sometimes it’s clunky and unintuitive,
sometimes it’s the kind of&nbsp;freedom
that lets you shoot yourself in&nbsp;the foot.
At&nbsp;the end of&nbsp;the day, you’d better understand what you’re doing.

It&nbsp;might sound messy, but for that price, XMPP actually
gives you a&nbsp;lot of&nbsp;handy features:
your chats are secured with Signal-grade end-to-end encryption,
and you can use as&nbsp;many devices as&nbsp;you want,
all at&nbsp;the same time,
without being tied to&nbsp;any proprietary service.

In&nbsp;general, the XMPP experience today
could be&nbsp;described as&nbsp;a&nbsp;“WhatsApp with benefits and frictions”.
It’s kinda ironic, considering that WhatsApp’s protocol
is&nbsp;actually based on&nbsp;XMPP, but incompatibly altered and defederated.

### Keys, Fingerprints and Trust

OMEMO is&nbsp;based on&nbsp;the <a
  href='https://en.wikipedia.org/wiki/Double_Ratchet_Algorithm'
  target='_blank'>
  Double Ratchet Algorithm</a>.
While the internal details are quite interesting,
for practical purposes it’s enough to&nbsp;know that
each client stores some cryptographic keys
and can derive a&nbsp;hash from them, commonly called a&nbsp;fingerprint.

Keys are usually managed automatically by&nbsp;the XMPP client,
and in&nbsp;normal use you should never need to&nbsp;handle them manually.
In&nbsp;fact, you probably don’t even need to&nbsp;know what they look like.

A&nbsp;fingerprint lets you identify
a&nbsp;specific client of&nbsp;your contact
and verify that it&nbsp;hasn’t been spoofed.
Fingerprints for an&nbsp;account are not secret:
clients publish their own fingerprints to&nbsp;the XMPP server
and automatically receive the fingerprints of&nbsp;others.
Only fingerprints you explicitly mark as&nbsp;trusted are relevant.

In&nbsp;an&nbsp;typical scenario, the contact should confirm in&nbsp;person
or&nbsp;through an&nbsp;already trusted and secure communication channel
that the fingerprint belongs to&nbsp;their device,
and only then you mark it&nbsp;as&nbsp;trusted.

The list of&nbsp;trusted fingerprints
is&nbsp;used at&nbsp;the moment a&nbsp;message is&nbsp;sent.
Behind the scenes,
OMEMO performs a&nbsp;certain amount of&nbsp;key management,
and only the clients that are present in&nbsp;the trusted list
at&nbsp;the time of&nbsp;encryption
will be&nbsp;able to&nbsp;decrypt the message later.

It’s important to&nbsp;understand
that trust cannot be&nbsp;applied retroactively:
it’s not possible to&nbsp;“extend” trust to&nbsp;new clients
after a&nbsp;message has already been encrypted and sent.

<h2 id='practical-aspects-of-omemo-and-xmpp'>
  Practical Aspects of&nbsp;OMEMO and XMPP
</h2>

### Chat History

In&nbsp;theory, XMPP supports server-side message history storage via
**XEP-0313: Message Archive Management**.

In&nbsp;practice, support for this XEP,
as&nbsp;well as&nbsp;retention policies and message lifetime,
depends on&nbsp;the specific server.
You should never assume that all conversations are stored
indefinitely by&nbsp;default.
From a&nbsp;practical standpoint,
the server-side MAM archive is&nbsp;better considered a&nbsp;cache:
it&nbsp;can help you handle recent messages after a&nbsp;short period offline
or&nbsp;synchronize conversations across multiple devices.

At&nbsp;the end of&nbsp;the day,
keeping your chat history is&nbsp;your responsibility,
and this is&nbsp;a&nbsp;good place to&nbsp;apply a&nbsp;local-first approach.


### Synchronisation

Seamless switching between clients is&nbsp;handled by
**XEP-0280: Message Carbons**.
Before its introduction, only incoming messages were synced between devices,
while your own outgoing messages were not.
Protocol-level mirroring of&nbsp;your own messages
is&nbsp;a&nbsp;rather non-obvious feature :D

It’s important to&nbsp;note that with end-to-end encryption,
the concept of&nbsp;trusted fingerprints also applies to&nbsp;your own clients.
For seamless synchronisation of&nbsp;outgoing messages,
all your clients must trust each other’s fingerprints.
A&nbsp;new client,
or&nbsp;an&nbsp;old one that was not trusted
at&nbsp;the time messages were sent,
will receive the full history from MAM
but will not be&nbsp;able to&nbsp;decrypt it.
<br>Yes, even your own messages.

In&nbsp;theory, re-encrypting messages on&nbsp;already trusted clients
could solve this issue, but no&nbsp;XMPP client implements it&nbsp;yet.
So&nbsp;in&nbsp;practice you may need to&nbsp;manually resend
some data to&nbsp;a&nbsp;new device.

### Message Correction

It’s worth keeping in&nbsp;mind that
features that seem simple and straightforward at&nbsp;first glance,
such as&nbsp;message editing and deletion,
actually rely on&nbsp;client-side implementation
and may not behave for your recipient the way you expect.

They’re fine to&nbsp;use and are well supported in&nbsp;some clients,
but you shouldn’t rely on&nbsp;them to&nbsp;hide anything.

### Maintenance

OMEMO was designed as&nbsp;a&nbsp;set-it-and-forget-it solution
and mostly succeeds in&nbsp;that goal.
If&nbsp;you have a&nbsp;basic understanding of&nbsp;how the protocol works
and check in&nbsp;online from time to&nbsp;time,
there shouldn’t be&nbsp;any surprises.

All maintenance comes down to&nbsp;making regular backups
and notifying your contacts
when fingerprints are added or&nbsp;no&nbsp;longer valid
so&nbsp;they can keep their trust list up&nbsp;to&nbsp;date.

## Step-by-Step Guide

Let’s say I&nbsp;have a&nbsp;XMPP account, `me@some.server`,
and a&nbsp;few devices:
a&nbsp;phone, a&nbsp;laptop, and a&nbsp;desktop computer.
First I’ll describe my&nbsp;mindset at&nbsp;a&nbsp;high level,
then I’ll add some notes about specific clients.

### Client Roles

On&nbsp;the one hand, I&nbsp;have my&nbsp;phone.
It’s almost always with me&nbsp;and almost always online.
That’s where I&nbsp;keep the full chat history
and get real-time notifications.

On&nbsp;the other hand, I&nbsp;have a&nbsp;couple of&nbsp;desktop applications.
I&nbsp;only open them
when I&nbsp;need to&nbsp;discuss something using my&nbsp;keyboard
or&nbsp;share some text between devices.
I&nbsp;like to&nbsp;think of&nbsp;them as&nbsp;satellite clients.

### Before the Start

First, enable OMEMO encryption
on&nbsp;every client if&nbsp;it&nbsp;isn’t enabled by&nbsp;default.

The next step is&nbsp;to&nbsp;add
all clients to&nbsp;the trust list on&nbsp;each device:
my&nbsp;phone should trust all my&nbsp;computers,
and my&nbsp;computers should trust each other
as&nbsp;well as&nbsp;my&nbsp;phone.

Fingerprints do&nbsp;not have to&nbsp;be&nbsp;secret,
so&nbsp;they can be&nbsp;published on
your website or&nbsp;even on&nbsp;social media profiles.
Here is&nbsp;my&nbsp;page with the fingerprints, for example:
<br><a href='https://oddsquat.org/about/keys/' target='_blank'>
  https://oddsquat.org/about/keys/
</a>

### Start the Conversation in&nbsp;Person

Let’s say I&nbsp;meet Alice,
we&nbsp;start talking,
and then decide to&nbsp;continue the conversation online.

I&nbsp;open a&nbsp;special QR&nbsp;code on&nbsp;my&nbsp;phone,
and Alice scans it&nbsp;with her client.
This QR&nbsp;code already contains
the fingerprints of&nbsp;all my&nbsp;devices,
so&nbsp;no&nbsp;extra steps are needed on&nbsp;her phone.
After that, I&nbsp;do&nbsp;the same
and scan her QR&nbsp;code as&nbsp;well.

Later at&nbsp;home,
I&nbsp;manually mark her devices as&nbsp;trusted on&nbsp;my&nbsp;computers
using the trusted list on&nbsp;my&nbsp;phone, and she does the same.

Now we&nbsp;are both sure
that it&nbsp;is&nbsp;really us&nbsp;in&nbsp;the conversation,
and that all messages will be&nbsp;available
on&nbsp;all our devices and only on&nbsp;them.

### Start the Conversation Online

Let’s say Bob and I&nbsp;start discussing something
on&nbsp;a&nbsp;forum or&nbsp;in&nbsp;the Fediverse,
and then decide to&nbsp;continue the discussion on&nbsp;XMPP.

Before starting the chat,
Bob can confirm it’s really me&nbsp;using my&nbsp;page with fingerprints.
I&nbsp;can confirm it’s really him
by&nbsp;asking him to&nbsp;send his fingerprints
in&nbsp;a&nbsp;private message on&nbsp;the same forum or&nbsp;via email.

Ideally, Bob also has a&nbsp;public page with his fingerprints.
That way, we&nbsp;can both independently verify
that we&nbsp;are who we&nbsp;say we&nbsp;are.

In&nbsp;an&nbsp;alternative scenario,
where there has been no&nbsp;prior communication or&nbsp;public pages
and only a&nbsp;single JID&nbsp;is known,
things play out a&nbsp;bit differently:
Bob starts the chat,
I&nbsp;trust the first device he&nbsp;messages me&nbsp;from,
and then we&nbsp;exchange fingerprints for our other devices,
if&nbsp;we&nbsp;have any.
This approach is&nbsp;called TOFU (Trust On&nbsp;First Use).

### New or&nbsp;Lost Devices

If&nbsp;I&nbsp;start using a&nbsp;new device
or&nbsp;install another client application,
the first thing I&nbsp;do&nbsp;is&nbsp;add it&nbsp;to&nbsp;the list
of&nbsp;trusted clients on&nbsp;my&nbsp;existing devices.

If&nbsp;I&nbsp;lose one of&nbsp;my&nbsp;devices
or&nbsp;delete any private keys,
the first thing I&nbsp;do&nbsp;is&nbsp;remove the corresponding client
from the trusted list on&nbsp;my&nbsp;other devices.

Once I’ve updated all my&nbsp;personal lists,
I&nbsp;should inform my&nbsp;contacts about changes via trusted channels.

I&nbsp;can simply ask Alice to&nbsp;scan
my&nbsp;new QR&nbsp;code the next time we&nbsp;meet,
and send Bob a&nbsp;message introducing
my&nbsp;new client or&nbsp;letting him know
that the lost device is&nbsp;no&nbsp;longer trusted
and that no&nbsp;real messages will ever come from it&nbsp;again.

## Client Applications

This section describes
how OMEMO is&nbsp;used in&nbsp;specific client applications
that I&nbsp;personally use.

### Conversations and Forks

<a
  href='https://conversations.im/'
  target='_blank'>
  Conversations</a> is&nbsp;a&nbsp;modern,
fully featured chat application for Android.
It&nbsp;supports everything a&nbsp;messaging app should support:
chats, voice calls, video calls, and sharing files of&nbsp;any kind.

There are several forks of&nbsp;it&nbsp;where
the UI&nbsp;or&nbsp;UX&nbsp;may differ,
but the core features work exactly the same.
I&nbsp;personally use <a
  href='https://codeberg.org/monocles/monocles_chat'
  target='_blank'>
  Monocles Chat</a>.

On&nbsp;the Contact Details screen (including your own account),
you can see a&nbsp;list of&nbsp;published fingerprints
and manually mark them as&nbsp;trusted or&nbsp;revoke trust.

To&nbsp;simplify all these routine operations,
a&nbsp;QR-code-based system is&nbsp;used:
you can show your own QR&nbsp;code or&nbsp;scan other people’s codes
directly from the main screen.
This makes device verification during in-person meetings
simple and effortless.

### Dino

<a
  href='https://dino.im/'
  target='_blank'>
  Dino</a> is&nbsp;a&nbsp;lightweight GTK-based GUI client.

It&nbsp;can be&nbsp;considered a&nbsp;fully functional one,
although some non-essential features are still not implemented.
For example,
it&nbsp;is&nbsp;not possible to&nbsp;clear local chat history
using built-in methods :D

Trust and untrust decisions can be&nbsp;easily managed
in&nbsp;the Encryption tab of&nbsp;the Conversation Details window.

It&nbsp;is&nbsp;important to&nbsp;note that,
by&nbsp;default, Dino is&nbsp;configured
to&nbsp;automatically trust new fingerprints.
I&nbsp;recommend disabling this feature.

### Profanity

<a
  href='https://profanity-im.github.io/'
  target='_blank'>
  Profanity</a> is&nbsp;a&nbsp;powerful TUI client
where everything is&nbsp;controlled through a&nbsp;built-in command system.

If&nbsp;you somehow intend to&nbsp;use it,
you can find a&nbsp;small cheat sheet for the `omemo` command below.
However, I&nbsp;strongly recommend reading the full documentation.

- Generate a&nbsp;key and add your other clients:
  ```text
  /omemo gen
  /omemo trust me@some.server some-cool-fingerprint-01
  /omemo trust me@some.server another-cool-fingerprint
  /omemo qrcode
  ```

- View the list of&nbsp;your own or&nbsp;someone else’s fingerprints:
  ```text
  /omemo fingerprint me@some.server
  /omemo fingerprint alice@another.server
  ```
  Trusted ones will be&nbsp;marked as&nbsp;`trusted`.

- Start an&nbsp;encrypted conversation:
  ```text
  /omemo start alice@another.server
  ```

- Add fingerprints to&nbsp;the trusted list:
  ```text
  /omemo trust alice@another.server some-cool-fingerprint-02
  /omemo trust alice@another.server some-cool-fingerprint-03
  /omemo trust bob@another.server some-cool-fingerprint-04
  ```

- Revoke trust for a&nbsp;specific client:
  ```text
  /omemo untrust alice@another.server some-cool-fingerprint-02
  ```

## Late Disclaimer

This post was originally intended
as&nbsp;a&nbsp;collection of&nbsp;answers to&nbsp;questions
I&nbsp;had when I&nbsp;first started using XMPP with OMEMO.

It&nbsp;isn’t meant to&nbsp;be&nbsp;exhaustive or&nbsp;formal,
but rather to&nbsp;clarify the practical side of&nbsp;things
and reduce that initial feeling of&nbsp;being lost
when you keep running into
“The message was not encrypted for this device”
over and over again.

From now on, I&nbsp;hope you won’t encounter such errors
or&nbsp;any other issues
connected to&nbsp;end-to-end encryption in&nbsp;XMPP.
