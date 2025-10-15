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

### Step 1: Install Dependencies

You need `jq` for JSON parsing and Python 3 for the conversation parser:

```bash
# Termux
pkg install jq python -y

# macOS
brew install jq python3

# Debian/Ubuntu
sudo apt install jq python3
```

### Step 2: Create the Directory Structure

```bash
mkdir -p ~/.claude/hooks
mkdir -p ~/.claude/scripts
mkdir -p ~/.claude/conversation-logs
```

### Step 3: Install the Hook

Create `~/.claude/hooks/session-end.sh` with the script above and make it executable:

```bash
chmod +x ~/.claude/hooks/session-end.sh
```

### Step 4: Create the Parser

Create `~/.claude/hooks/parse-conversation.py` with the following content:

```python
#!/usr/bin/env python3
"""
Parse Claude Code conversation JSONL files into readable markdown format
"""
import json
import sys
from pathlib import Path


def parse_conversation(jsonl_path, output_path, session_id="unknown"):
    """Parse a JSONL conversation file into markdown"""

    with open(output_path, 'w') as outfile:
        # Write header
        from datetime import datetime
        outfile.write("# Conversation Log\n")
        outfile.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        outfile.write(f"Session ID: {session_id}\n")
        outfile.write("\n---\n\n")

        # Process each line
        with open(jsonl_path, 'r') as infile:
            for line in infile:
                try:
                    data = json.loads(line)

                    msg_type = data.get('type')
                    message = data.get('message', {})
                    role = message.get('role')

                    # Process user messages
                    if msg_type == 'user' and role == 'user':
                        content = message.get('content')

                        # Skip if content is a list (tool results)
                        if isinstance(content, list):
                            continue

                        # Skip meta messages
                        if not content or 'Caveat:' in content:
                            continue
                        if '<command-name>' in content or '<local-command-stdout>' in content:
                            continue

                        outfile.write("## USER\n\n")
                        outfile.write(f"{content}\n\n")

                    # Process assistant messages
                    elif msg_type == 'assistant' and role == 'assistant':
                        content_list = message.get('content', [])

                        if not isinstance(content_list, list):
                            continue

                        has_content = False
                        assistant_text = []
                        tool_uses = []

                        for item in content_list:
                            if item.get('type') == 'text':
                                text = item.get('text', '').strip()
                                if text:
                                    assistant_text.append(text)
                                    has_content = True

                            elif item.get('type') == 'tool_use':
                                tool_name = item.get('name', 'unknown')
                                tool_input = item.get('input', {})
                                tool_uses.append((tool_name, tool_input))
                                has_content = True

                        if has_content:
                            outfile.write("## ASSISTANT\n\n")

                            # Write text content
                            for text in assistant_text:
                                outfile.write(f"{text}\n\n")

                            # Write tool uses
                            if tool_uses:
                                for tool_name, tool_input in tool_uses:
                                    outfile.write(f"**Tool:** `{tool_name}`\n")
                                    if tool_input:
                                        # Only show a few key fields to keep it readable
                                        if 'file_path' in tool_input:
                                            outfile.write(f"- file_path: `{tool_input['file_path']}`\n")
                                        if 'pattern' in tool_input:
                                            outfile.write(f"- pattern: `{tool_input['pattern']}`\n")
                                        if 'command' in tool_input:
                                            cmd = tool_input['command']
                                            if len(cmd) > 100:
                                                cmd = cmd[:100] + '...'
                                            outfile.write(f"- command: `{cmd}`\n")
                                    outfile.write("\n")

                except json.JSONDecodeError:
                    continue
                except Exception as e:
                    # Don't let parsing errors stop the whole process
                    print(f"Warning: Error processing line: {e}", file=sys.stderr)
                    continue


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: parse-conversation.py <input.jsonl> <output.md> [session_id]")
        sys.exit(1)

    jsonl_path = sys.argv[1]
    output_path = sys.argv[2]
    session_id = sys.argv[3] if len(sys.argv) > 3 else "unknown"

    parse_conversation(jsonl_path, output_path, session_id)
```

Make it executable:

```bash
chmod +x ~/.claude/hooks/parse-conversation.py
```

### Step 5: Install the Search Tool

Create `~/.claude/scripts/search-conversations.sh` with the following content:

```bash
#!/bin/bash
# Search through saved conversation logs

LOGS_DIR="$HOME/.claude/conversation-logs"

# Check if logs directory exists
if [ ! -d "$LOGS_DIR" ]; then
    echo "No conversation logs found at $LOGS_DIR"
    exit 1
fi

# Show usage if no arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 <search-term> [options]"
    echo ""
    echo "Search through conversation logs in $LOGS_DIR"
    echo ""
    echo "Options:"
    echo "  -l, --list       List all available conversation logs"
    echo "  -r, --recent N   Show N most recent conversations (default: 5)"
    echo "  -c, --context N  Show N lines of context around matches (default: 2)"
    echo ""
    echo "Examples:"
    echo "  $0 --list                    # List all conversations"
    echo "  $0 --recent 3                # Show 3 most recent conversations"
    echo "  $0 'hooks'                   # Search for 'hooks' in all conversations"
    echo "  $0 'git commit' --context 5  # Search with 5 lines of context"
    exit 0
fi

# Parse arguments
SEARCH_TERM=""
CONTEXT_LINES=2
ACTION="search"
RECENT_COUNT=5

while [[ $# -gt 0 ]]; do
    case $1 in
        -l|--list)
            ACTION="list"
            shift
            ;;
        -r|--recent)
            ACTION="recent"
            RECENT_COUNT="$2"
            shift 2
            ;;
        -c|--context)
            CONTEXT_LINES="$2"
            shift 2
            ;;
        *)
            SEARCH_TERM="$1"
            shift
            ;;
    esac
done

# List all conversations
if [ "$ACTION" = "list" ]; then
    echo "Available conversation logs:"
    echo ""
    ls -lh "$LOGS_DIR"/*.md 2>/dev/null | while read -r line; do
        file=$(echo "$line" | awk '{print $NF}')
        size=$(echo "$line" | awk '{print $5}')
        date=$(basename "$file" | sed 's/conversation_\(.*\)\.md/\1/' | tr '_' ' ')
        echo "  $date ($size)"
    done
    exit 0
fi

# Show recent conversations
if [ "$ACTION" = "recent" ]; then
    echo "Most recent $RECENT_COUNT conversations:"
    echo ""
    ls -t "$LOGS_DIR"/conversation_*.md 2>/dev/null | head -n "$RECENT_COUNT" | while read -r file; do
        date=$(basename "$file" | sed 's/conversation_\(.*\)\.md/\1/' | tr '_' ' ')
        size=$(wc -l < "$file")
        echo "=== $date ($size lines) ==="
        head -20 "$file"
        echo ""
        echo "... (use 'cat $file' to see full conversation)"
        echo ""
    done
    exit 0
fi

# Search for term
if [ -z "$SEARCH_TERM" ]; then
    echo "Error: No search term provided"
    exit 1
fi

echo "Searching for '$SEARCH_TERM' in conversation logs..."
echo ""

# Search through markdown files with context
grep -r -i -C "$CONTEXT_LINES" "$SEARCH_TERM" "$LOGS_DIR"/*.md 2>/dev/null | while IFS=: read -r file content; do
    # Skip empty lines and separators
    if [[ -z "$file" ]] || [[ "$file" == "--" ]]; then
        echo ""
        continue
    fi

    # Extract filename only if we have a valid file path
    if [[ -f "$file" ]]; then
        filename=$(basename "$file" | sed 's/conversation_\(.*\)\.md/\1/' | tr '_' ' ')
        echo "[$filename] $content"
    fi
done

# Count matches
MATCH_COUNT=$(grep -r -i -l "$SEARCH_TERM" "$LOGS_DIR"/*.md 2>/dev/null | wc -l)
echo ""
echo "Found matches in $MATCH_COUNT conversation(s)"
```

Make it executable:

```bash
chmod +x ~/.claude/scripts/search-conversations.sh
```

### Step 6: Configure Claude Code

Update your `~/.claude/settings.json` to enable the hook:

```json
{
  "hooks": {
    "SessionEnd": ["~/.claude/hooks/session-end.sh"]
  }
}
```

### Step 7: Add Search Shortcuts (Optional)

I added this to my `~/.claude/CLAUDE.md` so Claude knows about the search functionality:

```markdown
## Conversation History
All conversations are automatically saved to `~/.claude/conversation-logs/`.

### Searching Conversation Logs
To search through previous conversations:

```bash
# List all saved conversations
~/.claude/scripts/search-conversations.sh --list

# Show recent conversations
~/.claude/scripts/search-conversations.sh --recent 5

# Search for a specific term
~/.claude/scripts/search-conversations.sh "hooks"
```
```

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
