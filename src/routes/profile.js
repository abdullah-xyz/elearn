const express = require("express");
const {
  profileDetail,
  editProfileGet,
  editProfilePost,
  editPasswordGet,
  editPasswordPost,
} = require("../controllers/profile");
const router = express.Router();

router.get("/profile", profileDetail);
router.get("/profile/edit", editProfileGet);
router.post("/profile/edit", editProfilePost);
router.get("/profile/password", editPasswordGet);
router.post("/profile/password", editPasswordPost);

module.exports = router;
