const express = require("express");
const router = express.Router();
const {
  registerStudentPost,
  registerStudentGet,
  logInPost,
  logInGet,
  logOutPost,
  registerTeacherGet,
  registerTeacherPost,
} = require("../controllers/users");

router.post("/register", registerStudentPost);
router.get("/register", registerStudentGet);
router.get("/register/teacher", registerTeacherGet);
router.post("/register/teacher", registerTeacherPost);
router.post("/login", logInPost);
router.get("/login", logInGet);
router.post("/logout", logOutPost);

module.exports = router;
