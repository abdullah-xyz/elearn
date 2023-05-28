const express = require("express");
const router = express.Router();
const {
  courseList,
  getCreate,
  postCreate,
  courseDetail,
  getUpdate,
  postUpdate,
  coursePublish,
} = require("../controllers/courses");

const auth = require("../middleware/auth");

router.get("/", courseList);
router.get("/course", auth, getCreate);
router.post("/course", auth, postCreate);
router.get("/course/:id", courseDetail);
router.post("/course/publish", auth, coursePublish);

module.exports = router;
