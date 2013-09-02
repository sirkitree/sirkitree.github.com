---
layout : post
title : "In the beginning... there was no Drupal."
created : 1165455296
permalink : /blog/drupal-beginner
categories : ["blog"]
---
Don't cry, it's true. But let me tell you about how I first came about <a href="drupal.org" target="_blank">my savior</a>.

My first Drupal child was a project we call the Resource Center. When I say we, I mean Shawn Priesz, Kevin Poust, and me. I started off with writing a login system for a project Shawn had built that takes registered users from our main company's website (<a href='http://www.c-sgroup.com' target='_blank' title='Construction Specialties, Inc - USA'>c-sgroup.com</a>) and gives our sales representatives the information of those users, that live in their respective area, along with what product details they were downloading. I know what you're thinking, 'Big Brother type stuff, eh?'. Well maybe a little, but these are our <strong>REGISTERED</strong> users and they know that their information is kept within the company. Or at least that's what helps <em>me</em> sleep at night. In any case, we needed a way for our sales reps to log in before they could see the information so that it was not readily available to just anyone.

So I worked for a while on a login script and built it around this reporting program (after converting it from ASP to PHP) and finally had a working system when alas, I found Drupal. Praise be. A system that already did what I was looking to do <strong><em>AND MORE</em></strong>.

I devoured it, finding that not only was it free, but there were literally a TON of developers using and developing for Drupal. The modules came into site after my first initial shock wore off at all of the already prepackaged features, and then I started in on my own development.

Well, I really had no idea at first of how to develop a module, and quite frankly was a tad bit intimidated to try something of the like, so I resorted to inserted PHP code within custom pages and linking around ever so sloppily. But hey, we all start somewhere right? I was a beginner DrupalHEAD and I have the scars to prove it. Mainly mental scars that you can't really see unless you sit beside me while I rework old code from a month or so ago. Then you hear a lot of 'Daaang it!'s with Nepoleon Dynamite's inflection. I had this folder in the Drupal root I called 'myblocks' and stuck all of my PHP code in there with a few links to scripts I would throw into the root/scripts/ folder... I'm a bit embarrassed of all this by now, but I really have no shame.

Between here and there I came across Ajax, and all of it's wonders and took a bit of a break from the daily Drupal grind to relearn all of the javascript I had started out with almost 9 years ago. But you can <a href="http://www.thethisorthat.com/ajax-app-development" target="_blank">read about that</a> over at <a href="http://thethisorthat.com" target="_blank">thethisorthat.com</a>, one of my subsites run by my good friend <a href="http://blog.linkworth.com/pubcon-linkworth-happy-hour-a-success/" target="_blank">INSANE Dave</a>.

But then came a point where I really wanted to start a fresh module and get my hands dripping red (blue?) in Drupal's inner core. I had gotten this email from a guy at work who thought it would be a good idea to display internal job openings on the Resource Center, so I got together with Human Resources and start hacking out a module. I started by reading the <a href="http://drupal.org/node/508" target="_blank">Module developer's guide</a> and tore apart a simple module (don't remember which one) and it went form there like wildfire. I couldn't get enough. Everything went into a module. I redeveloped all of the 'myblocks' crap into modules after I finished the iPost module (will post it later, this is the internal job listings module I made for HR). During the redevelopment of those, I we started wanting to put other sites into Drupal. Namely, <a href='http://www.grand-entrance.com'>Grand Entrance,</a>, which is like a sub company of ours that sells our products.

From there we knew it was going to expand even more because of the ease of use and management that Drupal provides. So while I did research into Drupal multisite functionality, Shawn was busy learning and setting up everything for subversion. I'll post sometime on my experience with that, but for now suffice to say, that if you are a developer, and you have not begun using subversion, DO IT! DO IT NOW! I seriously do not know what I did before subversion came into my life. This has been more a passion of Shawn's, but I've reaped many of the benefits. Even if you don't use it the correct way, which I'm still not sure I do entirely, for backup purposes alone it is a must.

But enough ranting on that, I'm focusing on Drupal multisites now. The basis of a drupal multisite is this: you have a domain, in fact, multiple domains, that point to the same core Drupal install. Drupal then routes the request to it's /sites folder and looks for a folder with the requested uri. This folder, contains a settings.php which defines the database in which the site runs, and wala! That's really all there is too it. One Drupal install, multiple database, multiple sites. So simple, yet so ingenious it makes me emotional.... well not really emotional, more sexually... no that's not it either... nevermind.

So what have we learned here today boys and ... well I doubt if you're a girl you've made it this far 'cuz I don't know hardly any girls that speak techbabble.

<ol>
  <li>Drupal is the lord your god in code format.</li>
  <li>If you can't find a Drupal module to do it for you, start by developing a real Drupal module and not trying to 'just get by' on mashed up code.</li>
  <li>Multisite Drupal installs are an easy thing to learn, and well worth the time, (1-2 minutes) to setup if you have multiple sites that you want to run through Drupal.</li>
  <li>This Jerad guy probably never gets a date.</li>
</ul>