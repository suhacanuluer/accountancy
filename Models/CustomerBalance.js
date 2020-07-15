const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return ( CustomerBalance = sequelize.define(
        "customerbalance",
        {
            customerID: {
                type: Sequelize.INTEGER,
            },
            inMoneyVAT: {
                type: Sequelize.INTEGER
            },
            amountVAT: {
                type: Sequelize.INTEGER,
            },
            inMoney: {
                type: Sequelize.INTEGER
            },
            outMoney: {
                type: Sequelize.INTEGER,
            },
            totalMoney: {
                type: Sequelize.INTEGER
            }
        }
    ));
};