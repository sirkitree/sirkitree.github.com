---
layout : post
title : "Resurrection"
created : 1258011256
permalink : /blog/resurrection
category : "blog"
---
Finally took the old personal blog from d5 to d6 and gave it a face lift. The new Acquia Slate theme is pretty slick, but I wanted to give it just a small bit of uniqueness, so I wrote a little custom function into the theme in order to pull up random photos from one of my Flickr sets. It was fast and fun, made easy with the Flickr module's API. Here's a couple quick steps I took:
<!--break-->
<ol>
<li>Edited the page-front.tpl.php and inserted a little logic to give the #preface-wrapper a different background-image property.
<pre>
<div id="preface-wrapper" class="clearfix" <?php if ($flickr): ?>style="background-image: url(<?php print $flickr; ?>);"<?php endif; ?>>
</pre></li>
<li>Wrote a custom function based off of the flickr_block.module's flickr_block_photoset_random() function. The function returns just the flickr farm url instead of running through the theme functions.
<pre>
function acquia_slate_flickr_block_photoset_random($nsid, $show_n, $size, $photoset_id) {
  // Get information about the photoset, including the owner.
  $info = flickr_photoset_get_info($photoset_id);
  if (!$info) {
    return;
  }

  // Get a list of "all" the photos in the photoset. This is cached.
  $response = flickr_request('flickr.photosets.getPhotos',
    array(
      'photoset_id' => $photoset_id,
      'per_page' => 500, // get as many images as possible
      'extras' => 'owner',
    )
  );
  if (!$response) {
    return;
  }

  // Randomly display $show_n of them
  $photos = $response['photoset']['photo'];
  shuffle($photos);

  $output = flickr_photo_img($photos[0], $size);

  return $output;
}
</pre></li>
<li>Set the result of this new function, called with hardcoded arguments, to a theme variable within template.php's phptemplate_preprocess_page() function.
<pre>
  // get a flickr image for the front page background
  $vars['flickr'] = acquia_slate_flickr_block_photoset_random($nsid, $show_n, $size, $photoset_id);
</pre>
</li>
</ol>

The one thing I couldn't find was a block setting when looking at the flickr_block.module for the large size picture, which I needed.  But looking at how the url is created within flickr.inc's flickr_photo_img() function and comparing it with an actual large image on Flickr.com, I quickly saw that the size string is simply 'b_d' for large.

Fun stuff!