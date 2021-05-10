const mongoose = require('mongoose');
var phraseModel = require('../models/phrase');

exports.getByCodesAndLanguage = async (req, res) => {
    var codes = req.body.codes;
    var language = req.body.language;

    var phrases = [];

    for (var i = 0; i < codes.length; i++) {
        var phrase = await findPhrase(codes[i], language);
        phrases.push(phrase);
    }

    res.send(phrases);
};

var findPhrase = async (code, language) => {
    var phraseObj = await phraseModel.findOne({ code: code, language: language }).exec();

    if (phraseObj) {
        return { code: phraseObj.code, phrase: phraseObj.phrase };
    } else {
        return { code: 0, phrase: 'NotFound!' };
    }
}

exports.findPhrase = findPhrase;