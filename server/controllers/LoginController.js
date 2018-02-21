var constants = require('.././SalesforceClient');
var HttpStatus = require('http-status');
var Validation = require('./Validation');
var jsforce = require('jsforce');
var exec = require('child_process').exec;
var fs = require('node-fs');

//login
exports.login = function(req, res) {
    console.log('login method');
    var conn = new jsforce.Connection({
        oauth2:{
        clientId: constants.clientId,
        loginUrl:constants.loginUri,
        clientSecret:constants.clientSecret,
        redirectUri:constants.redirectUri
    }
    });
    var username = req.body.username;
    var password = req.body.password + constants.securityToken;
    conn.login(username, password, function(err, userInfo) {
        if (err) { return console.error(err); }
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        // logged in user property
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
        //res.send('success');
        res.status(HttpStatus.OK).json({
            status: 'success',
            code: HttpStatus.OK,
            data: userInfo,
            error: ''
        });        
      });
};