const mongoose = require('mongoose');
var companyModel = require('../models/company');

var phraseControlller = require('../controllers/phrase');

exports.getByToken = async (token) => {
    return await companyModel.findOne({ token: token }).exec();
};

exports.getList = async (req, res) => {
    var companies = await companyModel.find().sort({ qty_exposed_users: -1 }).exec();

    var viewCompaniesList = [];

    companies.forEach(
        (company) => {
            viewCompaniesList.push(
                {
                    name: company.name,
                    icon: company.icon,
                    qty_exposed_users: company.qty_exposed_users
                }
            );
        }
    );

    res.send(viewCompaniesList);
};

exports.updateExposedUsersInCompany = async (company) => {
    var qtyExposedUsers = company.qty_exposed_users + 1;

    await companyModel.updateOne({ _id: company._id }, { qty_exposed_users: qtyExposedUsers });
}