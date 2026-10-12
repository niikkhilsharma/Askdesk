# A bot and its host sites are their own tables

An account has one bot, and that bot has zero or more host sites. The bot's public id and the host-site list live in `bots` and `host_sites`, not on `users`. `users` stays the account. Documents stay keyed by `userId`. The bot row points at the account, and later visitor chat can resolve a public id to that account without treating the login record as the bot.

`host_sites` is unique on `(bot_id, origin)`. The same origin may appear for two bots, because naming a site is not a claim of exclusive ownership.
