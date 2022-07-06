const router = require("express").Router();
const Nyap = require("../models/Nyap.model");

//////// CREATE ////////
router.post("/nyap", (req, res, next) => {
  Nyap.create(req.body)
    .then(nyap => {
      console.log('New nyap in DB!')
      res.redirect('/')
    })
    .catch(err => console.log(err))
});

//////// READ ////////
router.get("/nyap/:id", (req, res, next) => {
  Nyap.findById(req.params.id)
    .then(nyap => {
      res.json({ nyap });
    })
    .catch(err => console.log(err))
});

router.get("/nyaps", (req, res, next) => {
  const inMapValue = req.query.inMap
  Nyap.find({ inMap: inMapValue })
    .then(nyaps => {
      res.json({ nyaps });
    })
    .catch(err => console.log(err))
});

router.get("/nyaps/count", (req, res, next) => {
  Nyap.find()
    .count(function (err, count) {
      if (err) console.log(err)
      else res.send({ count: count.toString()})
    });
});

//////// UPDATE ////////
router.post("/nyap/:id", (req, res, next) => {
  Nyap.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(nyap => {
      console.log('Updated nyap in DB!')
      console.log(nyap)
      res.redirect('/')
    })
    .catch(err => console.log(err))
});

//////// DELETE ////////
router.post("/nyap/:id", (req, res, next) => {
  Nyap.findByIdAndDelete(req.params.id)
    .then(nyap => {
      console.log('Deleted nyap in DB!')
      console.log(nyap)
      res.redirect('/')
    })
    .catch(err => console.log(err))
});


module.exports = router;
