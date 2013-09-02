---
layout: post
title: "Nginx: do not cache logged in Drupal or WordPress users"
date: 2012-02-09 17:29
comments: true
category: "blog"
---
A while ago I changed all of my domain names to [Namecheap](http://namecheap.com/) and migrated my Drupal and Wordpress sites to [Linode](http://www.linode.com/). I followed some excellent instructions from [James Sansbury](https://twitter.com/#!/q0rban) (soon to be a Lullabot article) and some of his [Nginx configuration files](https://github.com/q0rban/nginx-drupal). This worked great for my Drupal site (heh - which was this site that I then [converted to Jekkyl](blog/2012/01/29/using-node-dot-js-to-convert-drupal-to-jekkyl/)) and my [wife's WordPress site](http://jenneymarie.net/).

However, when my wife started using her blog on my fancy new Nginx setup with PHP-FPM, she noticed that when she created posts one after the other, they were overwriting eachother, effectively creating a new revision of the same post instead of creating a new one. I knew that this was because of the caching, but was still too new to Nginx to know exactly what to do about it.

Again, James to the rescue! He pointed me in the right direction and I got it working. Here's what I did.

One of the relevant pieces of James' setup, is this line within his [`/etc/nginx/nginx.conf`](https://github.com/q0rban/nginx-drupal/blob/master/nginx.conf#L63):

```
http {
...
  ##
  # Virtual Host Configs
  ##

  include /etc/nginx/conf.d/*.conf;
  include /etc/nginx/sites-enabled/*;
}
```

And then within [`/etc/nginx/conf.d/session_cookie.conf`](https://github.com/q0rban/nginx-drupal/blob/master/conf.d/session_cookie.conf) he searches for the cookie that Drupal sets when you log in:

```
# Determine if a Drupal session cookie is present
map $http_cookie $logged_in {
    default 0;
    ~SESS 1; # Drupal session cookie
}
```

To this, I added a search for the wordpress cookie as well:

```
# Determine if a Drupal session cookie is present
map $http_cookie $logged_in {
    default 0;
    ~SESS 1; # Drupal session cookie
    ~wordpress_logged_in 1; # Wordpress session cookie
}
```

The last piece is telling your site to bypass the cache if `$http_cookie` is set:

```
location / {
  ...
  # If client is logged in we bypass cache
  fastcgi_cache_bypass $logged_in;
  fastcgi_no_cache $logged_in;
  ...
}
```

A quick `sudo service nginx restart` and our WordPress site is working much better!