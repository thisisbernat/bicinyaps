const router = require("express").Router();
const Nyap = require("../models/Nyap.model");


router.get("/", (req, res, next) => {
  Nyap.find({ inMap: true })
    .then(nyaps => {
      res.json({ nyaps });
    })
    .catch(err => console.log(err))
});

router.get("/disabled", (req, res, next) => {
  Nyap.find({ inMap: false })
    .then(nyaps => {
      res.json({ nyaps });
    })
    .catch(err => console.log(err))
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  Nyap.create(req.body)
    .then(nyap => {
      console.log('new nyap created');
      res.redirect('/');
    })
    .catch(err => console.log(err))
  
});



module.exports = router;
