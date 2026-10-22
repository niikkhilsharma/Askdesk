# A visitor chats with a short-lived pass

The dashboard chat route stays for the signed-in account. A visitor has no account session. Visitor questions go to a separate address. That address resolves the bot's public id to the account and answers from that account's documents.

Askdesk signs a visitor pass only after the host site is on the account's list. The pass names the bot, the host site, and an expiry one hour out. It is not the account's login.

The install snippet receives the pass and gives it to the iframe. The iframe asks for that pass once it can hear the reply, and the snippet sends the pass it already holds. The iframe sends the pass with each question. The snippet does not watch the clock or the allowlist. The chat address refuses an expired pass, and it refuses a pass whose host site is no longer on the list. The iframe sees that refusal and only then asks the snippet for a new one. If the site is still allowed, a new pass is issued and the messages already on screen stay. There is no cap on how many questions a visitor may send.

A copied pass names the host site it was issued for. It can be used until it expires, and only while that host site stays on the list. A later question does not show the host site again. The pass does. The short lifetime is the limit. There is no message cap.

Messages are kept in the iframe's `localStorage`, under the bot's public id and the host site. Each host site has its own copy. Askdesk does not store the thread. Each question still sends the earlier messages so the model can follow the conversation. A new pass does not clear them.

Opening `/widget` directly still shows nothing, as [0002](./0002-allowed-host-sites.md) already requires.

## Considered options

- Using the account session in the iframe. Rejected because a visitor is not an account, and the iframe must not hold the account's login.
- A long-lived secret in the snippet. Rejected in [0001](./0001-public-bot-id.md): copying the tag copies the secret.
- Saving transcripts in the database for now. Rejected. The thread stays in the visitor's browser, and Askdesk does not keep a copy yet.

## Consequences

The dashboard route still answers only after the account is signed in. Visitor questions never use that route.

A missing or expired pass is refused, and so is a pass for a host site that is no longer on the list. Neither calls the model. If the iframe cannot get a new pass, the messages stay on screen and answering stops. Hiding the iframe when the host site is no longer on the list is not done yet. See Later.

Anyone who copies a pass can present it until the hour is up, while that host site remains allowed. After that it is useless until a new one is issued.

Reloading the iframe keeps the messages. Replacing the pass keeps them too. Askdesk still receives the earlier messages with each question, because it does not keep the thread.

## Later

When the iframe asks for a new pass and the host site is no longer on the list, remove the iframe. This is not built yet. Today that refusal leaves the iframe in place and answering stops.

An expired pass is not the reason to hide the iframe. A pass expires after an hour even when the host site is still allowed. Hiding on expiry would take the bot off a page that is still allowed. The expired pass only causes the iframe to ask the snippet for a new one. The placement check, which is the same request that issues a pass, is what says whether the host site is still allowed.

That check runs in two situations.

The visitor loads or reloads the host site. The snippet starts over and asks for a pass before it adds the iframe. The browser sends the host site with that request, so Askdesk checks the list again. A denial means the iframe is never added. The expired pass stored in the iframe does not take part in that decision, because the frame is not shown.

The page stays open. The snippet does not watch the clock or the allowlist, so nothing happens until the next question. That question is refused when the pass has expired or the host site is no longer on the list. The iframe then posts `askdesk:refresh`, and only then does the snippet ask for a pass again, without a reload. A new pass means the host site is still allowed, and the iframe stays. A 404 means the host site was removed while the visitor was still on the page. The snippet tells the iframe, answering stops, and the iframe stays. That 404 is the case this later change would hide. The expired pass does not carry that fact. The placement response does.

A request that does not finish is not a denial. The iframe keeps waiting while the connection is still open. When the request fails, the snippet says Askdesk could not be reached. Answering stops for that question, and the iframe stays, because a failed request is not a removal. The later change should remove the iframe only for the 404.
