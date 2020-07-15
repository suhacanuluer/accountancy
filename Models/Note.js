const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return ( Note = sequelize.define(
        "note",
        {
            customerID: {
                type: Sequelize.INTEGER,
            },
            notes: {
                type: Sequelize.STRING,
            },
            date: {
                type: Sequelize.DATE,
            },
        }
    ));
};