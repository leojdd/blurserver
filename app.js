const express = require('express');
const schedule = require('node-schedule');
const app = express();
const port = 3001;

const mongoConnect = require('./models/mongoConnect');

var blackUserCronService = require('./blackUsersCronService');
var blackUserRoute = require('./routes/blackUser');

//#region initial configs

app.use(express.json());

mongoConnect.connect();

schedule.scheduleJob('10 * * * *', blackUserCronService.run);

blackUserCronService.run();

//#endregion

//#region endpoints

app.use('/blackUser', blackUserRoute);

//#endregion

//#region last configs

app.listen(port, () => {
    console.log(`APP ON -> http://localhost:${port}`);
});

//#endregion