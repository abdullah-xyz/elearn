const stripe = require("stripe")(process.env.STRIPE_PRI);

module.exports = stripe;
