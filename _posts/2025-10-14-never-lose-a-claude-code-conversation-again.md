---
layout: post
title: "Never Lose a Claude Code Conversation Again"
date: '2025-10-14 21:15'
comments: true
published: true
tags:
  - tech
  - ai
  - automation
permalink: /blog/claude-code-auto-save-conversations
---

Claude Code stores your sessions in temporary files. When they terminate, that context is gone forever.

I built a system to auto-save every conversation and make them searchable.

**Two flavors:**
1. **[Plugin](https://github.com/sirkitree/claude-conversation-saver)**: Real-time auto-save after every response
2. **[Skill](https://github.com/sirkitree/conversation-logger)**: Manual save on-demand, cross-platform

<!--more-->

## The Problem

Claude Code stores sessions in `~/.claude/projects/`. When a session terminates, that context is gone. If you use "resume session" constantly (as you should), sessions last for days. When they end, you lose all that debugging history and architectural context.

## The Solution: Hybrid Architecture

### The Skill (Core Logic)

The [conversation-logger skill](https://github.com/sirkitree/conversation-logger) contains the actual functionality:
- Save script: JSONL → readable markdown
- Search script: Full-text search with context
- Parse script: Formats conversation transcripts

Works in Claude apps, Claude Code, and the API. Ask Claude: "save this conversation" or "search conversations about docker."

### The Plugin (Automation)

The [plugin](https://github.com/sirkitree/claude-conversation-saver) adds automatic triggers:
- Stop hook: Auto-saves after every response
- Slash commands: `/convo-search`, `/convo-list`, `/convo-recent`
- Install script: Ensures skill is present

The hook is ~10 lines - just extracts the transcript path and calls the skill:

```bash
#!/bin/bash
HOOK_DATA=$(cat)
TRANSCRIPT_PATH=$(echo "$HOOK_DATA" | jq -r '.transcript_path // empty')
SESSION_ID=$(echo "$HOOK_DATA" | jq -r '.session_id // "unknown"')

SKILL_SCRIPT="$HOME/.claude/skills/conversation-logger/scripts/save-conversation.sh"
[ -f "$SKILL_SCRIPT" ] && bash "$SKILL_SCRIPT" "$TRANSCRIPT_PATH" "$SESSION_ID"
```

All logic lives in the skill. Update the skill, plugin benefits automatically.

## Installation

### Plugin (Automatic)

```bash
/plugin marketplace add https://github.com/sirkitree/claude-conversation-saver
```

Restart Claude Code. Done.

**Prerequisites:** `git`, `jq`, `python3`

### Skill Only (Manual)

```bash
cd ~/.claude/skills
git clone https://github.com/sirkitree/conversation-logger.git
```

Then ask Claude naturally or use scripts directly:

```bash
~/.claude/skills/conversation-logger/scripts/search-conversations.sh "hooks"
```

## What You Get

Conversations saved to `~/.claude/conversation-logs/`:
- `conversation_YYYY-MM-DD_HH-MM-SS.jsonl` - Raw data
- `conversation_YYYY-MM-DD_HH-MM-SS.md` - Readable transcript
- `session_YYYY-MM-DD_HH-MM-SS.json` - Metadata
- `conversation_latest.md` - Symlink to current

Search anything:
```bash
~/.claude/skills/conversation-logger/scripts/search-conversations.sh "that bug"
```

With plugin: `/convo-search that bug`

## Why Hybrid?

Version 1 had all logic in the plugin. Every update meant redeploying everything.

Now:
- Core logic in skill (update once, benefits everywhere)
- Plugin as thin wrapper (just automation)
- Single source of truth (no duplication)
- Cross-platform (skill works everywhere)

## The Meta

I built the original plugin with Claude Code. That conversation was auto-saved.

Then I refactored to hybrid architecture with Claude Code. That conversation was also auto-saved.

I can now search both to see the evolution from monolithic to separation of concerns. Auto-save inception + architecture evolution.

---

**Update History:**
- Oct 14, 2025: Initial plugin release
- Oct 16, 2025: Hybrid architecture - skill + plugin, real-time saving

*Issues/ideas: [GitHub](https://github.com/sirkitree/conversation-logger)*
