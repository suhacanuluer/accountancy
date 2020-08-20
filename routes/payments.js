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
    }).then(paymentResult => paymentResult.toJSON()).then(paymentResult => {
        let willDeleteBalance = {};
        if( paymentResult != null ) {
            if(paymentResult.inOrOut == true) {
                if(paymentResult.infoKDV == true) {
                    willDeleteBalance.inMoneyVAT = paymentResult.cost;
                    willDeleteBalance.amountVAT = ( paymentResult.cost / 100 * 18 );
                    willDeleteBalance.inMoney = 0;
                    willDeleteBalance.outMoney = 0;
                } else {
                    willDeleteBalance.inMoneyVAT = 0;
                    willDeleteBalance.amountVAT = 0;
                    willDeleteBalance.inMoney = paymentResult.cost;
                    willDeleteBalance.outMoney = 0;
                }
            } else {
                willDeleteBalance.inMoneyVAT = 0;
                willDeleteBalance.amountVAT = 0;
                willDeleteBalance.inMoney = 0;
                willDeleteBalance.outMoney = paymentResult.cost;
            }
            willDeleteBalance.totalMoney = ( willDeleteBalance.inMoneyVAT + willDeleteBalance.inMoney - willDeleteBalance.outMoney );

            UserBalance.findOne({
                where: {
                    userID: req.params.userID
                }
            }).then(userResult => {
                if( userResult != null ) {
                    let userAttributes = {};
                    userAttributes = userResult.dataValues
                    userAttributes.inMoneyVAT -= willDeleteBalance.inMoneyVAT;
                    userAttributes.amountVAT -= willDeleteBalance.amountVAT;
                    userAttributes.inMoney -= willDeleteBalance.inMoney;
                    userAttributes.outMoney -= willDeleteBalance.outMoney;
                    userAttributes.totalMoney -= willDeleteBalance.totalMoney;

                    CustomerBalance.findOne({
                        where: {
                            customerID: paymentResult.customerID
                        }
                    }).then(customerResult => {
                        if( customerResult != null) {
                            let customerAttributes = {};
                            customerAttributes = customerResult.dataValues
                            customerAttributes.inMoneyVAT -= willDeleteBalance.inMoneyVAT;
                            customerAttributes.amountVAT -= willDeleteBalance.amountVAT;
                            customerAttributes.inMoney -= willDeleteBalance.inMoney;
                            customerAttributes.outMoney -= willDeleteBalance.outMoney;
                            customerAttributes.totalMoney -= willDeleteBalance.totalMoney;

                            Payment.destroy({
                                where: {
                                    id: req.params.paymentID
                                }
                            }).then((rowDeleted) => {
                                if(rowDeleted == 1) {
                                    let upToDateBalances = {};
                                    UserBalance.findOne({
                                        where: {
                                            userID: req.params.userID
                                        }
                                    }).then((result) => {
                                        result.update(userAttributes).then((user) => {
                                            upToDateBalances.upToDateUserBalance = user.toJSON();
                                        });
                                    });
                                    CustomerBalance.findOne({
                                        where: {
                                            customerID: paymentResult.customerID
                                        }
                                    }).then((result) => {
                                        result.update(customerAttributes).then((customer) => {
                                            upToDateBalances.upToDateCustomerBalance = customer.toJSON();
                                            res.json({
                                                status: "success",
                                                data: upToDateBalances
                                            });
                                        });
                                    });
                                } else {
                                    res.json({
                                        status: "error",
                                        message: "payment cannot delete"
                                    });
                                }
                            })
                        } else {
                            res.status(404).json({
                                status: "error",
                                message: "customerBalance not found"
                            });
                        }
                    });  
                } else {
                    res.status(404).json({
                        status: "error",
                        message: "userBalance not found"
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