---
layout : post
title : "jQuery checkbox goodness"
created : 1181158685
permalink : /blog/jquery-checkbox-goodness
category : "blog"
---
I was working on a select all feature today and just wanted to share this with the world. (a.k.a. keep it for later)

<pre>
$(document).ready( function() {
  $('a#select_all').click( function() {
    $('input:checkbox').each( function() {
      this.checked = !this.checked;
    });
    return false;
  });
});
</pre>

The first item to note is that jQuery created pseudo classes for input.
<pre>
$('input:checkbox');
...
$('input:textbox');
... etc.
</pre>

The second item to note, which I thought was ingenious, was setting the value of the checkbox to the inverse of it's current value.
<pre>
this.checked = !this.checked;
</pre>

Works great and it's short and sweet. Who loves jQuery?
