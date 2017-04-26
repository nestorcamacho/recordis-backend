const config = require("./config.js");
const models  = require("../app/models");

module.exports = function(passport, passportJWT) {
    const ExtractJwt = passportJWT.ExtractJwt;
    const JwtStrategy = passportJWT.Strategy;

    const jwtOptions = {};
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
    jwtOptions.secretOrKey = config.jwt.secretOrKey;

    const strategy = new JwtStrategy(jwtOptions, async(jwtPayload, next) => {
        console.log('payload received', jwtPayload);

        const user = await models.users.scope("auth").findOne({where: {id: jwtPayload.id}});
        if (!user) {
            next(null, false);
        }

        next(null, user.toJSON());
    });

    passport.use(strategy);
};