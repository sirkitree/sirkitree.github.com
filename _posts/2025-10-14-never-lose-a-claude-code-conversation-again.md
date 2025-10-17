---
layout: post
title: "Never Lose a Claude Code Conversation Again: Auto-Saving Your AI Sessions"
date: '2025-10-14 21:15'
comments: true
published: true
tags:
  - tech
  - automation
permalink: /blog/claude-code-auto-save-conversations
---

*Here's a problem I bet you've had:* You're in the middle of an epic Claude Code session. You've just built something amazing together - hooks, scripts, maybe even a whole feature. Then you exit the session, come back later, and... poof. That entire conversation? Gone. Or buried somewhere in Claude's temp files where you'll never find it again.

Yeah, that was driving me nuts too.

So I did what any reasonable developer would do: I built a system to auto-save every single conversation, make them searchable, and never lose context again.

**Update (October 2025):** This is now available in two flavors:
1. **Plugin** (automation): Real-time auto-save after every response - `/plugin marketplace add https://github.com/sirkitree/claude-conversation-saver`
2. **Skill** (portable): Manual save on-demand, works across Claude apps - [conversation-logger skill](https://github.com/sirkitree/conversation-logger)

The plugin now uses the skill under the hood - best of both worlds!

<!--more-->

## The Problem: Conversations Are Ephemeral

Claude Code stores your active session in a temporary JSONL file deep in `~/.claude/projects/`. Great for the current session, but the moment that session truly ends (not just paused - actually terminated), that context is gone forever.

And here's the kicker: if you're like me and you use the "resume session" feature constantly, your sessions can last for *days*. When they finally do end, you lose all that valuable context - the debugging journey, the architectural decisions, the "why did we do it this way" moments.

Not cool.

## The Solution: Skills + Plugins + Automation

After building the initial version, I evolved this into a **hybrid architecture** that gives you the best of both worlds:

### The conversation-logger Skill (Core Logic)

A **Claude Skill** is a portable, self-contained folder with instructions and scripts. The [conversation-logger skill](https://github.com/sirkitree/conversation-logger) contains all the core functionality:

1. **Save script** - Converts JSONL conversations to readable markdown
2. **Search script** - Full-text search with context lines
3. **Parse script** - Handles the JSONL → markdown conversion

Skills are **cross-platform** - they work in Claude apps, Claude Code, and via the API. You can ask Claude naturally: "save this conversation" or "search conversations about docker," and the skill activates automatically.

### The conversation-saver Plugin (Automation Layer)

The **plugin** is a thin wrapper that adds automatic triggers:

1. **Stop hook** - Auto-saves after every Claude response in real-time
2. **Slash commands** - Convenient `/convo-search`, `/convo-list`, `/convo-recent`
3. **Install script** - Ensures the skill is installed when you add the plugin

The plugin **calls the skill's scripts**, so there's a single source of truth. Update the skill, and the plugin automatically benefits.

### How the Plugin Works

The plugin's Stop hook fires **after every Claude response** (not just at session end), giving you real-time backups. The hook is beautifully simple because it just delegates to the skill:

```bash
#!/bin/bash
# Stop hook - saves conversation after each Claude response
HOOK_DATA=$(cat)
TRANSCRIPT_PATH=$(echo "$HOOK_DATA" | jq -r '.transcript_path // empty')
SESSION_ID=$(echo "$HOOK_DATA" | jq -r '.session_id // "unknown"')

# Call the conversation-logger skill's save script
SKILL_SCRIPT="$HOME/.claude/skills/conversation-logger/scripts/save-conversation.sh"

if [ -f "$SKILL_SCRIPT" ]; then
    bash "$SKILL_SCRIPT" "$TRANSCRIPT_PATH" "$SESSION_ID"
else
    echo "Warning: conversation-logger skill not found" >&2
    echo "Install: cd ~/.claude/skills && git clone https://github.com/sirkitree/conversation-logger.git" >&2
fi
```

That's it! The hook just extracts the transcript path and hands it off to the skill. All the actual logic lives in the skill.

### What the Skill Does

The skill's `save-conversation.sh` script handles everything:

1. Copies the JSONL transcript to `~/.claude/conversation-logs/`
2. Calls the Python parser to convert JSONL → markdown
3. Creates session metadata JSON
4. Makes symlinks to the latest conversation

The Python parser (`scripts/parse-conversation.py`) does the heavy lifting:
- Parses the JSONL format Claude uses internally
- Extracts user messages and assistant responses
- Handles tool calls and results
- Formats everything as clean, readable markdown

The output is a beautifully formatted markdown file that reads like a natural conversation transcript.

### The Search Tool

The skill's search script makes finding conversations trivial:

```bash
# List all saved conversations
~/.claude/skills/conversation-logger/scripts/search-conversations.sh --list

# Show recent conversations
~/.claude/skills/conversation-logger/scripts/search-conversations.sh --recent 5

# Search for a specific term
~/.claude/skills/conversation-logger/scripts/search-conversations.sh "hooks"

# Search with more context
~/.claude/skills/conversation-logger/scripts/search-conversations.sh "git commit" --context 5
```

Or if you have the plugin installed, use the slash commands:
- `/convo-search hooks`
- `/convo-list`
- `/convo-recent 5`

It uses good old `grep` under the hood but wraps it in a friendly interface that:
- Shows you which conversation the match is from
- Provides context lines around matches
- Lists file sizes and timestamps
- Makes it trivial to find that one conversation where you solved that weird bug

## How to Set This Up

You have two options depending on your needs:

### Option 1: Plugin (Automatic + Real-Time)

For automatic saving after every response:

**Step 1:** Add the marketplace:
```bash
/plugin marketplace add https://github.com/sirkitree/claude-conversation-saver
```

**Step 2:** Restart Claude Code

The plugin automatically:
- Installs the conversation-logger skill if needed
- Sets up the Stop hook (saves after every response)
- Adds slash commands: `/convo-search`, `/convo-list`, `/convo-recent`

**Prerequisites:** `git`, `jq`, and `python3`

```bash
# Termux
pkg install git jq python -y

# macOS
brew install git jq python3

# Debian/Ubuntu
sudo apt install git jq python3
```

### Option 2: Skill Only (Manual + Portable)

For manual save-on-demand that works across Claude apps:

```bash
cd ~/.claude/skills
git clone https://github.com/sirkitree/conversation-logger.git
```

Then just ask Claude naturally:
- "Save this conversation"
- "Search conversations about docker"
- "When did we work on authentication?"

Or use the scripts directly (see examples above).

### Which Should You Choose?

- **Plugin**: Want set-it-and-forget-it automation? Real-time backups after every response? Use the plugin.
- **Skill**: Want manual control? Using Claude apps (not just Claude Code)? Cross-platform portability? Use just the skill.
- **Both**: The plugin uses the skill, so you get the best of both worlds automatically!

For more details, check out:
- [Plugin repository](https://github.com/sirkitree/claude-conversation-saver)
- [Skill repository](https://github.com/sirkitree/conversation-logger)

## How It Works in Practice

With the **plugin**, conversations are saved automatically after **every Claude response**. No waiting for the session to end - you get real-time backups. Each save creates/updates three files:

1. `conversation_YYYY-MM-DD_HH-MM-SS.jsonl` - The raw conversation data
2. `conversation_YYYY-MM-DD_HH-MM-SS.md` - Human-readable transcript (continuously updated)
3. `session_YYYY-MM-DD_HH-MM-SS.json` - Session metadata
4. `conversation_latest.md` - Symlink to your current conversation

With the **skill alone**, you ask Claude to save when you want. Natural language works: "save this conversation" or "I'm done, save this."

Then when you need to find something from a past conversation:

```bash
# Direct script usage
~/.claude/skills/conversation-logger/scripts/search-conversations.sh "that bug with the parser"

# Or with plugin slash command
/convo-search that bug with the parser
```

Boom. Instant context retrieval.

## Why the Hybrid Architecture Matters

The initial version had all the logic in the plugin. Every update meant redeploying the whole thing. Now:

1. **Core logic in skill** - Update once, benefits everywhere
2. **Plugin as thin wrapper** - Just handles automation triggers
3. **Single source of truth** - No code duplication
4. **Cross-platform** - Skill works in Claude apps, Code, and API
5. **User choice** - Want automation? Add the plugin. Want manual? Use just the skill.

This is the kind of architecture evolution you get when you build *with* Claude Code and then refine based on real usage.

## What You Get

Now every conversation is preserved forever. You can:

- Search through past sessions for solutions to similar problems
- Review architectural decisions you made weeks ago
- Find that one command or script you built in a previous session
- Keep a complete archive of your AI-assisted development journey

It's like having a perfect memory of every coding session.

## The Meta Moments

Want to know the really cool parts?

**Version 1:** I built the original plugin *with* Claude Code, wrote a blog post about it, and that conversation was auto-saved. I could search back through it to remember how we solved problems.

**Version 2:** Then I refactored it into the hybrid architecture (skill + plugin) *with* Claude Code, and *that* conversation was also auto-saved. I can now search through both conversations to see the evolution from monolithic plugin to clean separation of concerns.

It's auto-save inception, but also a living demonstration of iterative software architecture.

## The Bottom Line

If you're serious about using Claude Code (and you should be - it's incredible), you need conversation persistence. Five minutes of setup gives you a searchable archive of every AI coding session forever.

No more "I know we solved this before but I can't remember how."

No more "I wish I could find that conversation where we built that thing."

Just automatic, searchable, permanent conversation history.

Now if you'll excuse me, I'm going to search my conversation logs for something I built last week.

*Stay curious, keep building, and never lose context again.* 🚀

---

**Update History:**
- **October 14, 2025**: Initial plugin release with SessionEnd hook
- **October 16, 2025**: Refactored to hybrid architecture - skill + plugin, real-time saving with Stop hook

*Got ideas for improving this system? Open an issue on [GitHub](https://github.com/sirkitree/conversation-logger)! Considering: tagging, conversation summaries, semantic search, RAG integration.*
