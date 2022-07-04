const router = require("express").Router();
const fetch = require('node-fetch-commonjs');

const Nyap = require("../models/Nyap.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/carrilsbcn", (req, res, next) => {
  fetch('https://opendata-ajuntament.barcelona.cat/data/dataset/e3497ea4-0bae-4093-94a7-119df50a8a74/resource/4608cf0c-2f11-4a25-891f-c5afc3af82c5/download')
    .then(res => res.json())
    .then(carrils => res.send(carrils))
    .catch(err => console.log(`Can't get the carrils from l'ajuntament`));
});

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

router.get("/cloud", (req, res, next) => {
  res.render('cloud');
});

router.post('/image/post', fileUploader.single('nyap-image'), (req, res) => {
  res.send(req.file.path)
});

router.post("/image/postRAW", fileUploader.single('file'),(req, res, next) => {
  console.log('success!')
  console.log(req.file.path)
});

module.exports = router;
