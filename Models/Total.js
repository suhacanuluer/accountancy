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
                type: Sequelize.INTEGER,
            },
            inWithoutKDV: {
                type: Sequelize.INTEGER,
            },
            outWithKDV: {
                type: Sequelize.INTEGER,
            },
            outWithoutKDV: {
                type: Sequelize.INTEGER,
            },
            totalWithKDV: {
                type: Sequelize.INTEGER,
            },
            totalWithoutKDV: {
                type: Sequelize.INTEGER,
            },
            totalAll: {
                type: Sequelize.INTEGER,
            }
        }
    ))
}