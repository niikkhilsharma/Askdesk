# The Launcher and the Panel are one iframe

On an allowed host site, a page load shows the Launcher. The Launcher and the Panel are two states of one iframe, so opening can move as a single presence. The install snippet mounts that iframe at the bottom-right, 24px from the corner, as a round button with the headset picture inside it. A click grows the same iframe to the Panel, 400×600, from that corner. Close shrinks it back to the Launcher. The iframe stays, and so do the visitor pass and the listener. A reload shows the Launcher again.

Close keeps the conversation. Messages stay in the iframe's `localStorage`, under the bot's public id and the host site, as [0004](./0004-visitor-chat.md) already says. A reply that finishes while the iframe is small is in that thread when the visitor opens the Panel again.

A host site that is not allowed still gets no iframe. Opening `/widget` directly still shows nothing, as [0002](./0002-allowed-host-sites.md) requires.

## Considered options

- A Launcher drawn by the install snippet, with the iframe removed on close and mounted again on open. Rejected. The Launcher and the Panel would be two pieces, and the open could not move as one.
- Opening the Panel on every page load, and showing the Launcher only after a close. Rejected. The resting state is the Launcher.

## Consequences

`askdesk:close` no longer removes the iframe. The snippet resizes it, and the view inside changes with that size.

Removing the iframe when a host site is no longer allowed is a different event. That removal is still the later change in [0004](./0004-visitor-chat.md). Close does not do it.

The thread is not cleared by close, by shrinking, or by a reload. A new page load shows the Launcher, and the next open reads the same messages back.
