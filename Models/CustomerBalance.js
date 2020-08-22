const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return ( CustomerBalance = sequelize.define(
        "customerbalance",
        {
            customerID: {
                type: Sequelize.INTEGER,
            },
            inMoneyVAT: {
                type: Sequelize.DOUBLE
            },
            amountVAT: {
                type: Sequelize.DOUBLE,
            },
            inMoney: {
                type: Sequelize.DOUBLE
            },
            outMoney: {
                type: Sequelize.DOUBLE,
            },
            totalMoney: {
                type: Sequelize.DOUBLE
            }
        }
    ));
};