const router = require("express").Router();
const Nyap = require("../models/Nyap.model");
const IPaddress = require("../models/IPaddress.model");

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

/* IP ADDRESSES */
router.post("/ip-address", (req, res, next) => {
  IPaddress.create({ address: req.socket.remoteAddress })
  .then(response => {
    res.sendStatus(200)
  })
  .catch(err => console.log(err))
});

router.get("/ip-address/", (req, res, next) => {
  IPaddress.find({ address: req.socket.remoteAddress })
  .then(response => {
    if(response.length > 0) {
      res.sendStatus(302)
    } else {
      res.sendStatus(200)
    }
  })
  .catch(err => console.log(err))
});

module.exports = router;
