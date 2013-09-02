---
layout: post
title: "AngularJS Posting Interface for your GitHub Jekyll Site"
date: 2013-08-31 20:54
comments: true
published: true
category: "blog""
---
After getting a decent way to create a file on GitHub just using a POST from a form as [Brock Boland](http://brockboland.com/2013/07/jekyll-posting-interface/) spoke about with his Jekyll posting interface, I thought I would take this one step further and figure out a way to use the [GitHub API](http://developer.github.com/v3/) to create that file instead of taking you to GitHub's new file interface. This was much easier than I expected.

## GitHub.js
I did a little searching for AngularJS and GitHub authentication and came across [GitHub.js](https://github.com/michael/github) which (to my delight and surprise) is now being maintained by none other than my friends at [DevelopmentSeed](https://github.com/developmentseed)! This gives the browser a complete javascript library for working with the GitHub API and is simply perfect for the job.

I added a username and password field to my [post interface](/new.html) and setup an AngularJS controller to utilize this library.

```javascript
  var app = angular.module('app', ['app.filters']);

  app.controller('AuthCtrl', function($scope, $log) {
    $scope.username = '';
    $scope.password = '';
    $scope.success = false;
    $scope.auth = function() {
    
      $scope.github = new Github({
        username: $scope.username,
        password: $scope.password,
        auth: "basic"
      });
    }
  });
```

`$scope.github` now has access to all of the nifty functions that GitHub.js provides. You can see the [full controller](https://github.com/sirkitree/sirkitree.github.com/blob/master/js/githubpost.js) which uses the `GitHub.getRepo` and `repo.write` in order to create a new file in my _posts directory in markdown format with the appropriate YAML headers. GitHub then runs it through Jekyll and the result is what you're reading now.
