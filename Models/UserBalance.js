const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return ( UserBalance = sequelize.define(
        "userbalance",
        {
            userID: {
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
    ))
}