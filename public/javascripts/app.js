var app = angular.module('flapperNews', ['ngRoute']);


app.config([
'$routeProvider',
function($routeProvider) {

    $routeProvider.
    when('/home', {
        templateUrl: '/templates/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function(posts){
            return posts.getAll();
          }]
        }
    }).
    when('/posts/:id', {
      templateUrl: '/templates/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$route', 'posts', 
          function($route, posts) {
            return posts.get($route.current.params.id);
        }]
      }
    }).
    otherwise({
        redirectTo: '/home'
    }); 
}]);


app.factory('posts', ['$http', function($http) {
    var o = {
        posts: []
    };
    
    o.getAll = function() {
      return $http.get('/posts').success(function(data) {
        angular.copy(data, o.posts);
      });
    };
    
    o.create = function(post) {
      return $http.post('/posts', post).success(function(data) {
        o.posts.push(data);
      });
    };
    
    o.upvote = function (post) {
      return $http.put('/posts/' + post.id + '/upvote')
        .success(function(data) {
          post.upvotes += 1;
        });
    };
    
    o.get = function(id) {
      return $http.get('/posts/' + id).then(function(res){
        return res.data;
      });
    };
    
    o.addComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment);
    };
    
    o.upvoteComment = function(post, comment) {
      return $http.put('/posts/' + post.id + '/comments/'+ comment.id + '/upvote')
        .success(function(data){
          comment.upvotes += 1;
        });
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
            posts.create({
              title: $scope.title,
              link: $scope.link
            });
            $scope.title = '';
            $scope.link = '';
        };
        
        $scope.incrementUpvotes = function(post) {
          posts.upvote(post);
        };
    }
]);


app.controller('PostsCtrl', [
  '$scope',
  '$routeParams',
  'posts',
  'post',
  function($scope, $routeParams, posts, post) {
    $scope.post = post;
    
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      posts.addComment(post.id, {
        text: $scope.text,
        author: 'user',
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };
    
    $scope.incrementUpvotes = function(comment){
      posts.upvoteComment(post, comment);
    };
  }
]);