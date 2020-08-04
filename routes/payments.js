const express = require("express");
const router = express.Router();
const { Payment, CustomerBalance, UserBalance } = require("../Database/Database");

router.post("/add", (req, res) => {
    const { userID, customerID, cost, infoKDV, inOrOut, date } = req.body;

// creating payment transactions
    Payment.create(req.body).then(payment => {
        res.json({
            status: "success",
            data: payment
        });
    }, (e) => {
        res.status(500).json({
            status: "error"
        });
    });

// calculations for payments
    let payment = { customerID: customerID };
    if(inOrOut == true) {
        if(infoKDV == true) {
            payment.inMoneyVAT = cost;
            payment.amountVAT = ( cost / 100 * 18 );
            payment.inMoney = 0;
            payment.outMoney = 0;
        } else {
            payment.inMoneyVAT = 0;
            payment.amountVAT = 0;
            payment.inMoney = cost;
            payment.outMoney = 0;
        }
    } else {
        payment.inMoneyVAT = 0;
        payment.amountVAT = 0;
        payment.inMoney = 0;
        payment.outMoney = cost;
    }    

// creating balance transactions for Customers
    CustomerBalance.findOne({
        where: { 
            customerID: customerID
        }
    }).then(oldCustomerBalance => {
        payment.totalMoney = ( payment.inMoneyVAT + payment.inMoney - payment.outMoney );
        if(oldCustomerBalance == null) {
            CustomerBalance.create(payment).then(newCustomerBalance => {
                updatedUserBalance(newCustomerBalance);
            });
        } else {
            let currentCustomerBalance = oldCustomerBalance.dataValues;
            currentCustomerBalance.inMoneyVAT += payment.inMoneyVAT;
            currentCustomerBalance.amountVAT += payment.amountVAT;
            currentCustomerBalance.inMoney += payment.inMoney;
            currentCustomerBalance.outMoney += payment.outMoney;
            currentCustomerBalance.totalMoney += payment.totalMoney;
            currentCustomerBalance.customerID = customerID

            CustomerBalance.update(
                currentCustomerBalance,
                { where: {
                    customerID: customerID
                }} 
            ).then(finalCustomerBalance => {
                updatedUserBalance(finalCustomerBalance);
            });
        }
    });

// creating balance transactions for User
    function updatedUserBalance(customerBalance) {
        UserBalance.findOne({
            where: {
                userID: userID
            }
        }).then(oldUserBalance => {
            if(oldUserBalance == null) {
                payment.userID = userID;
                UserBalance.create(payment).then(newUserBalance => {
                    console.log("newUserBalance", newUserBalance);
                });
            } else {
                let currentUserBalance = oldUserBalance.dataValues;
                currentUserBalance.inMoneyVAT += payment.inMoneyVAT;
                currentUserBalance.amountVAT += payment.amountVAT;
                currentUserBalance.inMoney += payment.inMoney;
                currentUserBalance.outMoney += payment.outMoney;
                currentUserBalance.totalMoney += payment.totalMoney;
                currentUserBalance.userID = userID

                UserBalance.update(
                    currentUserBalance,
                    { where: {
                        userID: userID
                    }}
                ).then(finalUserBalance => {
                    console.log("finalUserBalance", finalUserBalance);
                });
            }
        });
    };
});

router.delete("/:userID/delete/:paymentID", (req, res) => {

    Payment.findOne({
        where: {
            id: req.params.paymentID
        }
    }).then(deletedPayment => {
        let willDeleteBalance = {};
        if( deletedPayment != null) {
            if(deletedPayment.inOrOut == true) {
                if(deletedPayment.infoKDV == true) {
                    willDeleteBalance.inMoneyVAT = deletedPayment.cost;
                    willDeleteBalance.amountVAT = ( deletedPayment.cost / 100 * 18 );
                    willDeleteBalance.inMoney = 0;
                    willDeleteBalance.outMoney = 0;
                } else {
                    willDeleteBalance.inMoneyVAT = 0;
                    willDeleteBalance.amountVAT = 0;
                    willDeleteBalance.inMoney = deletedPayment.cost;
                    willDeleteBalance.outMoney = 0;
                }
            } else {
                willDeleteBalance.inMoneyVAT = 0;
                willDeleteBalance.amountVAT = 0;
                willDeleteBalance.inMoney = 0;
                willDeleteBalance.outMoney = deletedPayment.cost;
            }
            willDeleteBalance.totalMoney = ( willDeleteBalance.inMoneyVAT + willDeleteBalance.inMoney - willDeleteBalance.outMoney )

            CustomerBalance.findOne({
                where: {
                    customerID: deletedPayment.customerID
                }
            }).then(oldCustomerBalance => {
                if(oldCustomerBalance != null) {
                    let updatedCustomerBalance = oldCustomerBalance;
                    updatedCustomerBalance.inMoneyVAT -= willDeleteBalance.inMoneyVAT;
                    updatedCustomerBalance.amountVAT -= willDeleteBalance.amountVAT;
                    updatedCustomerBalance.inMoney -= willDeleteBalance.inMoney;
                    updatedCustomerBalance.outMoney -= willDeleteBalance.outMoney;
                    updatedCustomerBalance.totalMoney -= willDeleteBalance.totalMoney;
                    updatedCustomerBalance.customerID = deletedPayment.customerID;

                    CustomerBalance.update(
                        updatedCustomerBalance,
                        { where: {
                            customerID: updatedCustomerBalance.customerID
                        }}
                    ).then(lastCustomerBalance => {
                        console.log("lastCustomerBalance", lastCustomerBalance);
                        UserBalance.findOne({
                            where: {
                                userID: req.params.userID 
                            }
                        }).then(oldUserBalance => {
                            if(oldUserBalance != null) {
                                let updatedUserBalance = oldUserBalance;
                                updatedUserBalance.inMoneyVAT -= willDeleteBalance.inMoneyVAT;
                                updatedUserBalance.amountVAT -= willDeleteBalance.amountVAT;
                                updatedUserBalance.inMoney -= willDeleteBalance.inMoney;
                                updatedUserBalance.outMoney -= willDeleteBalance.outMoney;
                                updatedUserBalance.totalMoney -= willDeleteBalance.totalMoney;
                                updatedUserBalance.userID = req.params.userID;

                                UserBalance.update(
                                    updatedUserBalance,
                                    { where: {
                                        userID: req.params.userID
                                    }}
                                ).then(lastUserBalance => {
                                    console.log("lastUserBalance", lastUserBalance);
                                    Payment.destroy({
                                        where: {
                                          id: req.params.paymentID 
                                        }
                                    }).then(rowDeleted => {
                                        if(rowDeleted == 0) {
                                          res.status(404).json({
                                            status: "error",
                                            message: "payment not found"
                                          });
                                        } else {
                                          res.status(204).json({
                                            status: "success"
                                          });
                                        }
                                    }, () => {
                                        res.status(500).json({
                                          status: "error"
                                        });
                                    });
                                }, () => {
                                    res.status(500).json({
                                        status: "error"
                                    });
                                });
                            } else {
                                res.status(404).json({
                                    status: "error",
                                    message: "user balance not found"
                                });
                            }
                        });
                    }, () => {
                        res.status(500).json({
                            status: "error"
                        });
                    });
                } else {
                    res.status(404).json({
                        status: "error",
                        message: "customer balance not found"
                    });
                }
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "payment not found"
            });
        }
    });
  });

module.exports = router;

