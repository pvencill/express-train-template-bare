//var resource = require('express-resource');

module.exports = function (app) {

    // Home
    //app.resource(app.controllers.home);
    app.get('/', app.controllers.home.index);

    //whenever a router parameter :model is matched, this is run
    app.param('model', function(req, res, next, model) {
        var Model = app.models[model];
        if(Model === undefined) {
            //if the request is for a model that does not exist, 404
            return res.send(404);
        }

        req.Model = Model;
        return next();
    });
};