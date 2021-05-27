const blackUserController = require('./controllers/blackUser');
const request = require.main.require('request-promise');

exports.run = async () => {
    var usersNotExported = await blackUserController.getUsersNotExported();

    if (!usersNotExported || usersNotExported.length <= 0) {
        return;
    }

    var parsedUsersToExport = await parseUsersToExport(usersNotExported);

    var result = await exportUsers(parsedUsersToExport);

    console.log(result);

    if (result) {
        await blackUserController.markUsersAsExported(usersNotExported);
    }
}

var parseUsersToExport = async (users) => {
    var parsedUsersToExport = [];

    for (var user of users) {
        var parsedUser = {
            email: user.email,
            phone: user.phone,
            report_date: user.report_date
        };

        parsedUser.companies = [];

        for (var company of user.companies) {
            var parsedCompany = {
                name: company.name
            };

            parsedUser.companies.push(parsedCompany);
        }

        parsedUsersToExport.push(parsedUser);
    }

    return parsedUsersToExport;
}

var exportUsers = async (users) => {
    var body = {
        token: 'he¨H456e&%He%H456drYHfy7ydh4654dtH¨H$54645%ÿ$y%¨hfd45645612thd%¨her¨dhdf45645thdr¨&%#&df45ghd564565fgh',
        users: users
    };

    const requestParams = {
        url: 'https://www.blurproject.com/blackUser/exportBlackUsers',
        body: body,
        json: true
    };

    var result = false;

    try {
        result = await request.post(requestParams);
        if (result && result.success) {
            return true;
        }
    } catch (ex) {
        return false;
    }

    return false;
}