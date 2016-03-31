// TODO: need to create error handle, validation, middleware .... etc :)))

var express = require('express');
var router = express.Router();
var Post = require('../models/Posts');

router.get('/', function(req, response, next) {
  var sql = "SELECT * FROM posts";
  var res;
  Post.query("SELECT * FROM posts", function(result) {
    res = result;
    response.json(res);
  });
});

router.get('/:id', function(req, response, next) {
  var id = Number(req.params.id), post, comments;
  if (!Number.isInteger(Number(id))) {
    throw "Invalid parameter";
  }
  
  var sql = "SELECT * FROM posts WHERE id=" + id;
  
  var promise = new Promise(function(resolve, reject) {
    try {
      Post.query(sql, function(result) {
        post = result[0];
      });
      resolve();
    }
    catch(e) {
      console.log("Can not get data");
      reject();
    }
  });
  
  promise.then(function (val) {
    Post.query("SELECT * FROM comments WHERE post_id=" + id, function(result) {
      comments = result;
      post.comments = comments;
      response.json(post);
    });
  });
  // Post.query(sql, function(result) {
  //   res = result;
  //   response.json(res[0]);
  // });
});


router.post('/', function(req, res, next) {
  console.log(req.body);
  var sql = "INSERT INTO posts (`title`, `link`) VALUES ('" + req.body.title + "', '" + req.body.link + "');", 
    idNewRecord, post;

  
  var promise = new Promise(function(resolve, reject) {
    try {
      Post.query(sql, function(result) {
        // nothing
        idNewRecord = result.insertId;
        resolve();
      });
    }
    catch(e) {
      console.log("Can not get data");
      reject();
    }
  });
  promise.then(function (val) {
    Post.query("SELECT * FROM posts WHERE id=" + idNewRecord, function(result) {
      post = result[0];
      res.json(post);
    });
  });
  
  
});

//TODO: this method must be PUT
router.post('/:id/upvote', function(req, res, next) {
  var id = Number(req.params.id);
  if (!Number.isInteger(Number(id))) throw "Invalid parameter";
  
  var post;
  var upvotes;
  var promise = new Promise(function(resolve, reject) {
    try {
      Post.query("SELECT * FROM posts WHERE id="+id, function(result) {
        post = result[0];
        upvotes = Number(post.upvotes) + 1;
        post.upvotes = upvotes;
        resolve();
      });
    }
    catch(e) {
      console.log("Can not get data");
      reject();
    }
  });
  promise.then(function (val) {
    Post.query("UPDATE posts SET upvotes =" + upvotes + " WHERE id =" +id, function(result) {
      // nothing
    });
    res.json(post);
  });
});



router.post('/:id/comments', function(req, res, next) {
  var id = Number(req.params.id), idNewRecord;
  if (!Number.isInteger(Number(id))) throw "Invalid parameter";
  
  var sql = "INSERT INTO comments (post_id, text, author) VALUES(" + 
    id + ", '" + req.body.text + "', '" + req.body.author + "')";

  var promise = new Promise(function(resolve, reject) {
    try {
      Post.query(sql, function(result) {
        idNewRecord = result.insertId;
        resolve();
      });
    }
    catch(e) {
      console.log("Can not get data");
      reject();
    }
  });
  promise.then(function (val) {
    res.json({
      author: req.body.author,
      text: req.body.text,
      id: idNewRecord,
      upvotes: 0
    });
  });
});



router.put('/:id/comments/:cId/upvote', function(req, res, next) {
  var id = Number(req.params.id);
  var cId = Number(req.params.cId);
  if (!Number.isInteger(Number(id)) || 
    !Number.isInteger(Number(cId))) throw "Invalid parameter";
  
  var comment;
  var upvotes;
  var promise = new Promise(function(resolve, reject) {
    try {
      Post.query("SELECT * FROM comments WHERE id="+cId, function(result) {
        comment = result[0];
        upvotes = Number(comment.upvotes) + 1;
        comment.upvotes = upvotes;
        resolve();
      });
    }
    catch(e) {
      console.log("Can not get data");
      reject();
    }
  });
  promise.then(function (val) {
    Post.query("UPDATE comments SET upvotes =" + upvotes + " WHERE id =" +cId, function(result) {
      // nothing
    });
    res.json(comment);
  });
});

module.exports = router;