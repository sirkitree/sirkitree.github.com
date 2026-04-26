---
layout: post
title: "Meet the cast of Quantum Weave"
date: '2026-04-26'
comments: true
published: true
tags:
  - quantum-weave
  - blog
  - creative-writing
permalink: /blog/meet-the-cast-of-quantum-weave
excerpt: "The Quantum Weave site has had a magic-system page and a stack of short stories around it for months. What it didn't have was people. Now there are eight."
---

The [Quantum Weave](/books/quantum-weave/) site has had a magic-system page and a stack of short stories around it for months. What it didn't have was people.

That bothered me. The [infographic](/books/quantum-weave/) explained how the nine disciplines work, the [narratives](/tags/tag/?tag=quantum-weave) showed reality fracturing in interesting ways, but if you landed on the page cold you couldn't tell who any of the stories were about, who they were trying to save, or who they were trying to stop. The world had nine sciences and zero faces.

Now there are eight. [Mira Caldwell](/books/quantum-weave/characters/mira-caldwell/), the master healer who hums old songs out of Veras while she works. [Silas Greythorne](/books/quantum-weave/characters/silas-greythorne/), the rogue architect with a publicly disastrous expulsion behind him and a charisma that still pulls people in. [Yara Venn](/books/quantum-weave/characters/yara-venn/), nineteen and self-taught, with light that obeys her even though her form is wrong. [Vex Mortain](/books/quantum-weave/characters/vex-mortain/), the Whisper-rank operative whose mental signature changes color with the room. [Thera Moss](/books/quantum-weave/characters/thera-moss/), barefoot in the Highland Farmsteads with soil under her nails, slow and patient and immovable. [Rowan Marrick](/books/quantum-weave/characters/rowan-marrick/), late-awakened at twenty-six, asking questions of pre-collapse hinges that should not still hold. [Torin Ashwright](/books/quantum-weave/characters/torin-ashwright/), the ninth-generation forge master who sings when the work runs long. [Kael Theron](/books/quantum-weave/characters/kael-theron/), most-cited Weaver researcher alive, ink-stained, narrating his own hands.

<!--more-->

## Writing them

I'd been keeping detailed character files in a separate worldbuilding repo for a while. Three or four hundred lines apiece, full of magical profile, signature techniques, motivations, fears, story potential. Useful for me, useless for anyone else. The files were a stat sheet wearing a story's clothes.

So I tried something. What if the public page read like introducing the character to a close friend? Less D&D-block, more "let me tell you about this person." Not "Mira Caldwell, age 42, she/her, primary disciplines Corpus and Luxomancy at master level," but instead, "If you walked into Mira's ward at the Restoration Academy on any given afternoon, you'd find her humming."

That second framing wants different things from the prose. It wants a present-tense scene to open. It wants specifics over abstractions — a Veras Market collapse, a particular braid, the way her phrasing falls in pitch when she's calming a patient who doesn't realize they're being calmed. It wants the writer to sound like they actually know the person.

The tradeoff was harder than I expected. The first draft had spoilers all over it because the most compelling material I had was exactly the stuff a reader shouldn't see before chapter one — active investigations, hidden truths the character doesn't yet know, the names of antagonists who matter to a later arc, the specific traumas that drive each story. Each profile got revised to focus on who the person *is* publicly, what they *do* for a living, what their reputation says about them. Less story, more dossier-with-a-pulse.

## The wiring

Each profile has a full-size portrait on the left that stays visible as you scroll, with the narrative on the right. Discipline names in the prose get a small dotted underline; hover one and you get a tooltip with the discipline code, a one-line summary, and a link to the full discipline page. Other characters mentioned in a profile become links to their own profile, with a tiny hover card showing name and role.

That cross-linking was a discovery. Once I had all eight profiles in front of me I noticed the characters mention each other constantly. Mira and Kael published together. Kael's peer review touched Silas's expulsion. Vex has worked the Forge Masters. Rowan trades custom tools with Torin. The character pages map onto each other the way disciplines do, and letting a reader click through that web feels right for a worldbuilding site.

The whole pass was [a single commit](https://github.com/sirkitree/sirkitree.github.com/commit/1db3fba), with a generous assist from parallel Claude Code agents — eight in parallel for the first draft of the profiles, then eight more for the spoiler-strip pass. I sat in the conductor seat, the agents handled the typing.

## What I'm still figuring out

I don't know yet how the dossier voice will hold up across 100,000 words of finished novel. The profiles work as standalone introductions, the way an appendix sits at the back of a book, but the voice I used to write *about* the characters isn't the voice I'll use to write *with* them. Mira's dry humor on her profile page is a description. In a scene she'll have to do it.

There's also the question of whether the portraits I'm using are the ones I want to print. They were generated, refined, regenerated, and at some point I called them done because I had to call them something done. If I ever actually publish I'll probably commission proper art. For now the wiki has faces.

The [character index](/books/quantum-weave/characters/) is the door if you want to poke around. Mira and Torin and Rowan are the [main cast](/books/quantum-weave/characters/) at the top; the other five orbit them. The [infographic](/books/quantum-weave/) explains what the disciplines do, and the [narratives tag](/tags/tag/?tag=quantum-weave) has the short stories that started this whole thing.
