const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return ( User = sequelize.define(
        "user",
        {
            username: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            fullName: {
                type: Sequelize.STRING,
            },
            companyName: {
                type: Sequelize.STRING,
            },
            companyInfo: {
                type: Sequelize.STRING,
            },
        }
    ));
};