# Timeclock Application
A timeclock application with a React front-end and a Node.js back-end.

## Features
* A node.js built server to handle API requests to the database.
* Users can register their own unique id formatted as three characters and four numbers (i.e `aaa0000`).
* When logging in, the user will see their various shift modifications and can clock in, clock out, start lunch, end lunch, start a break, end a break, or logout.
  * User's cannot start multiple shifts, end a shift during their lunch or break, or start their lunch or break when they are not clocked in.
* When registering, users can register as an admin which can do the above operations at any point in time.

## Dependencies
* Running this application requires a MySQL server running locally on port 3306 with a username and password both set as `root`.
  * Note the port, username, and password can be changed in the `serverConfig.js` file.
  * You can use any MySQL server, however I built the program using [MAMP](https://www.mamp.info/en/), which out of the box has those default configurations.
* Node version > 8.0

## How To Run
* First install node dependencies with `npm install`
* Run the back-end server with `npm run start-server`
* Run the front-end with `npm start`
