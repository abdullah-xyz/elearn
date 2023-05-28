const { Course, Block, Unit, Topic } = require("../models/Course");
const { uid } = require("uid");
const stripe = require("../utils/stripe");

async function createCourseRequest(
  name,
  code,
  credit,
  duration,
  level,
  rfees,
  certification,
  cfees,
  description,
  structure,
  user
) {
  const stripeRFees = await stripe.prices.create({
    unit_amount: rfees * 100,
    currency: "inr",
    product_data: {
      name: `${name} Registration Fees`,
    },
  });

  let stripeCFees = { id: "" };
  if (cfees) {
    stripeCFees = await stripe.prices.create({
      unit_amount: cfees * 100,
      currency: "inr",
      product_data: {
        name: `${name} Certification Fees`,
      },
    });
  } else {
    cfees = 0;
  }

  const course = await Course.create({
    id: uid(6),
    name,
    code,
    description,
    registrationFees: rfees,
    stripeRFees: stripeRFees.id,
    certification,
    certificateFees: cfees,
    stripeCFees: stripeCFees.id,
    level,
    credit,
    duration,
    instructor: user.id,
    instructorName: user.name,
    isApproved: false,
    isReviewed: false,
    publish: false,
    isPaid: false,
  });

  let blockNumber = 1;
  for (let block in structure) {
    if (block.includes("block") && !block.includes("unit")) {
      // Create Block
      let Blocks = await Block.create({
        id: uid(11),
        name: structure[block],
        course: course.id,
        ordering: blockNumber,
      });
      blockNumber++;
      let unitNumber = 1;
      for (let unit in structure) {
        if (unit !== block && unit.includes(block) && !unit.includes("topic")) {
          // Create Unit
          let Units = await Unit.create({
            id: uid(11),
            name: structure[unit],
            block: Blocks.id,
            ordering: unitNumber,
          });
          unitNumber++;

          let topicNumber = 1;
          for (let topic in structure) {
            if (
              topic !== block &&
              topic !== unit &&
              topic.includes(unit) &&
              topic.includes("topic")
            ) {
              let Topics = await Topic.create({
                id: uid(11),
                name: structure[topic],
                unit: Units.id,
                ordering: topicNumber,
              });
              topicNumber++;
            }
          }
        }
      }
    }
  }
}

async function getCourse(id) {
  const course = await Course.findByPk(id);

  let structure = [];
  const blocks = await Block.findAll({
    where: {
      course: course.id,
    },
    order: [["ordering"]],
  });

  for (let block of blocks) {
    let blockBody = {};
    blockBody["block"] = block;

    const units = await Unit.findAll({
      where: {
        block: block.id,
      },
      order: ["ordering"],
    });

    let unitList = [];

    for (let unit of units) {
      let unitBody = {};
      unitBody["unit"] = unit;

      const topics = await Topic.findAll({
        where: {
          unit: unit.id,
        },
        order: ["ordering"],
      });

      let topicList = [];
      for (let topic of topics) {
        topicList.push(topic);
      }

      if (topicList.length != 0) {
        unitBody["children"] = topicList;
      }

      unitList.push(unitBody);
    }

    if (unitList.length != 0) {
      blockBody["children"] = unitList;
    }

    structure.push(blockBody);
  }

  return { course, structure };
}

async function getAllCourse() {
  return await Course.findAll();
}

async function payCourse(id) {
  try {
    const course = await Course.findByPk(id);
    course.isPaid = true;
    await course.save();
  } catch (err) {
    console.error(err);
  }
}

async function getBlock(id) {
  return await Block.findByPk(id);
}

module.exports = {
  createCourseRequest,
  getCourse,
  getAllCourse,
  payCourse,
  getBlock,
};
