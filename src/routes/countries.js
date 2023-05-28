const { listCountries } = require("../controllers/countries");

const router = require("express").Router();

router.get("/countries", listCountries);

module.exports = router;
