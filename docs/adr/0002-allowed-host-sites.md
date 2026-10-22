# The bot runs only on host sites the account has named

Copying an install snippet onto another site must not run the bot there. The snippet's public id only names the bot. The account names each host site as an exact origin. Askdesk serves the bot only when the parent page's origin is on that list. The snippet adds no widget on any other page. A direct open of the widget, with no parent page, is refused. An empty list means the bot runs nowhere. An unmatched site sees nothing.

The parent origin is taken from the browser, not from a value the page can invent. The snippet asks the iframe request to send that origin, so a host site that hides referrers does not lock out its own bot.

## Considered options

- A secret inside the snippet. Rejected in [0001](./0001-public-bot-id.md): copying the tag copies the secret.
- Binding the bot to whichever site loads the snippet first. Rejected because someone else can load it before the account does.
- Matching the whole domain, or the hostname with either scheme. Rejected because one entry would cover other subdomains, or would treat `http` and `https` as the same site.
- Showing a message on the unmatched site. Rejected because it tells a copier that the bot id is live.

## Consequences

The account does not prove DNS ownership. Naming an address does nothing until that site includes the snippet, and another account may name the same address.

A pasted page URL is stored as its origin only. A missing scheme is rejected, so `http` and `https` are never guessed.

On an allowed host site the widget shell loads and the visitor can ask questions. Visitor chat is [0004](./0004-visitor-chat.md). Answers consult this same list. The chat request comes from inside the widget and does not carry the host site's origin itself.
