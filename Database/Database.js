const Sequelize = require("sequelize");
const UserModel = require("../Models/User");
const sequelize = new Sequelize("accountancy", "root", "Ass122...", {
    host: "127.0.0.1",
    dialect: "mysql",
    reconnect: reconnectOptions || true
});

sequelize
    .sync()
    .then( () => {
        console.log("Connection successful.");
    })
    .catch( (e) => {
        console.log("Cannot Connect", e);
    });

var reconnectOptions = {
    max_retries: 999,
    onRetry: function (count) {
        console.log("connection lost, trying to reconnect (" + count + ")");
    }
};

const User = UserModel(sequelize, Sequelize);

module.exports = {
    sequelize,
    User
};