const models  = require("../models");

const jwt = require('jsonwebtoken');
const uuid = require("uuid/v4");
const moment = require("moment");
const mailer = require("../services/mailer.js");
const config = require("../../config/config.js");

module.exports = {
    signup: async(req, res, next) => {
        try {
            const {name, lastName, email, password} = req.body;

            if (password.length <= 4 || password.length >= 25) {
                next({status: 403, errors: {path: "password", type: "invalid length"}});
                return;
            }

            const existUser = await models.users.findOne({where: {email}});
            if (existUser) {
                next({status: 403, errors: {path: "email", type: "unique violation"}});
                return;
            }

            const validateEmailToken = uuid();
            const createdUser = await models.users.create(
                    {name, lastName, email, password, validateEmailToken, roles: [{code: "USER"}]},
                    {include: [roles]}
                );

            const templateValues = {
                name: createdUser.name,
                lastName: createdUser.lastName,
                validateEmailToken
            };
            mailer.sendTemplateMail({to: createdUser.email, template: "validateEmail", templateValues});

            const user = await models.users.scope("self").findById(createdUser.id);
            res.send(user.toJSON());
        } catch (e) {
            next(e);
        }
    },
    validateEmail: async(req, res, next) => {
        try {
            const {token} = req.body;

            const foundUser = await models.users.scope("self").findOne({where: {validateEmailToken: token}});
            if (!foundUser) {
                next({status: 404, errors: {path: "user", type: "not found"}});
                return;
            }

            await models.users.update({inactive: false}, {where: {id: foundUser.id}});

            const user = await models.users.scope("self").findById(foundUser.id);
            res.send(user.toJSON());
        } catch (e) {
            next(e);
        }
    },
    login: async(req, res, next) => {
        try {
            const {email, password} = req.body;

            const foundUser = await models.users.findOne({where: {email}});
            if (!foundUser) {
                next({status: 401, errors: {path: "email", type: "not found"}});
                return;
            }

            if (foundUser.inactive) {
                next({status: 401, errors: {path: "email", type: "not validated"}});
                return;
            }

            if (!foundUser.isPasswordValid(password)) {
                next({status: 401, errors: {path: "password", type: "not valid"}});
                return;
            }

            const user = await models.users.scope("self").findById(foundUser.id);

            const jwtPayload = {id: user.id};
            const jwtToken = jwt.sign(jwtPayload, config.jwt.secretOrKey);

            res.send(Object.assign(user.toJSON(), {token: jwtToken}));
        } catch (e) {
            next(e);
        }
    },
    forgotPassword: async(req, res, next) => {
        try {
            const {email} = req.body;

            const foundUser = await models.users.findOne({where: {email}});
            if (!foundUser) {
                next({status: 401, errors: {path: "email", type: "not found"}});
                return;
            }

            if (foundUser.inactive) {
                next({status: 401, errors: {path: "email", type: "not validated"}});
                return;
            }

            const resetPasswordToken = uuid();
            const resetPasswordTimestamp = moment().add(1, "hours");
            await models.users.update({resetPasswordToken, resetPasswordTimestamp}, {where: {id: foundUser.id}});

            const templateValues = {
                name: foundUser.name,
                lastName: foundUser.lastName,
                resetPasswordToken
            };
            mailer.sendTemplateMail({to: foundUser.email, template: "forgotPassword", templateValues});

            res.send({});
        } catch (e) {
            next(e);
        }
    },
    resetPassword: async(req, res, next) => {
        try {
            const {resetPasswordToken} = req.body;

            if (password.length <= 4 || password.length >= 25) {
                next({status: 403, errors: {path: "password", type: "invalid length"}});
                return;
            }

            const foundUser = await models.users.findOne({where: {resetPasswordToken}});
            if (!foundUser) {
                next({status: 401, errors: {path: "resetPasswordToken", type: "not found"}});
                return;
            }

            await models.users.update({resetPasswordToken: null, password}, {where: {id: foundUser.id}});

            const user = await models.users.scope("self").findById(foundUser.id);
            res.send(user.toJSON());
        } catch (e) {
            next(e);
        }
    },
    requireRole: (roles) => {
        return (req, res, next) => {
            const user = req.user;

            console.log(roles);
            console.log(user);

            if (user.id !== 1) {
                return next();
            }

            // if(roles.indexOf(foundUser.role) > -1){
            //     return next();
            // }
            //
            // res.status(401).json({error: 'You are not authorized to view this content'});
            // return next('Unauthorized');

            res.status(401).send("Unauthorized");
        }
    }
};
