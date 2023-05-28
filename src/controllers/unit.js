const { getBlock, getCourse } = require("../service/courses");
const { checkIfBought } = require("../service/order");
const { getUnit, updateUnit } = require("../service/unit");
const path = require("path");
const fs = require("fs");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const { marked } = require("marked");

const unitDetail = async (req, res) => {
  const id = req.params.id;
  const unit = await getUnit(id);
  const block = await getBlock(unit.block);
  const { course } = await getCourse(block.course);

  const etext = DOMPurify.sanitize(marked.parse(unit.text));

  const bought = await checkIfBought(block.course, req.session.user.id);
  if (
    bought ||
    req.session.user.id == course.instructor ||
    req.session.user.type == "admin"
  ) {
    res.render("unit/detail", {
      title: " | Unit",
      unit,
      etext,
      instructor: course.instructor,
    });
    return;
  }
  res.redirect(`/course/${block.course}`);
};

const unitUpdateGet = async (req, res) => {
  try {
    const id = req.params.id;
    const unit = await getUnit(id);
    const block = await getBlock(unit.block);
    const { course } = await getCourse(block.course);

    if (req.session.user.id == course.instructor) {
      res.render("unit/edit", {
        title: " | Update Unit",
        unit,
        error: "",
      });
    }

    res.redirect(`/unit/${unit.id}`);
  } catch (err) {
    res.status(500);
    res.render("500");
    console.error(err);
    return;
  }
};

const unitUpdatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const unit = await getUnit(id);
    const { etext } = req.body;
    const msg = req.msg;

    if (msg) {
      unit.text = etext;

      res.render("unit/edit", {
        title: " | Update Unit",
        unit,
        error: msg,
      });
      return;
    }

    let file;
    req.file ? (file = req.file.path) : (file = "");

    await updateUnit(unit, file, etext);

    res.redirect(`/unit/${unit.id}`);
  } catch (err) {
    res.status(500);
    res.render("500");
    console.error(err);
    return;
  }
};

// @desc stream video
// @route GET /unit/lecture/:id
// @access private
const playVideo = async (req, res) => {
  try {
    const id = req.params.id;
    const range = req.headers.range;

    // find video lesson or show 404
    const unit = await getUnit(id);
    if (!unit) {
      res.status(404).render("404");
      return;
    }
    const file = path.resolve(unit.lecture);

    const vidSize = fs.statSync(file).size;

    const chunkSize = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, vidSize - 1);

    const contentLength = end - start + 1;

    // set headers
    res.status(206);
    res.set({
      "Content-Range": `bytes ${start}-${end}/${vidSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(file, { start, end }).pipe(res);
  } catch (e) {
    console.error(e);
    res.status(500).render("500");
  }
};

module.exports = { unitDetail, unitUpdateGet, unitUpdatePost, playVideo };
