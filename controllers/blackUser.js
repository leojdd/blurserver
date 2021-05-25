const mongoose = require('mongoose');

var blackUserModel = require('../models/blackUser');

var companyController = require('./company');

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

exports.getUsersNotExported = async () => {
    var query = {
        exported: false
    }

    try {
        return await blackUserModel.find(query).exec();
    } catch (ex) {
        console.log(ex);
    }
}

exports.markUsersAsExported = async (users) => {
    var query = {
        _id: {
            $in: users.map(item => item._id)
        }
    }

    try {
        await blackUserModel.updateMany(query, { $set: { exported: true } })
    } catch (ex) {
        console.log(ex);
    }
}

var findSpecificUser = async (email, phone) => {
    var query = {
        $and: [
            { email: email },
            { phone: phone }
        ]
    }

    try {
        return await blackUserModel.findOne(query).exec();
    } catch (ex) {
        console.log(ex);
    }
}

var findUser = async (email, phone) => {
    var query = {
        $or: [
            { email: email },
            { phone: phone }
        ]
    }

    try{
        return await blackUserModel.findOne(query).exec();
    } catch (ex) {
        console.log(ex);
    }
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
            companies: [companyToSave],
            report_date: new Date(),
            exported: false
        }
    );

    blackUserObj.save(function (err) {
        if (err) {
            return err;
        }
    })

    try {
        await companyController.updateExposedUsersInCompany(company);
        return { success: true };
    } catch (ex) {
        console.log(ex);
        return { success: false };
    }
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

        try {
            await blackUserModel.updateOne({ _id: user._id }, { companies: user.companies });
            await companyController.updateExposedUsersInCompany(company);
            return { success: true };
        } catch (ex) {
            console.log(ex);
            return { success: false };
        }
    }

    return { success: true };
}