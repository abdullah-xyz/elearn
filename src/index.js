// express middleware
const express = require("express");
const app = express();

const path = require("path");

// sessions
const session = require("express-session");
// to handle cookies
const cookieParser = require("cookie-parser");

// to access enviroment variable
require("dotenv").config();

// handle forms
app.use(express.urlencoded({ extended: false }));
app.use(
  express.json({
    limit: "5mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// sessions
const sessionOptions = require("./utils/session")(session);
app.use(session(sessionOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));
// set static location
app.use("/public", express.static(path.join(__dirname, "../public")));
// templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(require("./middleware/user"));

app.use(require("./middleware/user"));

app.use("/", require("./routes/webhook"));
app.use("/", require("./routes/users"));
app.use("/", require("./routes/countries"));
app.use("/", require("./routes/courses"));
app.use(
  "/admin",
  require("./middleware/auth"),
  require("./middleware/checkAdmin"),
  require("./routes/admin")
);
app.use("/", require("./middleware/auth"), require("./routes/unit"));
app.use("/", require("./middleware/auth"), require("./routes/profile"));
app.use("/", require("./middleware/auth"), require("./routes/payment"));
app.use((req, res) => {
  res.status(404).render("404");
});

const server = app.listen(process.env.PORT);

module.exports = { server, app };
