const models  = require("../models");

module.exports = {
    list: async(req, res, next) => {
        try {
            res.send("user/list");
        } catch (e) {
            next(e);
        }
    }
};
