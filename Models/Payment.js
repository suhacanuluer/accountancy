const Sequelize = require("sequelize");
const { sequelize } = require("../Database/Database");

module.exports = (sequelize, DataTypes) => {
    return ( Payment = sequelize.define(
        "payment",
        {
            customerID: {
                type: Sequelize.STRING,
            },
            cost: {
                type: Sequelize.NUMBER,
            },
            ınfoKDV: {
                type: Sequelize.BOOLEAN,
            },
            inOrOut: {
                type: Sequelize.BOOLEAN,
            },
            history: {
                type: Sequelize.STRING,
            },
        }
    ))
}