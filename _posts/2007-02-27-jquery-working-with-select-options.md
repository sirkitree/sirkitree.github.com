---
layout : post
title : "jQuery: working with select options"
created : 1172585968
permalink : /blog/jquery-working-select-options
category : "blog"
---
Following my <a href="/rolechanger/">recent post</a> on my <a href="http://drupal.org/project/rolechanger/">rolechanger module</a>, I started delving into how to provide functionality with the resulting dropdown box that the module provides. I wanted to provide all functionality through javascript and have included a rolechanger.js file for this purpose. However I found a few quirks while working with jQuery and the select element.

I started out with a .change() on the select element and drilled down through the .children() looking for [@selected]. However, thought this worked fine in IE, Firefox did not pick this up at all. I saw in the jQuery issues that this had been fixed, but evidently not for the release that ships with Drupal. Here's the resulting code for the IE portion:
<pre>
    // ie doesn't pick up the option.click, so we'll have to use the select.change
    $('#edit-role-changer').change(function(){

  	// get rid of select box
  	$('#edit-role-changer').hide();

        // show the chosen role as static text
       // NOTE: FF doesn't pick up [@selected]
      $('#role').html($(this).children("[@selected]").text()).show();

      // provide a change link
      $('#role-change-back').show();

    });
</pre>

Firefox was actually a little easier to code for, since I found that it would pick up a .click() on the option element. So the resulting code for Firefox is this:
<pre>
    // provide action for an option change
    $('#edit-role-changer option').click(function(){

  	  // get rid of select box
  	  $('#edit-role-changer').hide();

  	  // show the chosen role as static text
      $('#role').html($(this).text()).show();

      // provide a change link
      $('#role-change-back').show();

    });
</pre>

Since Firefox does pick up the .change() function that is on the select element that is used for IE, I then had to do a browsers detection, which jQuery makes simple as pie with $.browser. Here is the resulting full code:
<pre>
  // see which browser we're working with
  if ($.browser.msie) {

    // ie doesn't pick up the option.click, so we'll have to use the select.change
    $('#edit-role-changer').change(function(){

  	  // get rid of select box
  	  $('#edit-role-changer').hide();

  	  // show the chosen role as static text
  	  // NOTE: FF doesn't pick up [@selected]
      $('#role').html($(this).children("[@selected]").text()).show();

      // provide a change link
      $('#role-change-back').show();

    });
  }
  else {

    // provide action for an option change
    $('#edit-role-changer option').click(function(){

  	  // get rid of select box
  	  $('#edit-role-changer').hide();

  	  // show the chosen role as static text
      $('#role').html($(this).text()).show();

      // provide a change link
      $('#role-change-back').show();

    });
  }
</pre>

Happy jQuerying!
