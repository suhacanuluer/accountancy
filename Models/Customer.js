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
            phoneNumber: {
                type: Sequelize.STRING,
            },
            taxNumber: {
                type: Sequelize.STRING,
            },
            taxAdress: {
                type: Sequelize.STRING,
            },
        }
    ))
}