# This copy is retired — do not edit or deploy from here

As of 21 July 2026, this Windows copy of the project is no longer the working
copy. It is stale: it is missing everything built since the WSL migration
(the Firebase client SDK wiring, AuthProvider, the whole `/preview/portal`
team CRM, and the dev-only gate on AdminPage.jsx). Its `AppRoutes.jsx` still
statically imports `AdminPage`, which is exactly the exposure that was closed
elsewhere in this project — do not build or deploy from this copy.

**The working copy is inside WSL:**
`\\wsl.localhost\Ubuntu\home\appri\projects\mphomadi-trust-fund`
(from Windows), or `~/projects/mphomadi-trust-fund` from an Ubuntu/WSL shell.

`.firebaserc` in this directory has been renamed to `.firebaserc.disabled` on
purpose, so `firebase deploy` run from here fails immediately with "no active
project" instead of silently deploying stale rules or functions over the real
ones. Do not restore it.

This directory was meant to be renamed out of the way entirely, but the
working directory of the tool that would have performed that rename was
itself pinned inside it, and Windows will not rename a directory that is any
live process's current directory. Deleting individual files (like this one,
or `.firebaserc`) inside the directory is unaffected by that lock — only
renaming/moving the directory's own top-level entry is blocked. If you want
this folder fully gone, delete it yourself once nothing has it open as a
working directory (close any terminal or tool sitting inside it first).
