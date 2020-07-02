const express = require("express");
const router = express.Router();
const { Payment, sequelize } = require("../Database/Database");

router.get("/:customerID/" , (req, res) => {
    Payment.findAll( {
        where: {
            customerID: req.params.customerID,
        }
    }).then(payments => {
        if(payments) {
            res.send({ status: "ödemeler listelendi", payments: payments })
        } else {
            res.status(404).send({ description: "ödemeler listelenemiyor!"})
        }
    })
})

router.post("/add", (req, res) => {
    const { customerID, cost, infoKDV, inOrOut, date } = req.body;

    Payment.create(req.body).then( payments => {
        res.json(payments.toJSON());
    }, (e) => {
        res.status(500).send({ status: "error"})
    })
})

module.exports = router;

