const {
  TeacherCreationRequest,
  User,
  TeacherProfile,
} = require("../models/User");
const { uid } = require("uid/secure");
const argon2 = require("argon2");
const sequelize = require("../utils/sequelize");
const transporter = require("../utils/nodemailer");
const { Course } = require("../models/Course");
const { Order } = require("../models/Order");

async function getAllRegistrationRequest() {
  return await TeacherCreationRequest.findAll();
}

async function getRegistrationById(id) {
  return await TeacherCreationRequest.findByPk(id);
}

async function createTeacherAccount(request, accepted, remark) {
  const password = uid(8);

  const hashedpassword = await argon2.hash(password);

  await User.create({
    id: request.id,
    name: request.name,
    email: request.email,
    password: hashedpassword,
    type: "teacher",
  });

  await TeacherProfile.create({
    id: request.id,
    qualification: request.qualification,
    designation: request.designation,
    institute: request.institute,
    department: request.department,
    profile: request.profile,
    coursesAllowed: 0,
    pincode: request.pincode,
    city: request.city,
    state: request.state,
    country: request.country,
    phone: request.phone,
  });

  request.isReviewed = true;
  let text;
  if (accepted == "accept") {
    request.isAccepted = true;
    text = `Dear User your account has just been verified by our reviewer, your login password for your account is: ${password}\nWe strongly suggest you to change your login password as soon as possible\nReviewer's remark:\n${remark}`;
  } else {
    text = `Dear User your account creation request has just been denied by our reviewer, we suggest you try again after following reviewer's remark\nReviewer's Remark:\n${remark}`;
  }
  await request.save();

  let mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: request.email,
    subject: "Your Account has been Approved",
    text,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log("successfully sent email");
    }
  });
}

async function getAllUsers() {
  const [students, _] = await sequelize.query(
    "SELECT * FROM `users` JOIN `studentProfiles` ON `users`.`id` = `studentProfiles`.`id` ORDER BY `users`.`updatedAt`;"
  );

  const [teachers, __] = await sequelize.query(
    "SELECT * FROM `users` JOIN `teacherProfiles` ON `users`.`id` = `teacherProfiles`.`id` ORDER BY `users`.`updatedAt`;"
  );

  return { students, teachers };
}

async function getUser(id) {
  const user = await User.findByPk(id);
  let result, _;
  let courses = [];
  let count;

  if (user.type == "teacher") {
    [result, _] = await sequelize.query(
      "SELECT * FROM `users` JOIN `teacherProfiles` ON `users`.`id` = `teacherProfiles`.`id` WHERE `users`.`id` = ?;",
      {
        replacements: [id],
      }
    );

    courses = await Course.findAll({
      where: {
        instructor: result[0].id,
      },
    });

    for (let course of courses) {
      const count = await Order.count({
        where: {
          course: course.id,
        },
      });
      course.count = count;
    }
  } else if (user.type == "student") {
    [result, _] = await sequelize.query(
      "SELECT * FROM `users` JOIN `studentProfiles` ON `users`.`id` = `studentProfiles`.`id` WHERE `users`.`id` = ?;",
      {
        replacements: [id],
      }
    );

    let orders = await Order.findAll({
      where: {
        student: result[0].id,
      },
    });

    for (let order of orders) {
      courses.push(await Course.findByPk(order.course));
    }
  } else if (user.type == "admin") {
    [result, _] = await sequelize.query(
      "SELECT * FROM `users` JOIN `adminProfiles` ON `users`.`id` = `adminProfiles`.`id` WHERE `users`.`id` = ?;",
      {
        replacements: [id],
      }
    );
  }
  let profile = result[0];
  return { profile, courses };
}

async function getAllUnApprovedCourse() {
  return await Course.findAll({ where: { isApproved: false } });
}

async function approveCourse(id, accepted, notes) {
  const course = await Course.findByPk(id);
  const user = await User.findByPk(course.instructor);

  accepted == "accept"
    ? (course.isApproved = true)
    : (course.isApproved = false);

  await course.save();

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: user.email,
    subject: "Response to course approval",
    text: `Your course ${course.name}(uid: ${course.id}) is ${
      accepted == "accept" ? "approved" : "not approved"
    }
Reviewer's Remark:
${notes}`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log("successfully sent email");
    }
  });
}

module.exports = {
  getAllRegistrationRequest,
  getRegistrationById,
  createTeacherAccount,
  getAllUsers,
  getUser,
  getAllUnApprovedCourse,
  approveCourse,
};
