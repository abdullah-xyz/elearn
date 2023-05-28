const { payCourse } = require("../service/courses");
const { createOrder } = require("../service/order");
const stripe = require("../utils/stripe");
const router = require("express").Router();

router.post("/webhook", async (req, res) => {
  const payload = req.rawBody;
  const sig = req.headers["stripe-signature"];
  const endpointSecret =
    "whsec_ac51ddc5e3c674a8ce50063d66746905d05fe5be83f0ebdf79d21fe5f7be2e3e";

  let event, checkout, charge;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      // record successful checkout
      checkout = event.data.object;
      if (checkout.metadata.type == "Registration") {
        createOrder(
          checkout.metadata.course_id,
          checkout.metadata.user_id,
          checkout.metadata.certification,
          checkout.metadata.order
        );
      } else {
        payCourse(checkout.metadata.course_id);
      }
    }

    res.end();
  } catch (e) {
    console.error(e.message);
    return res.status(400).end();
  }
});

module.exports = router;
