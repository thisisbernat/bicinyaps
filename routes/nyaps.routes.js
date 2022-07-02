const router = require("express").Router();
const Nyap = require("../models/Nyap.model");
const fetch = require('node-fetch-commonjs');

router.get("/", (req, res, next) => {
  Nyap.find()
    .then(nyaps => {
      res.json({ nyaps });
    })
    .catch(err => console.log(err))
});

router.get("/carrils", (req, res, next) => {
  fetch('https://opendata-ajuntament.barcelona.cat/data/dataset/e3497ea4-0bae-4093-94a7-119df50a8a74/resource/4608cf0c-2f11-4a25-891f-c5afc3af82c5/download')
    .then(res => res.json())
    .then(carrils => res.send(carrils))
    .catch(err => console.log(`Can't get the carrils from l'ajuntament`));
});

module.exports = router;
