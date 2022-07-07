const router = require("express").Router();
const Nyap = require("../models/Nyap.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

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

router.get("/nyaps.json", (req, res, next) => {
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

router.get("/nyap/:id/votes", (req, res, next) => {
  Nyap.findById(req.params.id)
    .then(nyap => {
      res.json({ id: nyap.id, votes: nyap.votes });
    })
    .catch(err => console.log(err))
});

router.get('/admin', isLoggedIn, (req, res) => {
  res.redirect('/admin/proposats')  
});

router.get('/admin/proposats', isLoggedIn, (req, res) => {
  const inMap = false
  Nyap.find({ inMap })
    .then(nyaps => {
      res.render('admin', { userInSession: req.session.currentUser, nyaps: nyaps, inMap });
    })
    .catch(err => console.log(err))  
});

router.get('/admin/publicats', isLoggedIn, (req, res) => {
  const inMap = true
  Nyap.find({ inMap })
    .then(nyaps => {
      res.render('admin', { userInSession: req.session.currentUser, nyaps: nyaps, inMap });
    })
    .catch(err => console.log(err))  
});

//////// UPDATE ////////
router.post("/nyap/update/:id", (req, res, next) => {
  Nyap.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(nyap => {
      console.log('Updated nyap in DB!')
      console.log(nyap)
      res.redirect('/admin')
    })
    .catch(err => console.log(err))
});

//////// DELETE ////////
router.post("/nyap/delete/:id", (req, res, next) => {
  Nyap.findByIdAndDelete(req.params.id)
    .then(nyap => {
      console.log('Deleted nyap in DB!')
      console.log(nyap)
      res.redirect('/admin')
    })
    .catch(err => console.log(err))
});

module.exports = router;
