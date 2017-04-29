const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = require("../../config/config.js");
const db = {};

if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//TODO relations
db.users.belongsToMany(db.roles, { as: 'Roles', through: { model: db.usersRoles, unique: false }, foreignKey: 'userId' });
db.roles.belongsToMany(db.users, { as: 'users', through: { model: db.usersRoles, unique: false }, foreignKey: 'roleId' });

//TODO initialize
sequelize.sync({force: true}).then(() => {
    db.roles.create({code: "ADMIN"});
    db.roles.create({code: "EDITOR"});
    db.roles.create({code: "USER"});
});

module.exports = db;
