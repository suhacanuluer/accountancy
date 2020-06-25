const express = require("express");
const router = express.Router();
const { Customer, sequelize } = require("../Database/Database");

router.get('/:userID', (req, res) => {
  Customer.findAll( {
    where: {
      userID: req.params.userID,
    }
  }).then(customers => {
    if(customers) {
      if (customers.length == 0 ) {
        res.send({
          status: "Eklenmiş müşteri bulunamadı",
        })
      } else {
        res.send({
          status: "Müşteriler listeleniyor",
          customers: customers
        })
      }
    } else {
      res.status(404).send({ description: "Müşteriler listelenemiyor.!!"})
    }
  })
})

router.get("/:userID/details/:customerID", (req, res) => {
  Customer.findOne( {
    where: {
      userID: req.params.userID,
      id : req.params.customerID
    }
  }).then(customer => {
    if(customer) {
      res.send({
        status: "müşteri bulundu. Detaylar gösteriliyor.",
        customer: customer
      })
    } else {
      res.status(404).send({ status: "error", description: "Müşteri bulunamadı!!"})
    }
  })
})

router.post("/add", (req, res) => {
  const { userID, costumerInfo, costumerName, phoneNumber, taxNumber, taxAdress } = req.body;

  Customer.create(req.body).then((customer) => {
    res.json(customer.toJSON());
  }, (e) => {
    res.status(500).send({ status: "error" })
  })
})

module.exports = router;

