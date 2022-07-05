const router = require("express").Router();
const fetch = require('node-fetch-commonjs');


router.get("/", (req, res, next) => {
    res.send('carrils')
});

router.get("/barcelona", (req, res, next) => {
    fetch('https://opendata-ajuntament.barcelona.cat/resources/bcn/CarrilsBici/CARRIL_BICI.geojson')
        .then(res => res.json())
        .then(carrils => res.send(carrils))
        .catch(err => console.log(`No es poden recuperar els carrils de Barcelona`));
});

router.get("/amb", (req, res, next) => {
    fetch('https://opendata-ajuntament.barcelona.cat/resources/bcn/CarrilsBici/CARRIL_BICI_ALTRES_MUNICIPIS.geojson')
        .then(res => res.json())
        .then(carrils => res.send(carrils))
        .catch(err => console.log(`No es poden recuperar els carrils de l'AMB`));
});

router.get("/enconstruccio", (req, res, next) => {
    fetch('https://opendata-ajuntament.barcelona.cat/resources/bcn/CarrilsBici/CARRIL_BICI_CONSTRUCCIO.geojson')
        .then(res => res.json())
        .then(carrils => res.send(carrils))
        .catch(err => console.log(`No es poden recuperar els carrils de l'AMB`));
});

router.get("/corredorsbici", (req, res, next) => {
    fetch('https://opendata-ajuntament.barcelona.cat/resources/bcn/CarrilsBici/CORREDORS_BICI.geojson')
        .then(res => res.json())
        .then(carrils => res.send(carrils))
        .catch(err => console.log(`No es poden recuperar els carrils de l'AMB`));
});

module.exports = router;