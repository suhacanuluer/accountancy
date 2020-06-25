const express = require("express");
const router = express.Router();
const { Note, sequelize } = require("../Database/Database");

router.get("/:customerID", (req, res) =>  {
    Note.findAll( {
        where: {
            customerID: req.params.customerID
        }
    }).then(notes => {
        if(notes) {
            res.send({
                status: "notlar listelendi",
                notes: notes
            })
        } else {
            res.status(404).send({ description: "notlar listelenemiyor!"})
        }
    })
})

router.post("/add", (req, res) => {
    const { customerID, notes, history } = req.body;
    
    Note.create(req.body).then((notes) => {
        res.json(notes.toJSON());
    }, (e) => {
        res.status(500).send({ status: "error"})
    })
})

router.put("/edit/:noteID", (req, res) => {
    const { customerID, notes, history } = req.body;
    
    var attributes = {};

    if(req.body.hasOwnProperty("notes")){
        attributes.notes = notes;
    }
    if(req.body.hasOwnProperty("history")){
        attributes.history = history;
    }

    Note.findOne({
        where: {
            id: req.params.noteID 
        }
    }).then(note => {
        if(note) {
            note.update(attributes).then(note => {
                res.json(note.toJSON());
            }, () => {
                res.status(400).send();
            })
        } else {
            res.status(404).send({
                error: "Değiştirmek istediğiniz not bulunamadı!!"
            })
        }
    }, () => {
        res.status(500).send();
    })
})

router.delete("/delete/:noteID", (req, res) => {

    Note.destroy({
        where : {
            id : req.params.noteID
        }
    }).then((rowDeleted) => {
        if(rowDeleted === 0){
            res.status(404).send({
                error : "Silmek istediğiniz note bulunamamıştır."
            });
        } else {
            res.status(204).send();
        }
    }, () => {
        res.status(500).send();
    })
})

module.exports = router;