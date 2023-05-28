const express = require("express");
const { checkout, checkoutCourse } = require("../controllers/payment");
const router = express.Router();

router.post("/checkout", checkout);
router.post("/checkoutCourse", checkoutCourse);

module.exports = router;
