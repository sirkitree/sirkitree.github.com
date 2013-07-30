---
layout: post
title: "Using Node.js to convert Drupal to Jekkyl"
date: 2012-01-29 15:54
comments: true
categories: ["code","drupal","node.js","jekkyl"]
---
I've gone and revamped my blog again.

The current new hotness has been [Jekkyl](https://github.com/mojombo/jekyll/wiki) of late, ever since GitHub came out with it's [Pages](http://pages.github.com/) feature. My first awareness of it was around September 2011 when [DevelopmentSeed](http://developmentseed.org/) converted their .org page to Jekkly and [wrote about it](http://developmentseed.org/blog/2011/09/09/jekyll-github-pages/). I started playing with it almost immediately when I had downtime during [Lullabot](http://www.lullabot.com)'s [Do it with Drupal](http://2011.doitwithdrupal.com) conference. Sacreligious? Whatever, it was something new to learn.

Then quite recently [Walkah.net](http://walkah.net/blog/new-year-new-blog/) moved to Jekkyl and renewed my interest when he released the [Ruby script](https://github.com/walkah/walkah.net/blob/master/_import/drupal.rb) he used to convert his simple Drupal blog into YAML for use with Jekkly. That looked interesting so I put it in my backlog.

Shortly after, I started getting some [flak](https://twitter.com/#!/mikl/status/159634667702722562) from [@mikl](https://twitter.com/#!/mikl) for not paying attention to my Drupal.org issue queue for the [Flag Friend](http://drupal.org/project/flag_friend) module and as I interacted with and him, found that he was using [Octopress](http://octopress.org/) for [his personal blog](http://mikkel.hoegh.org/). Octopress is a quick way to get started using Jekkly, and I like quick.

So I put these two sources of inspiration together and it gave me reason to revisit Walkah's Ruby script. After a few hours of trying to get the MySQL Ruby Gem working with the version of MySQL I have that comes with MAMP, I gave up and decided to just [rewrite the script into Node.js](https://github.com/sirkitree/sirkitree.github.com/blob/master/_import/drupal.js), which I've been trying to learn more about lately.

The end result is all of my posts from JeradBitner.com converted into YAML format for use with the Octopress system which uses Jekkyl to generate your pages and can be convieniently hooked up to GitHub Pages in order to quickly create content with a few simple commands. (Whew! Try saying that to your wife without sounding bat-shit crazy!)

    $> rake new_post['Title of your post']
  Then write your post of course.
    $> rake generate
  Which runs Jekkly and converts all of your YAML to HTML and puts the files in the correct place.
    $> rake preview
  This starts up a local server so you can see your new post at localhost:4000.
    $> rake deploy
  Which commits the generated files to your GitHub repository and pushes them.

