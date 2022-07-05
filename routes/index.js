const router = require("express").Router();
const Nyap = require("../models/Nyap.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

router.post("/image/post", fileUploader.single('file'),(req, res, next) => {
  res.statusMessage = req.file.path;
  res.sendStatus(200)  
});

module.exports = router;
