const express = require("express");
const router = express.Router();
const { Payment, CustomerBalance, UserBalance } = require("../Database/Database");


router.post("/add", (req, res) => {
    const { userID, customerID, cost, infoKDV, inOrOut, date } = req.body;

// ÖDEME İŞLEMİ OLUŞTURULDU
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

// ÖDEMELER ÜZERİNDE HESAPLAMALAR YAPILIYOR
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

        function updatedUserBalance(customerBalance) {
            let userBalance = customerBalance.dataValues;
            console.log("userBalance", userBalance);
            console.log("CUSTOMERBalance", customerBalance);
            UserBalance.findOne({
                where: {
                    userID: userID
                }
            }).then(oldUserBalance => {
                if(oldUserBalance == null) {
                    payment.userID = userID;
                    UserBalance.create(payment).then(newUserBalance => {
                        console.log("newUserBalance", newUserBalance);
                    })
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
                        console.log("finalUserBalance", finalUserBalance)
                    });
                }
            });
        };


    

    


});


module.exports = router;

