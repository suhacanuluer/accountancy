const express = require("express");
const router = express.Router();
const { Note } = require("../Database/Database");

router.post("/add", (req, res) => {
    const { customerID, notes, date } = req.body;
    
    if ( date != null && notes != null && customerID != null ) {
        Note.create(req.body).then(note => {
            res.json({
                status: "success",
                data: note
            });
        }, (e) => {
            res.status(500).json({ 
                status: "error"
            });
        });
    } else {
        res.json({
            status: "error",
            message: "missing parameter or parameters"
        });
    }
});

router.delete("/delete/:noteID", (req, res) => {

    Note.destroy({
        where : {
            id : req.params.noteID
        }
    }).then(rowDeleted => {
        if(rowDeleted == 0){
            res.status(404).json({
                status: "error",
                message: "note not found"
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