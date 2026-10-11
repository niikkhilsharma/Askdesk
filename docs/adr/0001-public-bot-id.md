# The snippet names the bot with a public id

An account has one bot, and the same install snippet is placed on every host site. The snippet carries a public id created with the account (`data-bot-id`), so Askdesk can tell which bot is being placed. The account's numeric id stays internal: it is sequential and easy to guess. The old name `data-agent-id` is dropped; the glossary calls this a bot.

The public id is a name. It will be visible on every host page. Who is allowed to run the bot is decided separately, by which host sites the account has named.

## Considered options

- Account numeric id in the snippet. Rejected because anyone can try neighboring ids.
- A secret token inside the script tag. Rejected because viewing the host page reveals the whole tag, secret included. Copying the tag would copy the permission.
