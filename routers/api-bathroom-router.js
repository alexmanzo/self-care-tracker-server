const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const jsonParser = bodyParser.json();
const Bathroom = require("../models/bathroom-model");
mongoose.Promise = global.Promise;

router.get("/", (req, res) => {
  Bathroom.find()
    .collation({ locale: "en", strength: 2 })
    .sort({ bathroom: 1 })
    .then(bathrooms => {
      res.json(bathrooms.map(bathroom => bathroom.serialize()));
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    });
});

router.post("/", jsonParser, (req, res) => {
  if (req.body.location == "") {
    res.status(400).json({ error: "No location added" });
  }

  Bathroom.create({
    location: req.body.location,
    zip:  req.body.zip,
    address: req.body.address,
    type:  req.body.type
  })
    .then(bathroom => res.status(201).json(bathroom.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

router.put("/:id", jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  let updatedBathroom = {
    bathroom: req.body.bathroom
  };

  Bathroom.findByIdAndUpdate(
    req.params.id,
    { $set: updatedBathroom },
    { new: true }
  )
    .then(update => res.status(204).end())
    .catch(err => res.status(500).json({ message: "something went wrong" }));
});

router.delete("/:id", (req, res) => {
  Bathroom.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
});

module.exports = router;
