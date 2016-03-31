// TODO: need to create simple orm

var mysql      = require('mysql');
var crypto     = require('crypto');
var jwt = require('jsonwebtoken');
var connection;
if (!connection) {
  connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'mean'
  }); 
}

function setPassword(password) {
  var salt = crypto.randomBytes(16).toString('hex');
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return hash;
}

module.exports = {
  query: function (sqlQuery, callback) {
    connection.query(sqlQuery, function(err, rows, fields) {
      if (err) throw err;
      callback(rows);
    });
  },
  addNewUser: function (options, callback) {
    var sql = "INSERT INTO users (name, email, password)" +
      " VALUES ('" + options.name + "', '" + options.email + 
      "', '" + setPassword(options.password) + "')";
    connection.query(sql, function(err, rows, fields) {
      if (err) throw err;
      
      callback(rows);
    });
  }
};