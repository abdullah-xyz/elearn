const express = require("express");
const {
  unitDetail,
  unitUpdateGet,
  unitUpdatePost,
  playVideo,
} = require("../controllers/unit");
const router = express.Router();

const multer = require("multer");
const upload = multer({
  dest: "public/upload/",
  fileFilter: function (req, file, cb) {
    let mime = file.mimetype;
    if (mime == "video/mp4") {
      cb(null, true);
    } else {
      req.msg = "video needs to be of 'mp4' format";
      return cb(null, false);
    }
  },
});

router.get("/unit/:id", unitDetail);
router.get("/unit/edit/:id", unitUpdateGet);
router.post("/unit/edit/:id", upload.single("video"), unitUpdatePost);
router.get("/unit/lecture/:id", playVideo);

module.exports = router;
