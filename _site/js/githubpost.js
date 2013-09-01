'use strict';

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

    var path = '_posts/' + determineFilename($scope);
    var content = "---\nlayout: post\ntitle: \"" + $scope.postTitle + "\"\ndate: " + determineDate('dt') + "\ncomments: true\npublished: true\ncategories: \n---\n" + $scope.postContent;
    var commitmsg = ":speech_ballon: new post for " + determineDate('dt');

    var repo = $scope.github.getRepo($scope.username, 'sirkitree.github.com');
    repo.write('master', path, content, commitmsg, function (err) {
      if (err !== null) {
        $log.log(err);
      }
    });
  }
});

function determineDate (which) {
  // Find the date and time in the correct formats
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;//January is 0!`
  var yyyy = today.getFullYear();
  if(dd<10) dd = '0' + dd;
  if(mm<10) mm = '0' + mm;
  var today_nice = yyyy + '-' + mm + '-' + dd;
  var date_time = today_nice + ' ' + today.getHours() + ':' + today.getMinutes();

  if (which == 'dt') {
    return date_time;
  } else if (which == 'tn') {
    return today_nice;
  }
  
}

function determineFilename ($scope) {
  // Determine the filename
  var post_title = $scope.postTitle;
  var filename = determineDate('tn') + '-' + post_title.replace(/[^\w]+/g, '-').toLowerCase() + '.md';
  return filename;  
}