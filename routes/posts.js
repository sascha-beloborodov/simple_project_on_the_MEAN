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


router.post('/', function(req, res, next) {
  console.log(req.body);
  var sql = "INSERT INTO posts (`title`, `link`) VALUES ('" + req.body.title + "', '"+req.body.link+ "');";
  Post.query(sql, function(result) {
    console.log(result);
  });
  // post.save(function(err, post){
  //   if(err){ return next(err); }

  //   res.json(post);
  // });
});

module.exports = router;