const { Course } = require("../models/Course");
const { createCheckout, createCoursecheckout } = require("../service/payment");
const stripe = require("../utils/stripe");

const checkout = async (req, res) => {
  try {
    const { id, certification, bought } = req.body;
    const user = req.session.user;

    const checkout = await createCheckout(id, user, certification, bought);

    res.redirect(checkout.url);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.render("500");
  }
};

const checkoutCourse = async (req, res) => {
  try {
    const { id } = req.body;

    const checkout = await createCoursecheckout(id);

    res.redirect(checkout.url);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.render("500");
  }
};

module.exports = { checkout, checkoutCourse };
