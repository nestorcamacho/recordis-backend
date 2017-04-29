module.exports = (sequelize, DataType) => {

    const usersRoles = sequelize.define("usersRoles", {
        id: { type: DataType.INTEGER, primaryKey: true, autoIncrement: true }
    }, {
        paranoid: true
    });

    return usersRoles;
};
