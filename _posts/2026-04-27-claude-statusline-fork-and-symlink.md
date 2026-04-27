---
layout: post
title: "Forking My Claude Code Statusline"
date: '2026-04-27 10:00'
comments: true
published: true
tags:
  - tech
  - ai
permalink: /blog/claude-statusline-fork
---

About six months ago I [wrote about dropping in hell0github's statusline](/blog/claude-code-statusline) and calling it done. That stuck for a while. Then I kept wanting to change small things — the model abbreviation, which sections showed up, what the weekly bar actually counted — and `curl`-ing a fresh script into `~/.claude/` every time I tweaked something got old fast.

So I forked it into [its own repo](https://github.com/sirkitree/claude-statusline) and changed how I install it.

<!--more-->

## The symlink trick

The install script does one thing that matters: it symlinks `statusline.sh` and `statusline-config.json` from the repo into `~/.claude/`, backing up whatever was there before. That means the file Claude Code runs is the file in my git checkout. Pull the repo, the statusline updates. No copy step. No "wait, did I edit the right one?" moment that I've definitely had before with dotfiles.

```bash
git clone git@github.com:sirkitree/claude-statusline.git ~/repos/claude-statusline
cd ~/repos/claude-statusline && ./install.sh
```

If I'm on a different machine I run the same two commands and I'm done. The config lives next to the script, so it travels with the repo too.

## What I actually changed in the script

The original was already doing the heavy lifting with `ccusage` and the multi-layer cost bar. The changes that mattered to me:

The weekly percentage now reads from `rate_limits.seven_day.used_percentage` in the JSON Claude Code pipes to the statusline. The previous approach divided ccusage's dollar cost by a hardcoded $500 weekly cap for max5x, which is just wrong — Claude Max limits are message-based quotas, not dollar quotas. So my old statusline was confidently telling me "weekly 0%" when claude.ai/settings/usage said something else entirely. Now they agree.

I added a 5-hour session block from `rate_limits.five_hour` that shows the percentage and time until reset, which is a more useful signal than the ccusage block timer when you're trying to figure out whether to keep going or wait it out.

Model names are abbreviated — `Claude Opus 4.7` becomes `o4.7`, sonnet becomes `s`, haiku `h`. If the context window is 1M it tacks on `(1m)`. Saves horizontal space, and at this point I recognize the shorthand faster than the full name.

There's an `effort` section now too, since some models expose `/effort` levels (low/medium/high/xhigh/max → `lo`/`md`/`hi`/`xh`/`mx`). Useful for remembering what I set the dial to three hours ago.

Every section is toggleable in `statusline-config.json` under `sections.*`. Colors live there too. The thresholds for the multi-layer cost bar (where it flips green→orange→red) are configurable instead of hardcoded.

## What it looks like now

```
sirkitree.github.com | o4.7 | mx | master | 23k/200k [██░░░░░░░░] | $12/$140 [█│░░░░░░░░] 9% | weekly 34% | session 18% → 2h 14m | ×1
```

A lot of glanceable signal in one line. The pipe between the cost bar's filled portion and empty portion is the projection — where ccusage thinks I'll end up by the end of the 5-hour block — colored by which layer it lands in.

## Why a fork instead of a PR

Honestly, because the changes are opinionated. The hardcoded weekly limit was a real bug, but the model-name abbreviation, the effort section, the rearrangement of what's a "section" — that's all personal taste. It's easier to maintain my own version than to argue every preference into someone else's repo. And the symlink workflow means my taste is one `git pull` away on every machine I use.

The repo is at [sirkitree/claude-statusline](https://github.com/sirkitree/claude-statusline) if you want to grab it or rip pieces out. Credit where it's due — the bones are still hell0github's, and the cost data still flows through [ccusage](https://www.npmjs.com/package/ccusage).
