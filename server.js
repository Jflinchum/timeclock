const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { dbHost, dbUser, dbPass, dbPort, serverPort } = require('./serverConfig');

// Create connection
const db = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPass,
  port: dbPort,
});

// Create the times table
const createTimesTable = (cb) => {
  db.query(`CREATE TABLE timeclock.times
    (id INT(11) NOT NULL AUTO_INCREMENT,
    uid VARCHAR(7) NOT NULL,
    time DATETIME NOT NULL,
    record ENUM('work','break','lunch') NOT NULL,
    start BOOLEAN NOT NULL,
    PRIMARY KEY (id))
   `, cb);
}

// Create the users table
const createUsersTable = (cb) => {
  db.query(`CREATE TABLE timeclock.users
   (uid VARCHAR(7) NOT NULL,
   admin BOOLEAN NOT NULL,
   PRIMARY KEY (uid))
   `, cb);
}

/**
 * Make a connection to the sql server. It will attempt to make the
 * timeclock database first. If it doesn't already exist, it will
 * continue to create the times and users tables for the application.
 * If it already exists, it will move on and won't attempt to make the tables.
 */
db.connect((err) => {
  if (err) throw err;
  db.query('CREATE DATABASE timeclock', (err, results) => {
    if (err && err.code !== 'ER_DB_CREATE_EXISTS') throw err;
    if (!err) {
      console.log('Creating times table...');
      createTimesTable((err, results) => {
        if (err) throw err;
        else {
          console.log('Creating users table...')
          createUsersTable((err, results) => {
            if (err) throw err;
            console.log('Created times and users tables...');
          });
        }
      });
    }
  });
  console.log('MySql Connected...');
});

const app = express();
app.use(cors());

/**
 * authorize
 * @param {VARCHAR(7)} uid
 * returns [{uid, admin}]
 */
app.get('/authorize', (req, res) => {
  const { uid } = req.query;

  db.query(`
    SELECT *
    FROM timeclock.users
    WHERE uid = ${db.escape(uid)}
    `, (err, results) => {
    if (err) res.send(err);
    else {
      return res.json(results);
    }
  });
});

/**
 * register
 * @param {VARCHAR(7)} uid
 * @param {BOOLEAN} admin
 */
app.get('/register', (req, res) => {
  const { uid, admin } = req.query;

  db.query(`
    INSERT INTO timeclock.users
    (uid, admin)
    VALUES(${db.escape(uid)}, ${db.escape(admin)})
    `, (err, results) => {
    if (err) res.send(err);
    else {
      return res.json(results);
    }
  });
});

/**
 * register
 * @param {VARCHAR(7)} uid
 * @param {DATE} date
 * returns [{id, uid, time, record, start}]
 */
app.get('/times', (req, res) => {
  const { uid, date } = req.query;

  let uidQry, dateQry = '';
  if (uid) {
      uidQry = `uid = ${db.escape(uid)}`;
  }
  if (date) {
    dateQry = `time LIKE ${db.escape(`%${date}%`)}`;
  }

  let whereQry = `WHERE ${uidQry} ${date ? 'AND' : ''} ${dateQry}`;
  db.query(`
    SELECT *
    FROM timeclock.times
    ${whereQry}
    ORDER BY time DESC
    `, (err, results) => {
    if (err) console.log(err);
    else {
      return res.json(results);
    }
  });
});

/**
 * register
 * @param {VARCHAR(7)} uid
 * @param {DATETIME} time
 * @param {ENUM('work','break','lunch')} record
 * @param {BOOLEAN} start
 */
app.get('/clock', (req, res) => {
  const { uid, record, start } = req.query;
  // Get the timezone offset and convert it to local time
  const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
  const time = new Date(Date.now() - timezoneOffset).toISOString().slice(0, 19).replace('T', ' ');

  let query = db.query(`
    INSERT INTO timeclock.times
    (uid, time, record, start)
    VALUES(${db.escape(uid)},
    ${db.escape(time)},
    ${db.escape(record)},
    ${db.escape(start)})
    `, (err, results) => {
    if (err) res.send(err);
    else {
      res.send(results);
    }
  });
});


app.listen(serverPort, () => {
  console.log(`Server started on port ${serverPort}`);
});
