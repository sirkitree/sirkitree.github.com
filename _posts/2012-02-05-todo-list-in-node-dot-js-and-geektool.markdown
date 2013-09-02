---
layout: post
title: "todo list in node.js and geektool"
date: 2012-02-05 13:59
comments: true
category: "blog"
---
I've long had a quick shell script that was a simple todo list based on Jerod Santo's [Minimally Awesome Todos](http://blog.jerodsanto.net/2010/12/minimally-awesome-todos/). It's very minimal, and quite awesome indeed. Even more than loving how minimal it is, I really liked displaying my todos on my desktop through [GeekTool](http://projects.tynsoe.org/en/geektool/).

Then I stumbled onto a [Node.js version](https://github.com/vesln/todo) of a todo list and thought I'd give it a shot. I got it setup, but when I wanted to try to display the output through GeekTool, I failed. So I delved into todo list code a bit more and learned quite a lot!

My [first attempt](https://github.com/vesln/todo/pull/3) was to simply write the output of the `todo ls` command to a file. I got an immediate response from the maintainer, [Veselin Todorov](https://github.com/vesln) and was encouraged to change the command from `write` to `export` and write up a test for the new command as well.

I succeeded in [converting the `write` command to `export`](https://github.com/vesln/todo/pull/4), and fixed up a small bug with the path of the file I was writing to by default, but thus far have completely failed at writing a test to confirm that the file was written.

The project is currently using [Sinon.JS](http://sinonjs.org/) for testing, and even though the API seems pretty robust, and the examples coherent, I'm simply failing at figuring out how to test file creation with it. So far all I have is a stub:

{% gist 1747985 %}

However, it is working well without a test at this point, and I have a pretty todo list on my desktop! :)

![GeekTool Todos](https://img.skitch.com/20120205-q32piq2918kutm1autmh6yby4m.png)