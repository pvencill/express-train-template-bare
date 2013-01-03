var express = require('express'),
    connect_timeout = require('connect-timeout');

// Middleware
module.exports = function (app) {

    // Sessions
    var memoryStore = new express.session.MemoryStore();

    var session_middleware = express.session({
        key:app.config.session.key,
        secret: app.config.session.secret,
        store:memoryStore
    });

    // Error handler
    var error_middleware = express.errorHandler({
        dumpExceptions:true,
        showStack:true
    });

    // Middleware stack for all requests
    app.use(express['static'](app.set('public')));                      // static files in /public
    app.use(connect_timeout({ time:app.config.request_timeout }));   // request timeouts
    app.use(express.cookieParser());                                    // req.cookies
    app.use(session_middleware);                                        // req.session
    app.use(express.bodyParser());                                      // req.body & req.files
    app.use(express.methodOverride());                                  // '_method' property in body (POST -> DELETE / PUT)
    app.use(app.router);                                                // routes in lib/routes.js

    // Handle errors thrown from middleware/routes
    app.use(error_middleware);

    app.configure('development', function(){
        require('express-trace')(app);
    });
};
