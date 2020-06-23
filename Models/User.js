const Sequelize = require("sequelize");
const { sequelize } = require("../Database/Database");

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
            nameSurname: {
                type: Sequelize.STRING,
            },
            companyName: {
                type: Sequelize.STRING,
            },
            companyInfo: {
                type: Sequelize.STRING,
            },
        }
    ))
}