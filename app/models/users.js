const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataType) => {

    const users = sequelize.define("users", {
        email: { type: DataType.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
        password: { type: DataType.STRING, allowNull: false,
            set: function(val) {
                this.setDataValue('password', bcrypt.hashSync(val));
            }
        },
        name: { type: DataType.STRING, allowNull: false },
        lastName: { type: DataType.STRING, allowNull: false },
        disabled: { type: DataType.BOOLEAN, allowNull: false, defaultValue: false },
        inactive: { type: DataType.BOOLEAN, allowNull: false, defaultValue: true },
        validateEmailToken: { type: DataType.STRING },
        resetPasswordToken: { type: DataType.STRING },
        resetPasswordTimestamp: { type: DataType.DATE }
    }, {
        paranoid: true,
        instanceMethods: {
            isPasswordValid: function(password) {
                return bcrypt.compareSync(password, this.password);
            }
        },
        scopes: {
            admin: {
                attributes: ["id", "email", "name", "lastName", "disabled", "inactive", "createdAt"]
            },
            auth: {
                // where: {
                //     inactive: false, disabled: false
                // },
                attributes: ["id", "email", "name", "lastName", "disabled", "inactive", "createdAt"]
            },
            editor: {
                attributes: ["id", "email", "name", "lastName", "disabled", "createdAt"]
            },
            self: {
                where: {
                    disabled: false
                },
                attributes: ["id", "email", "name", "lastName", "disabled", "inactive", "createdAt"]
            },
            user: {
                where: {
                    inactive: false,
                    disabled: false
                },
                attributes: ["id", "name", "lastName", "createdAt"]
            }
        }
    });

    return users;
};