var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'mean'
});

module.exports = {
  query: function (sqlQuery, callback) {
    connection.connect();
    connection.query(sqlQuery, function(err, rows, fields) {
      if (err) throw err;
      callback(rows);
    });
    connection.end();
  }
};