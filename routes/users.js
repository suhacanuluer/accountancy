const express = require("express");
const router = express.Router();
const { User, sequelize } = require("../Database/Database");

router.get('/', (req, res) => {
  User.findAll().then((result) => {
    console.log("result", result)
    res.json(result)
  })
})

// router.post("/create" , (req, res) => {
//   const { username, password, nameSurname, companyName, companyInfo } = req.body;

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
    }
  }).then((user) => {
    if(user) {
      res.send( { status: "success", user: user.dataValues });
    } else {
      res.status(404).send({ status: "alert", description: "Kullanıcı adı veya şifre yanlış!!!"})
    }
  })
})  

module.exports = router;

