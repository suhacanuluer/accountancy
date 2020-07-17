const express = require("express");
const router = express.Router();
const { Payment, CustomerBalance, sequelize } = require("../Database/Database");

//TAMAMEN GÖZDEN GEÇİRİLECEK ÖDEMELER BALANCE MODELLERİNE AKTARILACAK
router.post("/add", (req, res) => {
    const { customerID, cost, infoKDV, inOrOut, date } = req.body;
    
    Payment.create(req.body).then( payments => {

//aşağıdaki findone ı createnin içine alıp tüm çıktıları aynı res içinde döndürmen lazım 
        res.json(payments.toJSON());
    }, (e) => {
        res.status(500).send({ status: "error"})
    })

    let balance = { customerID: customerID};    
    if(inOrOut == true) {
        if(infoKDV == true) {
            balance.inMoneyVAT = cost;
            balance.amountVAT = ( cost / 100 * 18 );
            balance.inMoney = 0;
            balance.outMoney = 0;
        }
    }

    CustomerBalance.findOne({
        where: {
            customerID: customerID
        }
    }).then(data => {
        if(data == null){
            balance.totalMoney = balance.inMoneyVAT + balance.inMoney + balance.outMoney;
            CustomerBalance.create(balance).then(balances => {
                console.log("balance", balance)
                console.log("balances", balances)
                res.json({  // <<< mesela bu resi yukarı alman lazm 
                    status: "success",
                    data: balances
                });
            }, (e) => {
                // res.status(500).send({ status: "error"})
            })
        } else {
            console.log("data var")
        }    
    })
    
    

    
})

module.exports = router;

