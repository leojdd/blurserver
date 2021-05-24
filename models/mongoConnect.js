// Set up mongoose connection
const mongoose = require('mongoose');
const query = 'mongodb://localhost:27017/blurserver';
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

var mongoConnect = ({});

mongoConnect.connect = async () => {
    mongoose.connect(query, options).then(
        () => { 
            console.log('MongoDB Connected!');
        },
        err => { 
            console.log(err);
        }
    );

    mongoose.Promise = global.Promise;
}

module.exports = mongoConnect;