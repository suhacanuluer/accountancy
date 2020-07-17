const express = require("express");
const router = express.Router();
const { Note, sequelize } = require("../Database/Database");

router.post("/add", (req, res) => {
    const { customerID, notes, date } = req.body;
    
    Note.create(req.body).then((notes) => {
        res.json(notes.toJSON());
    }, (e) => {
        res.status(500).send({ status: "error"})
    });
});

router.delete("/delete/:noteID", (req, res) => {

    Note.destroy({
        where : {
            id : req.params.noteID
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