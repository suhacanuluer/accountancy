const express = require("express");
const router = express.Router();
const { User, sequelize } = require("../Database/Database");

// /* GET users listing. */
// router.get("/", function(req, res, next) {
//   res.send("respond with a resource");
// });

router.get('/', (req, res) => {
  sequelize.findAll().then((result) => {
    console.log("result", result)
    res.json(result.toJSON())
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

  User.findOne(req.body, {
    where: {
      username: username,
      password: password,
    }
  }).then((user) => {
    res.json(user.toJSON());
  }, err => {
    res.send("Kullanıcı adı veya şifre yanlış!!")
  })
})

module.exports = router;

