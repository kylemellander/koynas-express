var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', 'config'));

function returnErrors(err, done, res) {
  done();
  console.log(err);
  return res.status(500).json({ success: false, data: err });
}

function pgConnection(res, sql, params) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) return returnErrors(err, done, res);

    var query = params ? client.query(sql, params) : client.query(sql);
    var results = [];

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      var single = results.length === 1;
      results = single ? results[0] : results;
      var obj = single ? {user: results} : {users: results};

      done();
      return res.json(obj);
    });
  });
}

// CREATE
router.post('/users', function(req, res) {
  var data = {email: req.body.email, password: req.body.password};
  var model = req.originalUrl.match(/[^(\/api\/v1\/)](.*)/)[0];
  var sql = "INSERT INTO users (email, password) values($1, $2) RETURNING id, email, password;";
  var params = [data.email, data.password];

  return pgConnection(res, sql, params);
});

// READ
router.get('/users', function(req, res) {
  var model = req.originalUrl.match(/[^(\/api\/v1\/)](.*)/)[0];
  var sql = "SELECT * FROM users ORDER BY id ASC";

  return pgConnection(res, sql);
});

router.get('/users/:id', function(req, res) {
  var id = req.params.id;
  var model = req.originalUrl.match(/[^(\/api\/v1\/)](.*)(?=\/.*$)/)[0];
  var sql = "SELECT * FROM users WHERE id=($1) ORDER BY id ASC";
  var params = [id]

  return pgConnection(res, sql, params);
});

// UPDATE
router.put('/users/:id', function(req, res) {
  var id = req.params.id;
  var data = { email: req.body.email, password: req.body.password };
  var model = req.originalUrl.match(/[^(\/api\/v1\/)](.*)(?=\/.*$)/)[0];
  var sql = "UPDATE users SET email=($1), password=($2) WHERE id=($3) RETURNING id, email, password;";
  var params = [data.email, data.password, id];

  return pgConnection(res, sql, params);
});

// DELETE
router.delete('/users/:id', function(req, res) {
  var id = req.params.id;
  var model = req.originalUrl.match(/[^(\/api\/v1\/)](.*)(?=\/.*$)/)[0];
  var sql = "DELETE FROM users WHERE id=($1) RETURNING id;";
  var params = [id];

  return pgConnection(res, sql, params);
});

module.exports = router;
