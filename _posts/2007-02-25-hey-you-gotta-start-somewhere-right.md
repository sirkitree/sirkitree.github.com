---
layout : post
title : "Hey, you gotta start somewhere right?"
created : 1172420817
permalink : /content/rolechanger
categories : ["drupal","modules"]
---
So my first commit to the Drupal contributions has been made! WooHoo! I partied hard that night :) No, it's really not that big of a deal, but I'm excited as it takes me one step further into Drupal development and being more involved in the Drupal community.

The module is called <a href="http://drupal.org/projects/rolechanger">rolechanger</a>, and came about when there was a need on a new site I'm building for work that needs to have a menu's links change based upon a chosen role. The roles are created in the main Drupal interface and then you tell rolechanger which roles from that list you would like your users to be able to choose from. Nothing really happens once one of those roles is chosen, at least from a traditional programmatic standpoint since I'll be using javascript for the functionality of changing the menu items. The module is somewhat limited in this respect, but I've included a rolechanger.js file in the module's directory for this purpose and anyone can edit this to define what happens on change using drupal's built in jQuery library. It's really more of a widget I suppose, developed for a specific purpose and probably will not have a whole lot of use to anyone other then my current project, but I contributed it anyway just for the purpose of doing so and gaining the experience of committing code through CVS to Drupal's repository. Hey, you gotta start somewhere right?

Update: <a href="http://jeradbitner.com/node/16">Also, see my post on using some jQuery code with this module.</a>