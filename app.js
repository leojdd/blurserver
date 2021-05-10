const express = require('express');
const app = express();
const port = 3001;

const mongoConnect = require('./models/mongoConnect');

var blackUserRoute = require('./routes/blackUser');
var companyRoute = require('./routes/company');

//#region initial configs

app.use(express.json());

mongoConnect.connect();

//#endregion

//#region endpoints

app.use('/blackUser', blackUserRoute);

app.use('/company', companyRoute);

//#endregion

//#region last configs

app.listen(port, () => {
    console.log(`APP ON -> http://localhost:${port}`);
});

//#endregion