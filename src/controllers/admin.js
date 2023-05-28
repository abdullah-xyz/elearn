const {
  getAllRegistrationRequest,
  getRegistrationById,
  createTeacherAccount,
  getAllUsers,
  getUser,
  getAllUnApprovedCourse,
  approveCourse,
} = require("../service/admin");
const luxon = require("luxon");
const { getCourse, getAllCourse } = require("../service/courses");

// @desc show registration request
// @route GET /admin
// @access private
const adminRegister = async (req, res) => {
  const requests = await getAllRegistrationRequest();

  res.render("admin/registerRequest", {
    title: " | Admin",
    requests,
  });
};

// @desc show detail of a registration request
// @route GET /admin/register/:id
// @access private
const adminRegisterReviewGet = async (req, res) => {
  const { id } = req.params;

  const request = await getRegistrationById(id);

  if (!request) {
    res.status(404);
    res.render("404");
    return;
  }

  res.render("admin/registerReview", {
    title: " | Review Teacher Registeration",
    error: "",
    request,
  });
};

// @desc show registration request
// @route POST /admin
// @access private
const adminRegisterReviewPost = async (req, res) => {
  const id = req.params.id;
  try {
    const request = await getRegistrationById(id);

    if (!request) {
      res.status(404);
      res.render("404");
      return;
    }

    const { accepted, notes } = req.body;

    if (!accepted || !notes) {
      res.status(400);
      res.render("admin/registerReview", {
        title: " | Review Teacher Registeration",
        error: "please fill all the required fields",
        request,
      });
      return;
    }

    await createTeacherAccount(request, accepted, notes);

    res.redirect("/admin");
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
    return;
  }
};

// @desc show list of users
// @route GET /admin/users
// @access private
const showUserList = async (req, res) => {
  try {
    const { students, teachers } = await getAllUsers();

    res.render("admin/userList", {
      title: " | Admin Users",
      students,
      teachers,
    });
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
    return;
  }
};

// @desc show User's detail
// @route GET /admin/users/:id
// @access private
const userDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const { profile, courses } = await getUser(id);

    let age;
    if (profile.type == "student") {
      const dob = luxon.DateTime.fromSQL(profile.dob);
      const dateNow = luxon.DateTime.now();
      age = dateNow.diff(dob, ["year"]).toHuman().split(".")[0];
    }

    res.render("admin/userDetail", {
      title: " | Admin User",
      user: profile,
      courses,
      age,
    });
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
    return;
  }
};

// @desc show list of course approval request
// @route GET /admin/course-requests
// @access private
const courseRequests = async (req, res) => {
  try {
    const courses = await getAllUnApprovedCourse();
    res.render("admin/courseRequests", {
      title: " | Review Courses",
      courses,
    });
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
    return;
  }
};

// @desc show course approval request
// @route GET /admin/course-requests/:id
// @access private
const courseRequestReviewGet = async (req, res) => {
  try {
    const id = req.params.id;

    const { course } = await getCourse(id);
    const instructor = await getUser(course.instructor);

    res.render("admin/courseReview", {
      title: " | Review Course",
      error: "",
      course,
      instructor,
    });
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
    return;
  }
};

// @desc show course approval request
// @route POST /admin/course-requests/:id
// @access private
const courseRequestReviewPost = async (req, res) => {
  try {
    const id = req.params.id;
    const { accepted, notes } = req.body;

    await approveCourse(id, accepted, notes);

    res.redirect("/admin/course-requests");
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
    return;
  }
};

// @desc show list of Courses
// @route GET /admin/users
// @access private
const listCourse = async (req, res) => {
  try {
    const courses = await getAllCourse();

    res.render("admin/courseList", {
      title: " | List Course",
      courses,
    });
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
    return;
  }
};

// @desc show Course Detail
// @route GET /admin/users
// @access private
const courseDetail = async (req, res) => {
  const id = req.params.id;
  const course = await getCourse(id);

  res.render("admin/courseDetail", {
    title: " | Course Detail",
    course,
  });
};

const registerAdmin = async (req, res) => {
  res.render("admin/register", {
    title: " | Register Admin",
    name: "",
    email: "",
    id: "",
    error: "",
  });
};

module.exports = {
  adminRegister,
  adminRegisterReviewGet,
  adminRegisterReviewPost,
  showUserList,
  userDetail,
  courseRequests,
  courseRequestReviewGet,
  courseRequestReviewPost,
  listCourse,
  courseDetail,
  registerAdmin,
};
