# Askdesk

Askdesk is a chatbot a business adds to its own website so people on that site can get answers from that business's knowledge.

## Language

**Account**:
The business that signs up. One account has one bot and one knowledge base.
_Avoid_: User, agent, owner, signup

**Bot**:
The single chatbot that belongs to an account.
_Avoid_: Agent, widget

**Knowledge base**:
The documents an account has provided for its bot to answer from.
_Avoid_: Training data, index

**Visitor**:
A person talking to an account's bot on a host site. A visitor is not an account.
_Avoid_: User, customer

**Host site**:
A specific site address an account has named, including `https` and the host, such as `https://www.oakclinic.com`. A different subdomain, or the same host over `http`, is a different host site. The bot runs only on host sites that account has named. The same bot can have more than one host site. A page that only contains the snippet is not a host site.
_Avoid_: Domain, embed, website, allowed origin

**Install snippet**:
The text an account copies onto a host site to place its bot there. The snippet names the bot. It does not, by itself, allow the bot to run.
_Avoid_: Script tag, embed code, agent id

**Visitor pass**:
A short-lived proof that the host site is on the account's list. It names the bot, that host site, and an expiry one hour out. The install snippet gives it to the widget, and the widget sends it with each question. It is not the account's login.
_Avoid_: Session, token, API key
