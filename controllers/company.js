const mongoose = require('mongoose');
var companyModel = require('../models/company');

exports.getByToken = async (token) => {
    return await companyModel.findOne({ token: token }).exec();
};

exports.updateExposedUsersInCompany = async (company) => {
    var qtyExposedUsers = company.qty_exposed_users + 1;

    await companyModel.updateOne({ _id: company._id }, { qty_exposed_users: qtyExposedUsers });
}