const { Course } = require("../models/Course");
const { Order } = require("../models/Order");
const stripe = require("../utils/stripe");

async function createCheckout(id, user, certification, bought) {
  const course = await Course.findByPk(id);

  let line_items = [];
  let metadata = {
    course_id: course.id,
    user_id: user.id,
    type: "Registration",
    certification: false,
  };

  if (!bought) {
    line_items.push({ price: course.stripeRFees, quantity: 1 });
  }

  if (course.certification && certification == "yes") {
    line_items.push({ price: course.stripeCFees, quantity: 1 });
    metadata["certification"] = true;
  }

  if (bought) {
    const order = await Order.findOne({
      where: {
        student: user.id,
        course: course.id,
      },
    });
    line_items.push({ price: course.stripeCFees, quantity: 1 });
    metadata["order"] = order.id;
  }

  const checkout = stripe.checkout.sessions.create({
    success_url: process.env.HOST,
    line_items,
    mode: "payment",
    metadata,
    invoice_creation: { enabled: true },
  });

  return checkout;
}

async function createCoursecheckout(id) {
  const course = await Course.findByPk(id);

  let line_items = [
    {
      price_data: {
        currency: "INR",
        unit_amount: course.credit * 500 * 100,
        product_data: {
          name: `${course.name} Course Creation Fees`,
        },
      },
      quantity: 1,
    },
  ];

  const checkout = stripe.checkout.sessions.create({
    success_url: process.env.HOST,
    line_items,
    mode: "payment",
    metadata: {
      course_id: course.id,
      type: "course creation",
    },
    invoice_creation: { enabled: true },
  });

  return checkout;
}

module.exports = { createCheckout, createCoursecheckout };
