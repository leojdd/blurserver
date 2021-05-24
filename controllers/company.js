const mongoose = require('mongoose');
var companyModel = require('../models/company');

exports.getByToken = async (token) => {
    try {
        return await companyModel.findOne({ token: token }).exec();
    } catch (ex) {
        console.log(ex);
    }
};

exports.updateExposedUsersInCompany = async (company) => {
    var qtyExposedUsers = company.qty_exposed_users + 1;

    try {
        await companyModel.updateOne({ _id: company._id }, { qty_exposed_users: qtyExposedUsers });
    } catch (ex) {
        console.log(ex);
    }
}