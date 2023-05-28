const { uid } = require("uid");
const { Order } = require("../models/Order");
const { Course } = require("../models/Course");

async function createOrder(course, student, certification, order) {
  try {
    if (order) {
      const porder = await Order.findByPk(order);
      porder.certificate = true;
      await porder.save();
    } else {
      let certificate;
      certification == "true" ? (certificate = true) : (certificate = false);
      await Order.create({
        id: uid(11),
        course,
        student,
        certificate,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function checkIfBought(course, student) {
  const order = await Order.findOne({
    where: {
      course,
      student,
    },
  });

  return order;
}

module.exports = { createOrder, checkIfBought };
