var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR not null, password VARCHAR not null)');
query.on('end', function() { client.end(); });
