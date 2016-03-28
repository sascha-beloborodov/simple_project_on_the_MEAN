var app = angular.module('flapperNews', ['ngRoute']);


app.config([
'$routeProvider',
function($routeProvider) {

    $routeProvider.
    when('/home', {
        templateUrl: '/templates/home.html',
        controller: 'MainCtrl'
    }).
    when('/posts/:id', {
      templateUrl: '/templates/posts.html',
      controller: 'PostsCtrl'
    }).
    otherwise({
        redirectTo: '/home'
    }); 
}]);


app.factory('posts', [function() {
    var o = {
        posts: []
    };
    
    return o;
}]);


app.controller('MainCtrl', [
    '$scope',
    'posts',
    function ($scope, posts) {
        $scope.test = 'Hello world';
        $scope.posts = posts.posts;
        
        $scope.addPost = function() {
            if (!$scope.title || $scope.title === '') { return; }
            $scope.posts.push({
                title: $scope.title,
                link: $scope.link, 
                upvotes: 0,
                comments: [
                  {author: 'Joe', body: 'Cool post!', upvotes: 0},
                  {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
                ]
            });
            $scope.title = '';
            $scope.link = '';
        };
        
        $scope.incrementUpvotes = function(post) {
            post.upvotes += 1;
        };
        
    }
]);


app.controller('PostsCtrl', [
  '$scope',
  '$routeParams',
  'posts',
  function($scope, $routeParams, posts) {
    $scope.post = posts.posts[$routeParams.id];
    
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };
  }
]);