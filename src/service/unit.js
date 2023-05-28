const { Unit } = require("../models/Course");

async function getUnit(id) {
  return await Unit.findByPk(id);
}

async function updateUnit(unit, lecture, text) {
  if (lecture) {
    unit.lecture = lecture;
  }
  unit.text = text;
  await unit.save();
}

module.exports = { getUnit, updateUnit };
