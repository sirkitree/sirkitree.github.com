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

**Update:** This is now available as a Claude Code plugin! Install with `/plugin add https://github.com/sirkitree/claude-conversation-saver`

<!--more-->

## The Problem: Conversations Are Ephemeral

Claude Code stores your active session in a temporary JSONL file deep in `~/.claude/projects/`. Great for the current session, but the moment that session truly ends (not just paused - actually terminated), that context is gone forever.

And here's the kicker: if you're like me and you use the "resume session" feature constantly, your sessions can last for *days*. When they finally do end, you lose all that valuable context - the debugging journey, the architectural decisions, the "why did we do it this way" moments.

Not cool.

## The Solution: Hooks + Automation + Search

Claude Code has this killer feature called **hooks** - shell scripts that automatically run when certain events happen. One of those events is `SessionEnd`, which fires when a session actually terminates (not when you exit and resume, but when it properly ends).

Perfect. Let's build on that.

### What I Built

The system has three main components:

1. **Auto-save hook** - Captures conversations when sessions end
2. **Conversation parser** - Converts raw JSONL to readable markdown
3. **Search tool** - Makes finding old conversations trivial

### The Auto-Save Hook

Here's the magic. When a Claude Code session ends, this hook automatically:

1. Creates a timestamped copy of the raw conversation (JSONL format)
2. Parses it into human-readable markdown
3. Saves both versions to `~/.claude/conversation-logs/`
4. Preserves all the metadata (session ID, timestamps, model info)

The hook lives at `~/.claude/hooks/session-end.sh`:

```bash
#!/bin/bash
LOG_DIR="$HOME/.claude/conversation-logs"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
HOOK_DATA=$(cat)

# Save session metadata
echo "$HOOK_DATA" > "$LOG_DIR/session_$TIMESTAMP.json"

# Extract and copy the full transcript
TRANSCRIPT_PATH=$(echo "$HOOK_DATA" | jq -r '.transcript_path // empty')
SESSION_ID=$(echo "$HOOK_DATA" | jq -r '.session_id // "unknown"')

if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    # Copy raw JSONL
    cp "$TRANSCRIPT_PATH" "$LOG_DIR/conversation_$TIMESTAMP.jsonl"

    # Parse to markdown if parser available
    if command -v python3 &> /dev/null; then
        python3 "$HOME/.claude/hooks/parse-conversation.py" \
            "$LOG_DIR/conversation_$TIMESTAMP.jsonl" \
            "$LOG_DIR/conversation_$TIMESTAMP.md" \
            "$SESSION_ID"
    fi
fi
```

### The Conversation Parser

The Python parser (`~/.claude/hooks/parse-conversation.py`) does the heavy lifting:

- Parses the JSONL format Claude uses internally
- Extracts user messages and assistant responses
- Handles tool calls and results
- Formats everything as clean, readable markdown
- Preserves code blocks and formatting

The output is a beautifully formatted markdown file that reads like a natural conversation transcript.

### The Search Tool

Once you've got a bunch of saved conversations, you need to find stuff. Enter the search script (`~/.claude/scripts/search-conversations.sh`):

```bash
# List all saved conversations
~/.claude/scripts/search-conversations.sh --list

# Show recent conversations
~/.claude/scripts/search-conversations.sh --recent 5

# Search for a specific term
~/.claude/scripts/search-conversations.sh "hooks"

# Search with more context
~/.claude/scripts/search-conversations.sh "git commit" --context 5
```

It uses good old `grep` under the hood but wraps it in a friendly interface that:
- Shows you which conversation the match is from
- Provides context lines around matches
- Lists file sizes and timestamps
- Makes it trivial to find that one conversation where you solved that weird bug

## How to Set This Up

### The Easy Way: Install as a Plugin

Claude Code now supports plugins! Install with one command:

```bash
/plugin add https://github.com/sirkitree/claude-conversation-saver
```

That's it! The plugin automatically:
- Installs the SessionEnd hook
- Sets up all the scripts
- Adds slash commands: `/convo-search`, `/convo-list`, `/convo-recent`

**Prerequisites:** Make sure you have `jq` and `python3` installed first:

```bash
# Termux
pkg install jq python -y

# macOS
brew install jq python3

# Debian/Ubuntu
sudo apt install jq python3
```

Once installed, use the convenient slash commands:
- `/convo-search hooks` - Search for a term
- `/convo-list` - List all conversations
- `/convo-recent 5` - Show recent conversations

For more details on manual installation or to view the source code, check out the [GitHub repository](https://github.com/sirkitree/claude-conversation-saver).

## How It Works in Practice

Here's the beautiful part: **you don't have to do anything**. Just use Claude Code normally. When a session ends (really ends, not just pauses), the hook fires automatically and saves everything.

Each session creates three files:

1. `conversation_YYYY-MM-DD_HH-MM-SS.jsonl` - The raw conversation data
2. `conversation_YYYY-MM-DD_HH-MM-SS.md` - Human-readable transcript
3. `session_YYYY-MM-DD_HH-MM-SS.json` - Session metadata

Then when you need to find something from a past conversation:

```bash
~/.claude/scripts/search-conversations.sh "that bug with the parser"
```

Boom. Instant context retrieval.

## The Key Insight: Sessions vs. Exits

One thing that tripped me up initially: the `SessionEnd` hook only fires when a session **terminates**, not when you exit and resume. This is actually perfect because:

1. You *want* long-running sessions for continuity
2. You only need to save when the session truly ends
3. Resume functionality keeps your context alive
4. The hook captures everything when the session finally completes

So if you're constantly resuming sessions (which you should be!), the hook will fire less frequently - but when it does, it captures the entire multi-day conversation in all its glory.

## What You Get

Now every conversation is preserved forever. You can:

- Search through past sessions for solutions to similar problems
- Review architectural decisions you made weeks ago
- Find that one command or script you built in a previous session
- Keep a complete archive of your AI-assisted development journey

It's like having a perfect memory of every coding session.

## The Meta Moment

Want to know the really cool part? I built this entire system *with* Claude Code, and now I'm writing a blog post *about* that system, and the conversation where we built it is auto-saved, and I can search back through it to remember exactly how we solved each problem.

It's auto-save inception.

## The Bottom Line

If you're serious about using Claude Code (and you should be - it's incredible), you need conversation persistence. Five minutes of setup gives you a searchable archive of every AI coding session forever.

No more "I know we solved this before but I can't remember how."

No more "I wish I could find that conversation where we built that thing."

Just automatic, searchable, permanent conversation history.

Now if you'll excuse me, I'm going to search my conversation logs for something I built last week.

*Stay curious, keep building, and never lose context again.* 🚀

---

*Got ideas for improving this system? Let me know in the comments! I'm thinking about adding tagging, conversation summaries, and maybe even semantic search next.*
