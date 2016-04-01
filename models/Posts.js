// TODO: need to create simple orm

var mysql      = require('mysql');
var crypto     = require('crypto');

var connection;
if (!connection) {
  connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'mean'
  }); 
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
      "', '" + options.password + "')";
    connection.query(sql, function(err, rows, fields) {
      if (err) throw err;
      
      callback(rows);
    });
  }
};