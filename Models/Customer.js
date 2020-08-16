const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return ( Customer = sequelize.define(
        "customer",
        {
            userID: {
                type: Sequelize.INTEGER,
            },
            customerInfo: {
                type: Sequelize.STRING,
            },
            customerName: {
                type: Sequelize.STRING,
            },
            whichCategory: {
                type: Sequelize.STRING
            },
            phoneNumber: {
                type: Sequelize.STRING,
            },
            taxNumber: {
                type: Sequelize.STRING,
            },
            taxAddress: {
                type: Sequelize.STRING,
            },
        }
    ));
};