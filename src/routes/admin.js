const {
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
} = require("../controllers/admin");

const router = require("express").Router();

router.get("/", adminRegister);
router.get("/register/:id", adminRegisterReviewGet);
router.post("/register/:id", adminRegisterReviewPost);
router.get("/courses-requests", courseRequests);
router.get("/course-requests/:id", courseRequestReviewGet);
router.post("/course-requests/:id", courseRequestReviewPost);
router.get("/courses", listCourse);
router.get("/course/:id", courseDetail);
router.get("/users", showUserList);
router.get("/user/:id", userDetail);
router.get("/register", registerAdmin);

module.exports = router;
