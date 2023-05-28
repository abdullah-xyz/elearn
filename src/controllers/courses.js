const { Course } = require("../models/Course");
const { Order } = require("../models/Order");
const {
  createCourseRequest,
  getAllCourse,
  getCourse,
} = require("../service/courses");
const luxon = require("luxon");

// @desc list all courses
// @route GET /
// @access public
const courseList = async (req, res) => {
  try {
    const courses = await getAllCourse();

    res.render("course/list", {
      title: "",
      courses,
    });
  } catch (e) {
    console.error(e);
    res.status(500);
    res.render("500");
  }
};

// @desc form to create new course
// @route GET /course/create
// @access private
const getCreate = (req, res) => {
  res.render("course/create", {
    title: " | Create Course",
    error: "",
    name: "",
    code: "",
    credit: "",
    level: "",
    duration: "",
    rfees: "",
    certification: "",
    cfees: "",
    description: "",
  });
};

// @desc create new course
// @route POST /course/create
// @access private
const postCreate = async (req, res) => {
  try {
    // get form body
    const { name, code, credit, level, duration, rFees, description } =
      req.body;

    // get user from session
    const user = req.session.user;

    // seperate syllabus structure from formData
    let structure = {};
    Object.keys(req.body)
      .filter((key) => key.startsWith("block"))
      .map((key) => (structure[key] = req.body[key]));

    // make sure user enter all fields
    if (!name || !code || !credit || !level || !duration || !rFees) {
      res.status(400);
      res.render("course/create", {
        title: " | Create Course",
        error: "must fill all the fields",
        name,
        code,
        credit,
        level,
        duration,
        rFees,
        certification,
        cFees,
        description,
      });
      return;
    }

    // set certification value
    let { certification, cFees } = req.body;
    certification == "on" ? (certification = true) : (certification = false);

    await createCourseRequest(
      name,
      code,
      credit,
      duration,
      level,
      rFees,
      certification,
      cFees,
      description,
      structure,
      user
    );

    res.redirect("/");
  } catch (e) {
    console.error(e);
    res.status(500);
    res.render("500");
  }
};

// @desc display course and containing lessons
// @route GET /course/:id
// @access private
const courseDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.session.user;
    let needsToBuy = false;
    let instructor = false;
    let certificateBought = true;
    let admin = false;

    // find the course or return 404
    const { course, structure } = await getCourse(id);
    if (!course) {
      res.status(404).render("404.ejs");
      return;
    }

    if (user) {
      if (user.type == "student") {
        let order = await Order.findOne({
          where: {
            student: user.id,
            course: course.id,
          },
        });
        if (!order) {
          needsToBuy = true;
        } else if (course.certification) {
          certificateBought = order.certificate;
        }
      } else if (user.type == "teacher" && user.id == course.instructor) {
        instructor = true;
      } else if (user.type == "admin") {
        admin = true;
      }
    }

    const dateUpdated = luxon.DateTime.fromMillis(Date.parse(course.updatedAt));
    const dateNow = luxon.DateTime.now();

    let duration = dateNow
      .diff(dateUpdated, ["month", "day", "hour", "minute", "second"])
      .toHuman();

    let time = duration.split(", ");
    let final = [];
    for (item of time) {
      if (!(item.split(" ")[0] == "0")) {
        let tmp = item.split(" ")[0].split(".")[0];
        final.push(`${tmp} ${item.split(" ")[1]}`);
        break;
      }
    }
    duration = final.join(", ");

    res.render("course/detail", {
      title: ` | ${course.title}`,
      course,
      needsToBuy,
      instructor,
      admin,
      user,
      structure,
      duration,
      certificateBought,
    });
  } catch (e) {
    console.error(e);
    res.status(500);
    res.render("500");
  }
};

const coursePublish = async (req, res) => {
  const { id } = req.body;
  const course = await Course.findByPk(id);

  course.publish = !course.publish;
  await course.save();

  res.redirect(`/course/${id}`);
};

module.exports = {
  courseList,
  courseDetail,
  getCreate,
  postCreate,
  coursePublish,
};
