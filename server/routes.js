var loginController = require('./controllers/LoginController');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

module.exports = function (app) {
  app.all('/', function (req, res) {
    var __dirname='./public/pages/';
      res.sendFile('login.html', { root: __dirname });      
    });    

    app.get('/UserProfile', function (req,res) {
        var __dirname='./public/pages/';
        res.sendFile('UserProfile.html', { root: __dirname });
    });
    
  //routes
  app.post('/authenticate',loginController.login);
};