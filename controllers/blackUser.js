const mongoose = require('mongoose');

var blackUserModel = require('../models/blackUser');

var companyController = require('./company');
var phraseControlller = require('../controllers/phrase');

exports.blackUserReport = async (req, res) => {
    var token = req.body.token;

    var company = await companyController.getByToken(token);

    if (!company) {
        res.send('Sorry, invalid token!!!');
        return;
    }

    var emailIsFine = await verifyEmail(req.body.email);

    if (emailIsFine !== true) {
        res.send(emailIsFine);
        return;
    }

    var user = await findSpecificUser(req.body.email, req.body.phone);

    var result;

    if (!user) {
        result = await createBlackUser(req.body.email, req.body.phone, company);
    } else {
        result = await updateCompaniesOfBlackUser(user, company);
    }

    res.send(result);
};

exports.verifyUser = async (req, res) => {
    var token = req.body.token;

    var company = await companyController.getByToken(token);

    if (!company) {
        res.send('Sorry, invalid token!!!');
        return;
    }

    var emailIsFine = await verifyEmail(req.body.email);

    if (emailIsFine !== true) {
        res.send(emailIsFine);
        return;
    }

    var user = await findUser(req.body.email, req.body.phone);

    res.send(
        {
            userInBlackList: user != null
        }
    );
};

exports.findBlackUser = async (req, res) => {
    var query = { email: req.body.email }

    var blackUser = await blackUserModel.findOne(query).exec();

    if (blackUser) {
        var companiesList = blackUser.companies.map((item) => { return item.name });

        var companiesString = '';

        companiesList.sort().forEach((companyItem) => {
            if (companiesString) {
                companiesString += ', ';
            }

            companiesString += companyItem;
        });

        res.send({
            email: blackUser.email,
            companies: companiesString
        });

        return;
    }

    res.send(false);
}

exports.getCountBlackUsers = async (req, res) => {
    var result = await blackUserModel.countDocuments({}).exec();

    var language = req.body.language ? req.body.language : "EN-US";

    var phraseObj = await phraseControlller.findPhrase(5, language);

    var phrase = phraseObj.phrase.replace('[qty]', result);

    res.send(phrase);
}

var findSpecificUser = async (email, phone) => {
    var query = {
        $and: [
            { email: email },
            { phone: phone }
        ]
    }

    return await blackUserModel.findOne(query).exec();
}

var findUser = async (email, phone) => {
    var query = {
        $or: [
            { email: email },
            { phone: phone }
        ]
    }

    return await blackUserModel.findOne(query).exec();
}

var createBlackUser = async (email, phone, company) => {
    var companyToSave = {
        name: company.name,
        token: company.token
    }

    var blackUserObj = new blackUserModel(
        {
            email: email,
            phone: phone,
            companies: [companyToSave]
        }
    );

    blackUserObj.save(function (err) {
        if (err) {
            return err;
        }
    })

    await companyController.updateExposedUsersInCompany(company);

    return 'Great, the user was added in black list';
}

var verifyEmail = async (email) => {
    if (!email || !email.includes('@')) {
        return 'Please, type it a valid email!!!';
    }

    return true;
}

var updateCompaniesOfBlackUser = async (user, company) => {
    var found = user.companies.find(element => element.token == company.token);

    if (!found) {
        var companyToSave = {
            name: company.name,
            token: company.token
        }

        user.companies.push(companyToSave);
        await blackUserModel.updateOne({ _id: user._id }, { companies: user.companies });

        await companyController.updateExposedUsersInCompany(company);
    }

    return 'Great, the user was updated in black list';
}