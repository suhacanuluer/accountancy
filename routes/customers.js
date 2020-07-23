const express = require("express");
const router = express.Router();
const { Customer, User, UserBalance, Payment, Note, CustomerBalance } = require("../Database/Database");

router.get('/:id', (req, res) => {
  User.findOne({
    where: { id: req.params.id},
    attributes: [ "id", "companyInfo", "companyName", "fullName"],
    include: [
      { model: Customer , attributes: [ "id", "userID", "customerName", "customerInfo", "phoneNumber" ]},
      { model: UserBalance }
    ]
  }).then(customers => {
    if(customers != null){
      res.json({
        status: "success",
        data: customers
      });
    } else {
      res.json({
        status: "error",
        message: "user not found"
      });
    }    
  });
});

router.get("/:userID/details/:customerID", (req, res) => {
  Customer.findOne( {
    where: {
      userID: req.params.userID,
      id : req.params.customerID
    },
    include: [
      { model: Payment },
      { model: Note },
      { model: CustomerBalance }
    ]
  }).then(customer => {
    if(customer) {
      res.send({
        status: "success",
        customer: customer
      })
    } else {
      res.json({ 
        status: "error", 
        message: "customer not found"})
    }
  })
})

router.post("/add", (req, res) => {
  const { userID, costumerInfo, costumerName, phoneNumber, taxNumber, taxAddress } = req.body;

  Customer.create(req.body).then((customer) => {
    res.json({
      status: "success",
      customer: customer
    });
  }, (e) => {
    res.status(500).json({ 
      status: "error" 
    });
  });
});

router.delete("/delete/:customerID", (req, res) => {

  Customer.destroy({
      where : {
          id : req.params.customerID
      }
  }).then((rowDeleted) => {
      if(rowDeleted == 0){
          res.status(404).json({
            status: "error",
            message: "customer not found"
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
});

module.exports = router;

