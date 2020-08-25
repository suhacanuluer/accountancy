const express = require("express");
const validator = require("validator");
const router = express.Router();
const { Customer, User, UserBalance, Payment, Note, CustomerBalance } = require("../Database/Database");

router.get('/:id', (req, res) => {
  User.findOne({
    where: { id: req.params.id},
    attributes: [ "id", "companyInfo", "companyName", "fullName"],
    include: [
      { model: Customer , attributes: [ "id", "userID", "customerName", "customerInfo", "whichCategory", "phoneNumber" ]},
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
  const { userID, customerInfo, customerName, whichCategory, phoneNumber, taxNumber, taxAddress } = req.body;

  if ( userID != null && customerInfo != null && customerName != null && whichCategory != null && taxNumber != null && taxAddress != null && userID != null) {
    if( phoneNumber.length == 11 || phoneNumber.length == 10 ) {  
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
    } else {
      res.json({
        status: "error",
        message: "invalid phone number type"
      })
    }
  } else {
    res.json({
      status: "error",
      message: "missing parameter or parameters"
    })
  }
});

router.delete("/delete/:customerID", (req, res) => {

  Customer.destroy({
      where: {
          id : req.params.customerID
      }
  }).then(rowDeleted => {
    if(rowDeleted == 0){
      res.status(404).json({
        status: "error",
        message: "customer not found"
      });
    } else {
      CustomerBalance.destroy({
        where: {
          customerID: req.params.customerID 
        }
      }).then(rowDeleted => {
        if(rowDeleted == 0) {
          res.status(404).json({
            status: "error",
            message: "customer balance not found"
          });
        } else {
          Payment.destroy({
            where : {
                customerID : req.params.customerID
            }
          }).then(rowDeleted => {
              if(rowDeleted == 0){
                  res.status(404).json({
                      status: "error",
                      message: "payments not found"
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
        }
      }, () => {
        res.status(500).json({
          status: "error"
        });
      });
    }
  }, () => {
    res.status(500).json({
      status: "error"
    });
  });
});

module.exports = router;

