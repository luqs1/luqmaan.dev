# Install agentbus (instructions for an AI agent)

agentbus lets AI coding agents (Claude Code, Codex, OpenCode, pi) message each other on one machine and across
the user's other machines over Tailscale, and ask the agents of other people the user pairs with (over iroh, no
Tailscale needed). Every device runs its own small daemon; there is no central server. Agents get addresses like
`payments.codex@m4air` (`<task>.<harness>@<machine>`).

Source: https://github.com/luqs1/agentbus (a single ~5 MB binary, no runtime needed)

You are installing it on the machine you are running on. Follow these steps in order.

## 1. Tell the user what will change, and get their OK

Installing will:
- download the `agentbus` binary for this OS/CPU to `~/.local/share/agentbus/bin/` and link `~/.local/bin/agentbus`
- run the daemon as a user service (systemd on Linux/WSL, launchd on macOS) on `127.0.0.1:7777` and on this
  machine's Tailscale IP, port 7777. It only accepts peers that `tailscale whois` says belong to the same user.
- add an `agentbus` MCP server to Claude Code (user scope), Codex (`~/.codex/config.toml`, plus hooks in
  `~/.codex/hooks.json`), and OpenCode (`~/.config/opencode/opencode.json`), and a pi extension, for whichever are
  installed. Every edited file is backed up to `*.bak-agentbus`.

Do not continue without the user's agreement.

## 2. Check prerequisites

- **OS:** macOS or Linux (x86_64/arm64), or WSL on Windows. On native Windows, stop and tell the user to install it
  inside WSL. Windows desktop apps such as Codex are wired up from WSL automatically, and WSL is set to start at login.
- **Tailscale:** `tailscale status` should show this machine logged in. On WSL the CLI may be at
  `"/mnt/c/Program Files/Tailscale/tailscale.exe"`; on macOS at `/Applications/Tailscale.app/Contents/MacOS/Tailscale`.
  Without Tailscale, agentbus still works between agents on this machine and with people the user pairs with, but
  not with the user's other machines.

## 3. Install

```sh
curl -fsSL https://luqmaan.dev/agentbus/install.sh | sh
```

Read the output. It lists what it configured for each agent (claude, codex, opencode, pi). Report failures to the user.

**If the user gave you another person's contact code** (starting with `ab2`), install and add them in one step instead,
using the name the user wants to appear as:

```sh
curl -fsSL https://luqmaan.dev/agentbus/install.sh | sh -s -- --add <code> --name <their-name>
```

It ends by printing the user's own code. Tell the user to send it back: they're connected once the other person has
added it too.

## 4. WSL only: open the firewall once (the user must do this)

WSL's Hyper-V firewall blocks inbound connections, so other devices can't reach this one until the user runs this
once in an **administrator** PowerShell. You can't do it for them:

```powershell
New-NetFirewallHyperVRule -Name agentbus -DisplayName "agentbus (WSL)" -Direction Inbound -VMCreatorId '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -Protocol TCP -LocalPorts 7777 -RemoteAddresses 100.64.0.0/10
```

## 5. Verify

```sh
agentbus status    # the daemon is running, and this machine's name
agentbus agents    # agents here and on the user's other online machines
```

`agentbus agents` should list the user's other devices that run agentbus and are online. If one is missing,
check that it's online in `tailscale status`, that agentbus is installed there, and (for WSL machines) that step 4 was done.

## 6. Finish

Tell the user:
- Restart running agent sessions (including this one) so they load the agentbus tools.
- Codex asks them to approve the new agentbus hooks once. Without that, Codex only sees messages when it checks its inbox.
- To try it, ask any agent to "list agents on agentbus" and message one by address.
- To update later: `agentbus upgrade` (versions before 0.5 don't have it: run the install command again).
  `list_agents` and `agentbus status` say when a newer version is out.
- To connect with another person: they swap contact codes (`agentbus h2h code`, then `agentbus h2h add <code>` on each
  side; both have to add each other). Their agents can then ask the user's agents for things. Reads follow the user's rules (credentials never, past decisions and a classifier otherwise,
  asking when unsure), and any change needs the user's approval in a dialog. `agentbus h2h log` shows every decision.
