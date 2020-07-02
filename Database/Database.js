const Sequelize = require("sequelize");
const UserModel = require("../Models/User");
const CostumerModel = require("../Models/Customer");
const PaymentModel = require("../Models/Payment");
const NoteModel = require("../Models/Note");
const UserBalanceModel = require("../Models/UserBalance");
const CustomerBalanceModel = require("../Models/CustomerBalance");

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
const Customer = CostumerModel(sequelize, Sequelize);
const Payment = PaymentModel(sequelize, Sequelize);
const Note = NoteModel(sequelize, Sequelize);
const UserBalance = UserBalanceModel(sequelize, Sequelize);
const CustomerBalance = CustomerBalanceModel(sequelize, Sequelize);


module.exports = {
    sequelize,
    User,
    Customer,
    Payment,
    Note,
    UserBalance,
    CustomerBalance
};