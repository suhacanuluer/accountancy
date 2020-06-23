const Sequelize = require("sequelize");
const { sequelize } = require("../Database/Database");

module.exports = (sequelize, DataTypes) => {
    return ( Total = sequelize.define(
        "total",
        {
            userID: {
                type: Sequelize.STRING,
            },
            inWithKDV: {
                type: Sequelize.NUMBER,
            },
            inWithoutKDV: {
                type: Sequelize.NUMBER,
            },
            outWithKDV: {
                type: Sequelize.NUMBER,
            },
            outWithoutKDV: {
                type: Sequelize.NUMBER,
            },totalWithKDV: {
                type: Sequelize.NUMBER,
            },totalWithoutKDV: {
                type: Sequelize.NUMBER,
            },
        }
    ))
}