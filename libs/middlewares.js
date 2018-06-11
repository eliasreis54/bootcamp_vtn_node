const bodyParser = require('body-parser')
module.exports = app => {
  app.set('port', 3000);
  app.use(bodyParser.json());
  app.use(app.auth.initialize());
}
