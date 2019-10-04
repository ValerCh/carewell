var cors = require('cors');

module.exports = app => {
  var whitelist = ['http://localhost:8100', 'ionic://localhost', 'http://localhost'];
  var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  };

  app.use(cors(corsOptionsDelegate));
};
