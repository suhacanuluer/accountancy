const Sequelize = require("sequelize");
const { sequelize } = require("../Database/Database");

module.exports = (sequelize, DataTypes) => {
    return ( Note = sequelize.define(
        "note",
        {
            customerID: {
                type: Sequelize.STRING,
            },
            notes: {
                type: Sequelize.STRING,
            },
            date: {
                type: Sequelize.STRING,
            },
        }
    ))
}