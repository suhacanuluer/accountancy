const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return ( Payment = sequelize.define(
        "payment",
        {
            customerID: {
                type: Sequelize.INTEGER,
            },
            cost: {
                type: Sequelize.DOUBLE,
            },
            infoKDV: {
                type: Sequelize.BOOLEAN,
            },
            inOrOut: {
                type: Sequelize.BOOLEAN,
            },
            date: {
                type: Sequelize.DATE,
            },
        }
    ));
};