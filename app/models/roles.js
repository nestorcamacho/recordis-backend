module.exports = (sequelize, DataType) => {

    const roles = sequelize.define("roles", {
        code: { type: DataType.STRING, allowNull: false, unique: true }
    }, {
        paranoid: true
    });

    return roles;
};
