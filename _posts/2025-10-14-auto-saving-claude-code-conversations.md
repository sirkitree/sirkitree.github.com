---
layout: post
title: "Auto-Saving Every Claude Code Conversation: A Hook-Based Approach"
date: '2025-10-14 20:15'
comments: true
published: true
tags:
  - tech
  - claude-code
  - automation
permalink: /blog/auto-save-claude-conversations
---

*Here's a problem I didn't know I had until I realized I needed it:* every conversation I have with Claude Code disappears into the ether once the session ends. Sure, the work gets done, the code gets written, but what about the *conversation itself*? The decision-making process, the problem-solving journey, the context of *why* things were done a certain way?

Yeah, I wanted to keep all that. Permanently. Automatically.

So I built a system to do exactly that using Claude Code's built-in hooks feature.

<!--more-->

## The Problem: Disappearing Conversations

When you're pair-programming with an AI, especially one as capable as Claude Code, you're not just getting code changes - you're getting explanations, reasoning, architectural decisions, and sometimes brilliant insights you'll want to reference later.

But by default, once you end a session, that's all gone. You've got the code changes in your git history, sure, but not the *conversation* that led to those changes.

What if you could automatically archive every single conversation, timestamped and organized, without lifting a finger?

## The Solution: Session Hooks

Turns out, Claude Code has this killer feature called [hooks](https://docs.claude.com/en/docs/claude-code/hooks) - scripts that automatically run at specific points during your session. There are several types:

- `PreToolUse` - Before a tool is used
- `PostToolUse` - After a tool completes
- `UserPromptSubmit` - When you submit a prompt
- `SessionStart` - When a session begins
- `SessionEnd` - When a session ends (this is the one we want!)

Perfect. Let's hook into `SessionEnd` and save everything.

## Building the Auto-Save System

Here's what we're going to build:

1. A directory to store all conversations: `~/.claude/conversation-logs/`
2. A shell script that runs on session end and saves the conversation
3. Configuration to wire it all together

### Step 1: Create the Logs Directory

```bash
mkdir -p ~/.claude/conversation-logs
```

This is where all your conversation archives will live, organized by timestamp.

### Step 2: Create the Hook Script

Create `~/.claude/hooks/session-end.sh`:

```bash
#!/bin/bash
# Session end hook - saves conversation when session ends

LOG_DIR="$HOME/.claude/conversation-logs"
mkdir -p "$LOG_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Read hook context from stdin
HOOK_DATA=$(cat)

# Save the raw hook data which contains session information
echo "$HOOK_DATA" > "$LOG_DIR/session_$TIMESTAMP.json"

# Try to extract and format the conversation if possible
if command -v jq &> /dev/null; then
    MD_FILE="$LOG_DIR/session_$TIMESTAMP.md"

    echo "# Conversation Log" > "$MD_FILE"
    echo "Date: $(date '+%Y-%m-%d %H:%M:%S')" >> "$MD_FILE"
    echo "" >> "$MD_FILE"

    # Extract any transcript or message data
    echo "$HOOK_DATA" | jq -r 'if .transcript then .transcript[]? | "## \(.role // "message")\n\n\(.content // "")\n" else "Session data recorded" end' >> "$MD_FILE" 2>/dev/null || echo "Session ended" >> "$MD_FILE"
fi

exit 0
```

Make it executable:

```bash
chmod +x ~/.claude/hooks/session-end.sh
```

### Step 3: Configure Claude Code Settings

Update your `~/.claude/settings.json` to include the hook:

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/session-end.sh"
          }
        ]
      }
    ]
  }
}
```

That's it. Seriously.

## How It Works

Now, every time you end a Claude Code session (whether by typing `/exit`, closing the terminal, or the session timing out), the hook automatically:

1. Triggers the `session-end.sh` script
2. Generates a timestamp in the format `YYYY-MM-DD_HH-MM-SS`
3. Saves the raw session data as `session_YYYY-MM-DD_HH-MM-SS.json`
4. Creates a human-readable markdown version as `session_YYYY-MM-DD_HH-MM-SS.md` (if `jq` is installed)

Your conversation logs directory will look like this:

```
~/.claude/conversation-logs/
├── session_2025-10-14_20-15-30.json
├── session_2025-10-14_20-15-30.md
├── session_2025-10-14_21-45-12.json
├── session_2025-10-14_21-45-12.md
└── ...
```

## What You Get

Each saved conversation includes:

- **JSON format**: Raw session data with full transcript
- **Markdown format**: Human-readable conversation flow with roles (user/assistant) and content
- **Timestamp**: Exact date and time the session ended
- **Persistent storage**: Lives in your home directory, accessible across all projects

## Why This Matters

Having a complete archive of your AI-assisted development sessions is like having a detailed lab notebook:

- **Decision tracking**: See *why* you made certain architectural choices
- **Learning resource**: Review how problems were solved
- **Documentation**: Auto-generated context for code changes
- **Debugging**: Trace back conversations that led to bugs
- **Knowledge base**: Search through past solutions to similar problems

## Going Further

This is just the beginning. You could extend this system to:

- Automatically commit conversation logs to a git repo
- Create searchable indexes of your conversations
- Generate weekly summaries of your Claude Code usage
- Export conversations to different formats (PDF, HTML, etc.)
- Filter or redact sensitive information before saving

The beauty of hooks is they're just shell scripts - you can make them do whatever you want.

## The Meta Moment

Here's the kicker: I built this entire system *with* Claude Code, during a session that is now automatically saved in my conversation logs. Meta as hell.

And now, every insight, every explanation, every problem-solving session gets preserved automatically. No more "wait, how did we solve that problem last week?" moments.

## Try It Yourself

The whole setup takes maybe 5 minutes. If you're using Claude Code regularly, this is one of those quality-of-life improvements that pays dividends immediately.

Your future self will thank you when you need to reference that brilliant solution from three weeks ago.

*Happy coding, and may all your conversations be automatically archived.*

---

*Have you built cool automation with Claude Code hooks? I'd love to hear about it in the comments!*
