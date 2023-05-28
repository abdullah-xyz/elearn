const {
  registerStudent,
  verifyUser,
  registerTeacherRequest,
} = require("../service/user");
const { Country } = require("country-state-city");

// @desc create a new student user
// @route POST /register
// @access public
const registerStudentPost = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      dob,
      studentClass,
      institute,
      house,
      street,
      pincode,
      city,
      state,
      country,
      phone,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !fatherName ||
      !dob ||
      !studentClass ||
      !house ||
      !street ||
      !pincode ||
      !city ||
      !state ||
      !country ||
      !phone ||
      !email ||
      !password
    ) {
      res.status(400);
      res.render("user/registerStudent", {
        title: " | Register",
        countries: Country.getAllCountries(),
        name,
        fatherName,
        dob,
        studentClass,
        institute,
        house,
        street,
        pincode,
        city,
        state,
        country,
        phone,
        email,
        error: "must fill all the fields",
      });
      return;
    }

    const err = await registerStudent(
      name,
      fatherName,
      dob,
      studentClass,
      institute,
      house,
      street,
      pincode,
      city,
      state,
      country,
      phone,
      email,
      password
    );
    if (err) {
      res.status(400);
      res.render("user/registerStudent", {
        title: " | Register",
        countries: Country.getAllCountries(),
        name,
        fatherName,
        dob,
        studentClass,
        institute,
        house,
        street,
        pincode,
        city,
        state,
        country,
        phone,
        email,
        error: err,
      });
      return;
    }

    res.status(201).redirect("/login");
  } catch (e) {
    console.error(e);
    res.status(500);
    res.render("500");
  }
};

// @desc form to create a new student user
// @route GET /register
// @access public
const registerStudentGet = (req, res) => {
  res.render("user/registerStudent", {
    title: " | Register",
    countries: Country.getAllCountries(),
    name: "",
    fatherName: "",
    dob: "",
    studentClass: "",
    institute: "",
    house: "",
    street: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
    error: "",
  });
};

// @desc form to create a new teacher user
// @route GET /register/teacher
// @access public
const registerTeacherGet = (req, res) => {
  res.render("user/registerTeacher", {
    title: " | Register",
    countries: Country.getAllCountries(),
    name: "",
    qualification: "",
    designation: "",
    institute: "",
    department: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    profile: "",
    email: "",
    error: "",
  });
};

// @desc form to create a new teacher user
// @route POST /register/teacher
// @access public
const registerTeacherPost = async (req, res) => {
  const {
    name,
    qualification,
    designation,
    institute,
    department,
    pincode,
    city,
    state,
    country,
    phone,
    profile,
    email,
  } = req.body;

  if (
    !name ||
    !qualification ||
    !designation ||
    !institute ||
    !pincode ||
    !city ||
    !state ||
    !country ||
    !phone ||
    !email
  ) {
    res.status(400);
    res.render("user/registerTeacher", {
      title: " | Register",
      countries: Country.getAllCountries(),
      name,
      qualification,
      designation,
      institute,
      department,
      pincode,
      country,
      phone,
      profile,
      email,
      error: "must fill all the fields",
    });
    return;
  }

  try {
    const err = await registerTeacherRequest(
      name,
      qualification,
      designation,
      institute,
      department,
      pincode,
      city,
      state,
      country,
      phone,
      profile,
      email
    );
    if (err) {
      res.status(400);
      res.render("user/registerTeacher", {
        title: " | Register",
        countries: Country.getAllCountries(),
        name,
        qualification,
        designation,
        institute,
        department,
        pincode,
        country,
        phone,
        profile,
        email,
        error: err,
      });
      return;
    }
    res.redirect("/");
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
    return;
  }
};

// @desc login user
// @route POST /login
// @access public
const logInPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      res.render("user/login", {
        title: " | Log In",
        error: "must fill all the fields",
        email,
      });
      return;
    }

    const user = await verifyUser(email, password);
    if (user) {
      req.session.user = user;
      res.redirect("/");
      return;
    }

    res.status(401);
    res.render("user/login", {
      title: " | Log In",
      error: "email or password incorrect",
      email,
    });
  } catch (e) {
    console.error(e);
    res.status(500);
    res.render("500");
  }
};

// @desc form to login user
// @route GET /login
// @access public
const logInGet = (req, res) => {
  res.render("user/login", {
    title: " | Log In",
    error: "",
    email: "",
  });
};

// @desc logout user
// @route POST /login
// @access public
const logOutPost = (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
};

module.exports = {
  registerStudentPost,
  registerStudentGet,
  registerTeacherGet,
  registerTeacherPost,
  logInPost,
  logInGet,
  logOutPost,
};
