const express = require('express');
const app = express();

const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const passport = require('passport');
const passportJWT = require("passport-jwt");
require('./app/config/passport')(passport, passportJWT);

const routes = require('./app/routes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use("/", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    //res.locals.message = err.message;
    //res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err);

    if (err.name === "SequelizeValidationError") {
        res.status(403);
        res.send({errors: err.errors});
    }

    res.status(err.status || 500);
    res.send({errors: err.errors || []});

});

app.listen(port, () => {
    console.log('Recordis-backend listening on port ' + port);
});

module.exports = app;
