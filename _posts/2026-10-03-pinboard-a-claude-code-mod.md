---
layout: post
title: "Pinboard: Keeping the Things I Need to Act On in View"
date: '2026-10-03 15:00'
comments: true
published: true
tags:
  - tech
  - ai
permalink: /blog/pinboard-claude-code-mod
---

The longer a Claude Code session runs, the more things scroll away. Claude asks me a question, keeps working, and twenty tool calls later I've forgotten it was ever asked. The PR it opened an hour ago is buried somewhere above a wall of diffs.

So I built [Pinboard](https://github.com/sirkitree/pinboard), a small mod that keeps those things in a sidebar pane.

<!--more-->

![Pinboard pane beside a Claude Code session, with one open decision and two of four todos done](/img/pinboard-post/board-in-progress.png)

## What's a mod?

[Mods](https://code.claude.com/docs/en/plugins/mods/overview) are a new kind of Claude Code plugin: JavaScript or TypeScript that runs inside Claude Code and reacts to events like tool calls, prompts, or parts of the interface being drawn. Settings hooks, skills and MCP servers can't draw anything. A mod can, which is what made a sidebar possible. One caveat from the docs worth repeating: mods run with your permissions and aren't sandboxed, so only install ones you trust.

## What it does

The board has three lists. Open decisions are questions waiting on me. Todos are the session's task list. Links are URLs from things Claude just made, like a PR, an issue or a push. I only capture links from commands that create something, because reads and test runs mention URLs constantly and I don't care about those.

Claude updates the board through a tool, and each update shows up as one dim line in the transcript, like `Pinboard: +4 todo, +1 decision`. The current board also gets appended to the system prompt on every request, so Claude always knows what's open without me reminding it. That also means Pinboard doesn't lean on `TodoWrite` or the Task tools, which newer models don't get by default anyway. Claude Code's own task list isn't something I can count on being there, so the board brings its own.

The pane opens on its own the first time something lands on the board, if the terminal is wide enough. Otherwise `/pinboard` opens it. Everything resets on `/clear`, which is how I want it. It's a whiteboard for this conversation, not a project tracker.

## Try it

```bash
claude plugin marketplace add sirkitree/pinboard
claude plugin install pinboard@pinboard
```

Mods are new, and the API is still moving between releases, so I expect to be patching this.

What I keep noticing is how much of working with an agent is about attention, not capability. Claude could always keep track of my todos. I just couldn't see them.
