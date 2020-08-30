const express = require("express");
const router = express.Router();
const { User, sequelize } = require("../Database/Database");

// router.get('/', (req, res) => {
//   User.findAll().then((result) => {
//     console.log("result", result)
//     res.json(result)
//   })
// })

// router.post("/create" , (req, res) => {
//   const { username, password, fullName, companyName, companyInfo } = req.body;

//   User.create(req.body).then((user) => {
//     res.json(user.toJSON());
//   }, (e) => {
//     res.status(500).send()
//   })
// })

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne( {
    where: {
      username: username,
      password: password,
    },
    attributes: [ 
      "id", "fullName", "companyName", "companyInfo", "createdAt", "updatedAt"
    ]  
  }).then((user) => {
    if(user) {
      res.json({ status: "success", data: user });
    } else {
      res.json({ status: "error", message: "user not found" })
    }
  })
})  

module.exports = router;

