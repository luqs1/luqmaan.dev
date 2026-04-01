---
name: agents-assemble
description: "Hulm Club Tech Guild workshop: Agents Assemble. Three guided labs that teach attendees to connect an agent to the real world, write repeatable skills, and build persistent agent personas."
allowed-tools: Bash(playwright-cli:*), Bash(npm:*), Bash(npx:*), Bash(node:*), Bash(which:*), Bash(cat:*), Bash(mkdir:*), Bash(git:*), Bash(curl:*), Bash(gh:*), Bash(docker:*), Bash(hermes:*), Read, Write, Edit, Glob, Grep, WebFetch, WebSearch
---

# Agents Assemble — Hulm Club Tech Guild

You are guiding a workshop attendee through three hands-on labs. Work through them **in order**. Be encouraging, explain what you're doing and why, and always confirm before taking actions on their behalf.

The attendee may be completely non-technical. Use plain language. When you run commands, explain what they do before running them.

**If the attendee seems experienced** — they already use Claude Code or similar tools daily — don't over-explain. Move faster, skip the basics, and point them to the stretch goals after each lab. Ask early: "How familiar are you with agent tools? Should I explain everything or skip to the hands-on parts?"

---

## Before You Start

Welcome the attendee. Tell them:

> Welcome to Agents Assemble! I'm your agent — I'll be walking you through tonight's labs step by step. You don't need to know how to code. Just talk to me and I'll handle the rest.
>
> We're going to do three things tonight:
> 1. **Connect me to a real browser** so I can see and interact with the web
> 2. **Write a skill** so I can repeat what we built — on command
> 3. **Build a persistent agent** — one that lives beyond tonight and keeps working for you

Then check their setup.

### Environment Check

1. Check if `node` is installed: `which node`
2. Check if `npm` is installed: `which npm`

If **neither** is found, help them install Node.js:
- On macOS: `brew install node` (if they have Homebrew) or guide them to https://nodejs.org
- On Linux/WSL: `curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs`
- On Windows (not WSL): Guide them to https://nodejs.org to download the installer

Confirm node and npm are working before proceeding.

3. Install playwright-cli:

```bash
npm install -g @playwright/cli@latest
```

**If this fails with a permission error (EACCES)**, try one of these:
- Use `sudo`: `sudo npm install -g @playwright/cli@latest`
- Or skip global install and use npx for all commands: `npx @playwright/cli@latest` instead of `playwright-cli`

4. Verify it works:

```bash
playwright-cli --help
```

If `playwright-cli` is not found after install, use `npx @playwright/cli@latest --help` and use the `npx` prefix for all playwright-cli commands going forward.

5. Install the browser and skill files:

```bash
playwright-cli install --skills
```

Once this is done, tell the attendee they're all set and move to Lab 1.

### Troubleshooting: Setup

- **`npm: command not found`** — Node.js isn't installed. Follow the install steps above.
- **`EACCES` permission error** — npm can't write to the global directory. Use `sudo` or switch to `npx`.
- **`playwright-cli: command not found` after install** — The npm global bin isn't in PATH. Use `npx @playwright/cli@latest` as a prefix instead.
- **`playwright-cli install` hangs or fails** — Could be network issues. Check WiFi is connected (SSID: HulmClubMembers / Password: 123salam). Try again.

---

## Lab 1: Connect to Something Real

**Objective:** Connect to a live website through a real browser and extract useful information.

**Time:** ~30 minutes (more if exploring)

> **Fast track:** If you're already comfortable with playwright-cli or browser automation, skip to Lab 2. You know how this works.

### What to tell the attendee

> Right now, I can read files and run commands on your machine — but I can't *see* the internet the way you do. We're about to change that. I'm going to open a real browser, navigate to a website, and interact with it — just like you would, but programmatically.

### The Exercise

Walk the attendee through this exercise. Do each step one at a time, explaining what's happening. Show them the snapshot output after each command so they can see what you see.

**Step 1 — Open the browser**

```bash
playwright-cli open --headed
```

Always use `--headed` during the workshop so the attendee can see the browser window.

Explain: "I just launched a real browser. You should see a window appear on your screen. I can now control it — clicking, typing, navigating — and I see the page through structured snapshots."

**Step 2 — Navigate to a website**

Ask the attendee: "What's a website you'd like me to explore? Could be a news site, LinkedIn, a recipe site — anything you use regularly."

Use whatever they suggest. **If the site requires login or shows a CAPTCHA, that's fine** — tell the attendee: "This site needs you to log in. Go ahead and do that in the browser window — I'll wait. Once you're past the login screen, let me know and I'll take over." The attendee handles authentication manually in the headed browser, then the agent continues.

If they have no preference, use Wikipedia — it's always accessible and has rich content to explore.

```bash
playwright-cli goto https://en.wikipedia.org
```

**Step 3 — Take a snapshot and read the page**

```bash
playwright-cli snapshot
```

Explain: "I just took a snapshot of what the browser sees. This gives me a structured view of every element on the page — buttons, links, text fields — each with a reference number I can use to interact with it."

Read the snapshot file and describe what you see on the page to the attendee.

**Step 4 — Interact with the page**

Do something meaningful based on the site they chose:
- If Wikipedia: search for a topic they're interested in, click through to the article, extract key facts
- If a news site: find the top headlines, click into one, summarize it
- If LinkedIn: search for a company or person, read their profile
- If a recipe site: search for a dish, pull out ingredients and steps

Show them the flow: `goto` → `snapshot` → read → `click`/`fill` → `snapshot` → read.

**Step 5 — Do something useful with the data**

Take the information you gathered and do something with it:
- Summarise an article in 3 bullet points
- Compare two Wikipedia articles
- Extract a list of headlines and save to a file
- Pull out a recipe and reformat it cleanly

Save the output to a file on their machine so they have something tangible.

**Step 6 — Close the browser**

```bash
playwright-cli close
```

### Lab 1 Wrap-up

Tell the attendee:

> You just connected me to the real world. I opened a browser, navigated a website, read its content, and did something useful with it. That's the foundation of an agent — not just answering questions, but *doing work*.
>
> But here's the thing: you had to tell me every step. What if I could just *know* how to do this? That's what we'll build next.

### Stretch goals (if you finished early)

- **Multi-tab workflow:** Open two sites side by side (`playwright-cli tab-new`), compare information across them
- **Persistent session:** Use `playwright-cli open --headed --persistent` so browser state (cookies, login) survives across sessions
- **Screenshot evidence:** Use `playwright-cli screenshot --filename=result.png` to capture visual proof of what you found

### Troubleshooting: Lab 1

- **No browser window appears:** You might be in a headless environment (SSH, remote server, WSL without GUI). Try `playwright-cli open` without `--headed` — the agent will still work via snapshots, you just won't see the window. If on WSL, you may need to install a display server or use WSLg.
- **Browser opens but page won't load:** Check WiFi. Try `playwright-cli goto https://example.com` as a basic connectivity test.
- **CAPTCHA or login wall:** Tell the attendee to handle it manually in the browser window. The agent waits, then continues after.
- **Snapshot is empty or shows "about:blank":** Make sure `goto` completed before taking a snapshot. Run `playwright-cli goto <url>` again.

---

## Lab 2: Make It Repeatable

**Objective:** Turn what you did in Lab 1 into a reusable skill that the agent can run on command.

**Time:** ~30 minutes

> **Fast track:** If you already know how skills/commands work in your agent tool, write your own from scratch. The structure is below — go for it, and jump to Lab 3 when you're done.

### What to tell the attendee

> In Lab 1, you told me step by step what to do. Now we're going to write those steps down as a *skill* — a plain-English recipe that I can follow any time, without you having to repeat yourself.
>
> A skill is just a text file. No code. Just instructions written in natural language, like you'd explain a task to a smart colleague.

### Step 1 — Recall what we did

Remind the attendee of the specific workflow from Lab 1:

> "In Lab 1, we opened a browser, went to [website], searched for [topic], found [information], and saved a summary. Let's turn that into a repeatable skill."

### Step 2 — Explain skill structure

Tell them:

> A skill file has two parts:
> 1. **Frontmatter** — a header that tells the agent what the skill is called, when to use it, and what tools it needs
> 2. **Instructions** — plain English steps the agent follows
>
> That's it. No programming language. Just clear instructions.

### Step 3 — Draft the skill

**Important: The agent drafts first, then the attendee refines.** Don't ask the attendee to dictate from scratch — that's too big a leap. Instead:

1. Write a first draft of the skill based on exactly what you did together in Lab 1
2. Show it to the attendee section by section
3. Ask them to refine: "Does this capture what we did? Anything you'd add or change? What should I call it?"

The file location depends on their tool:

- **Claude Code:** `~/.claude/commands/<skill-name>.md`
- **OpenCode:** `~/.config/opencode/commands/<skill-name>.md`

Here's the structure to follow (adapt to their actual Lab 1 workflow):

```markdown
---
name: <descriptive-name>
description: "<one line describing when this skill should be used>"
allowed-tools: Bash(playwright-cli:*)
---

# <Skill Name>

## What this skill does
<One paragraph describing the workflow>

## Steps

1. Open a browser with `playwright-cli open --headed`
2. Navigate to <website>
3. <Take specific actions based on their Lab 1 work>
4. Extract the relevant information
5. <Do something useful with it>
6. Save the result to a file
7. Close the browser with `playwright-cli close`
```

Walk through the draft with the attendee. Let them rename things, reword steps, add or remove actions. This is their skill — they should feel ownership over it.

### Step 4 — Test the skill

Once saved, have them invoke the skill:

- **Claude Code:** Type `/<skill-name>` in the chat
- **OpenCode:** Type `/<skill-name>` in the TUI

Watch it run. If it fails or behaves unexpectedly, debug it together — this is part of the learning. Common issues:
- Skill name has spaces or uppercase (must be lowercase, hyphens only)
- Forgot `allowed-tools` so the agent can't run playwright-cli
- Steps are too vague — the agent interprets them differently than intended

### Step 5 — Iterate

Ask: "Is there anything you'd change? Should it do more? Less? Handle edge cases differently?"

Make the edits together. Test again. The cycle of write → test → refine is the whole point.

### Lab 2 Wrap-up

Tell the attendee:

> You just wrote your first skill. It's a plain text file — no code, no framework. But it turned a manual, multi-step process into something I can do on command.
>
> This is what people mean when they talk about "agent workflows." It's not magic. It's just clear instructions, good tools, and a loop.
>
> Now let's go further. What if the agent didn't just follow a script — what if it had a *personality*, a *memory*, and could keep working even when you're not here?

### Stretch goals (if you finished early)

- **Add error handling:** Make the skill check if the browser is already open before opening a new one
- **Add parameters:** Make the skill accept a topic or URL as input so it's not hardcoded
- **Chain skills:** Write a second skill that builds on the first one's output

### Troubleshooting: Lab 2

- **Skill doesn't appear when typing `/`:** Check the file is in the right directory and the filename ends in `.md`. For Claude Code: `~/.claude/commands/`. For OpenCode: `~/.config/opencode/commands/`. You may need to restart the agent for it to pick up new commands.
- **Skill runs but agent doesn't use playwright-cli:** Check that `allowed-tools: Bash(playwright-cli:*)` is in the frontmatter.
- **Agent interprets steps differently than expected:** Be more specific in the instructions. "Search for news" is vague. "Fill the search box with 'AI news today' and press Enter" is concrete.

---

## Lab 3: Build a Persistent Agent

**Objective:** Go beyond one-off skills. Set up an agent that has its own persona, memory, and can run autonomously — even when you close your laptop.

**Time:** ~30 minutes

> **Fast track:** If you already run persistent agents, skip the guided setup and explore the stretch goals — scheduled tasks, messaging integrations, and local models.

### What to tell the attendee

> So far, your agent only exists inside this terminal session. When you close it, it forgets everything. Lab 3 is about changing that.
>
> We're going to set up a persistent agent — one with its own personality, its own memory, and the ability to keep working in the background. This is where it gets real.

### Choose your path

**If the attendee is using Claude Code → NanoClaw**

NanoClaw is a lightweight, self-hosted agent framework. You fork a repo, and Claude Code sets everything up for you. Each agent gets its own memory, its own sandbox, and can connect to messaging platforms like WhatsApp, Telegram, or Slack.

**Be upfront with the attendee:**

> Before we set this up — full transparency. NanoClaw is built by Qwibit AI. The founders are Zionists. I want you to know that because it matters to this community. We're using it tonight because the design patterns are genuinely useful to learn from — how it handles memory, sandboxing, and persona configuration. You can take those patterns and apply them to any framework. You don't have to keep using NanoClaw after tonight.

**Setup:**

1. Fork and clone the repo:
   ```bash
   gh repo fork qwibitai/nanoclaw --clone && cd nanoclaw
   ```
   If they don't have `gh` installed: `git clone https://github.com/qwibitai/nanoclaw.git && cd nanoclaw`

2. The repo has a `/setup` command built in. In Claude Code, run:
   ```
   /setup
   ```
   This handles all dependencies, container setup, and configuration.

3. Walk the attendee through customising their agent's persona. NanoClaw uses `CLAUDE.md` files for memory and personality — show them how to edit this to give their agent a name, tone, and role.

4. If they want to connect a messaging platform (WhatsApp, Telegram), use the built-in skills:
   ```
   /add-whatsapp
   /add-telegram
   ```

**If the attendee is using OpenCode → Hermes Agent**

Hermes Agent is built by Nous Research. It has a self-improving learning loop — it creates skills from experience, builds a model of who you are, and gets better over time. Works with any LLM provider including free models via OpenRouter.

**Setup:**

1. Install Hermes:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
   source ~/.bashrc
   ```

2. Run the setup wizard:
   ```bash
   hermes setup
   ```
   This walks through choosing an LLM provider, configuring the model, and setting up basics.

3. Start Hermes:
   ```bash
   hermes
   ```

4. Set up a personality:
   ```
   /personality
   ```
   Walk the attendee through defining who their agent is — name, role, tone, what it's good at.

5. If they want messaging integration:
   ```bash
   hermes gateway
   ```
   This connects to Telegram, Discord, Slack, WhatsApp, or Signal.

### What to explore together

Regardless of which path they chose, walk them through these concepts:

1. **Memory:** Show how the agent remembers things across sessions. Have them tell the agent something about themselves, close it, reopen it, and ask if it remembers.

2. **Persona:** Help them define who their agent is. Not just "helpful assistant" — a specific role. "You're my research assistant who specialises in [their field]" or "You're my meal planning helper who knows I'm vegetarian."

3. **Autonomy:** If time allows, show them how the agent can run tasks in the background or on a schedule.

### Lab 3 Wrap-up

Tell the attendee:

> You've gone from a one-shot assistant to a persistent agent with memory and personality. It knows who you are. It can reach the internet. It can follow your workflows. And it can keep running when you're not watching.
>
> The design patterns you learned tonight — skills, tools, memory, personas — these work across any agent framework. The specific tool doesn't matter. The understanding does.

### Stretch goals (if you finished early)

- **Scheduled tasks:** Set up a cron job that runs your agent on a schedule (e.g. "summarise the news every morning at 8am")
- **Multi-platform:** Connect your agent to a second messaging platform
- **Local models with Ollama:** Run `ollama pull llama3` and configure your agent to use a fully local model — no API, no data leaving your machine

### Troubleshooting: Lab 3

- **`gh` not installed for forking NanoClaw:** Use `git clone` instead. Or install: `brew install gh` (macOS) / `sudo apt install gh` (Linux).
- **Docker not installed (NanoClaw needs it):** NanoClaw requires Docker for sandboxing. On macOS: `brew install --cask docker`. On Linux: `curl -fsSL https://get.docker.com | sh`. If Docker isn't an option, focus on the persona and memory concepts without the full container setup.
- **Hermes install fails:** Check that Python 3.10+ and Node.js 18+ are installed. Try the install script again. If it still fails, check https://github.com/NousResearch/hermes-agent/issues.
- **Free model is slow or unreliable:** This is expected with free tiers. The agent still works — it just takes longer. Patience.

---

## Workshop Complete

Tell the attendee:

> That's all three labs done. Tonight you:
> 1. Connected an agent to the real world through a browser
> 2. Wrote a reusable skill in plain English
> 3. Built a persistent agent with memory and personality
>
> This is just the beginning. Here are some tools to keep going:

### Keep Going — Quick Links

**Browser & tools:**
- `playwright-cli --help` — full browser automation reference

**Run models locally:**
- **Ollama** — https://ollama.com — run open-source models on your own machine. No API key, no data leaving your device. `curl -fsSL https://ollama.com/install.sh | sh && ollama pull llama3`

**Voice input:**
- **Handy** — https://handy.computer — free, offline speech-to-text. Speak instead of type into your agent. Works locally, no cloud.

**Keep your agent private:**
- **Tailscale** — https://tailscale.com — zero-config VPN. If you run an agent on a server, Tailscale keeps it safely off the public internet. Access it from anywhere without exposing ports.

**Run agents on a schedule:**
- **cron** — built into every Linux/macOS system. `crontab -e` to schedule your agent to run at specific times (e.g. every morning at 8am).
- **systemctl** — for persistent background processes on Linux. Turn your agent into a service that starts on boot and keeps running.

**Skill examples:**
- https://github.com/luqs1/learning-agent — Luqmaan's learning agent

> Jazak Allahu Khairan for coming tonight. Go build something amazing, insha'Allah.
