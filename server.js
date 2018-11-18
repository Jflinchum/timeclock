const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Create connection
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'timeclock'
});

// Connect
db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('MySql Connected...');
});

const app = express();

app.use(cors());

app.get('/all', (req, res) => {
  db.query('SELECT * from times', (err, results) => {
    if (err) res.send(err);
    else {
      return res.json(results);
    }
  });
});

app.get('/authorize', (req, res) => {
  const { uid } = req.query;

  db.query(`
    SELECT *
    FROM users
    WHERE uid = '${uid}'
    `, (err, results) => {
    if (err) res.send(err);
    else {
      return res.json(results);
    }
  });
});

app.get('/register', (req, res) => {
  const { uid } = req.query;

  db.query(`
    INSERT INTO users
    (uid)
    VALUES('${uid}')
    `, (err, results) => {
    if (err) res.send(err);
    else {
      return res.json(results);
    }
  });
});

app.get('/times', (req, res) => {
  const { uid } = req.query;

  db.query(`
    SELECT *
    FROM times
    WHERE uid = '${uid}'
    ORDER BY time DESC
    `, (err, results) => {
    if (err) res.send(err);
    else {
      return res.json(results);
    }
  });
});

app.get('/clock', (req, res) => {
  const { uid, record, start } = req.query;
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let query = db.query(`
    INSERT INTO times
    (uid, time, record, start)
    VALUES('${uid}', '${time}', '${record}', ${start})
    `, (err, results) => {
    if (err) res.send(err);
    else {
      res.send(results);
    }
  });
});


app.listen('4000', () => {
  console.log('Server started on port 4000');
});
