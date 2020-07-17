const express = require("express");
const router = express.Router();
const { Customer, User, UserBalance, sequelize } = require("../Database/Database");

router.get('/:id', (req, res) => {
  User.findOne({
    where: { id: req.params.id},
    attributes: [ "id", "companyInfo", "companyName", "fullName"],
    include: [
      { model: Customer , attributes: [ "id", "userID", "customerName", "customerInfo", "phoneNumber"]},
      { model: UserBalance }],
  }).then(customer => {
    res.json({
      status: "success",
      data: customer
    });    
  });
});

// MÜŞTERİ DETAYLARI EKSİK (TABLO İLİŞKİLERİ YAPILACAK)
// router.get("/:userID/details/:customerID", (req, res) => {
//   Customer.findOne( {
//     where: {
//       userID: req.params.userID,
//       id : req.params.customerID
//     }
//   }).then(customer => {
//     if(customer) {
//       res.send({
//         status: "müşteri bulundu. Detaylar gösteriliyor.",
//         customer: customer
//       })
//     } else {
//       res.status(404).send({ status: "error", description: "Müşteri bulunamadı!!"})
//     }
//   })
// })

router.post("/add", (req, res) => {
  const { userID, costumerInfo, costumerName, phoneNumber, taxNumber, taxAdress } = req.body;

  Customer.create(req.body).then((customer) => {
    res.json(customer.toJSON());
  }, (e) => {
    res.status(500).send({ status: "error" })
  });
});

router.delete("/delete/:customerID", (req, res) => {

  Customer.destroy({
      where : {
          id : req.params.customerID
      }
  }).then((rowDeleted) => {
      if(rowDeleted === 0){
          res.status(404).send();
      } else {
          res.status(204).send();
      }
  }, () => {
      res.status(500).send();
  });
});

module.exports = router;

