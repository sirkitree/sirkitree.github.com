---
layout: post
title: "Two approaches to AI coding memory: cursor-memory-bank vs compound-engineering"
date: '2026-02-10'
comments: true
published: true
tags:
  - tech
  - ai
permalink: /blog/comparing-ai-coding-memory-tools
---

I've been spending a lot of time lately thinking about how AI coding tools handle memory and context. Not the LLM's context window itself, but the layer on top — the systems we build to help the AI remember what it's working on, what it's already solved, and what matters about this particular project.

Two tools have landed on my radar: [cursor-memory-bank](https://github.com/vanzan01/cursor-memory-bank) and [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin). I've been evaluating both. They tackle overlapping problems, but they disagree pretty hard about how much horsepower you should throw at a coding session.

<!--more-->

## What these tools actually do

**Cursor Memory Bank** is a structured workflow system for the Cursor editor. It gives you six phase-based commands — `/van` for initialization, `/plan` for planning, `/creative` for design exploration, `/build` for implementation, `/reflect` for review, and `/archive` for documentation. All of these read from and write to a shared `memory-bank/` directory that persists between sessions. The key insight is a hierarchical rule-loading system that only pulls in what's relevant to your current phase, which the creator says [reduces initial token usage by about 70%](https://github.com/vanzan01/cursor-memory-bank) compared to loading everything at once.

It's a hobby project — the creator is upfront about that — and it shows in the best possible way. It does what it needs to do without trying to be everything.

**Compound Engineering Plugin** is the official tool from [Every](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents), built around the philosophy that "each unit of engineering work should make subsequent units easier — not harder." It's a Claude Code marketplace plugin that ships with 24 specialized agents, 13 commands, 11 skills, and 2 MCP servers. When you run `/workflows:plan`, three agents fan out in parallel — one researching your codebase, one reviewing past solutions, one fetching current best practices from the web. When you run `/workflows:review`, twelve agents simultaneously examine your code from different angles: security, performance, architecture, simplicity, data integrity, and more.

It's a lot of machinery. And it is *hungry*.

## Where they overlap

They're both trying to solve the same problem: AI coding assistants forget everything between sessions, and even within a session, they lose the thread on complex work. So both tools respond with persistent file structures and planning modes that force you to think before you build. The bet is that organizing context matters more than generating code.

I've had good results with each.

## Where they diverge

The difference shows up in your token budget.

Compound-engineering [consumes roughly 36,000 tokens just by being enabled](https://github.com/EveryInc/compound-engineering-plugin/issues/63) — that's the MCP tools, the 30 custom agents, and the skills all sitting in context. A single `/workflows:plan` execution can burn through 200k+ tokens. The parallel agent swarms are doing real work, but the meter is running hard.

Cursor-memory-bank takes the opposite approach. Its adaptive complexity system categorizes tasks into four levels, and a quick bug fix (Level 1) skips planning entirely and goes straight from `/van` to `/build`. The progressive rule loading means you're only paying for what you're actually using. After optimization, the creator reports system overhead sitting around 15-20% of the context window.

It's the difference between driving a pickup truck to the grocery store and driving a semi. The semi carries more, absolutely. But you don't always need to carry more.

## The trade-off I keep coming back to

Here's what I've noticed in practice: compound-engineering is more capable. The multi-agent review catches things I wouldn't have thought to check. The parallel research during planning surfaces connections across the codebase that I'd have missed. Every claims that individual developers using their system [can do the work of five](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents), which, okay, but for complex features I can see how the parallel agents add up to something real.

But it chews through token limits fast. On a Claude Max subscription, a couple of intensive planning sessions can eat into your daily budget and leave you throttled for the rest of the day. I've hit that wall more than once.

Cursor-memory-bank doesn't hit those highs, but it doesn't hit those lows either. For most of what I do day-to-day, adding a feature, fixing a bug, refactoring a module, the structured phases are enough scaffolding to keep the AI on track without torching my allocation.

## When I reach for each

I've started developing a rough heuristic. If I already have a decent mental model of what needs to happen and I mainly need the AI to hold context across the session, I reach for cursor-memory-bank. Bug fixes, small features, incremental improvements. The `/creative` command's [Think tool methodology](https://github.com/vanzan01/cursor-memory-bank) is surprisingly useful for working through design decisions without spinning up a fleet of agents.

If the task is bigger, new architecture, complex integrations, anything where I'd benefit from twelve reviewers looking at my code at once, I reach for compound-engineering. The `/workflows:compound` command, which captures learnings for future reuse, is where the "compounding" philosophy actually delivers. But I go in knowing this session is going to be expensive.

I wonder if these approaches will converge. Cursor-memory-bank could benefit from selective parallelism on complex tasks. Compound-engineering has [acknowledged the token overhead problem](https://github.com/EveryInc/compound-engineering-plugin/issues/63) and is working on optimization. Both projects are moving fast, and I suspect the gap between them will narrow.

For now I'm keeping both around. Which one I open depends on whether the task ahead of me feels like a Tuesday afternoon or a whiteboard session.
