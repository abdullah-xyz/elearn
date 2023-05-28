const { getUser } = require("../service/admin");
const { Country, State, City } = require("country-state-city");
const luxon = require("luxon");
const { updateProfile, getContacts } = require("../service/profile");
const { User } = require("../models/User");
const argon2 = require("argon2");

const profileDetail = async (req, res) => {
  try {
    const { profile, courses } = await getUser(req.session.user.id);

    const country = Country.getCountryByCode(profile.country).name;
    const state = State.getStateByCodeAndCountry(
      profile.state,
      profile.country
    ).name;

    let age;
    if (profile.type == "student") {
      const dob = luxon.DateTime.fromSQL(profile.dob);
      const dateNow = luxon.DateTime.now();
      age = dateNow.diff(dob, ["year"]).toHuman().split(".")[0];
    }
    let contacts = [];
    if (profile.type == "teacher") {
      contacts = await getContacts(req.session.user);
    }

    res.render("profile/userDetail", {
      title: " | User Profile",
      user: profile,
      country,
      state,
      courses,
      contacts,
      age,
    });
  } catch (err) {
    res.status(500);
    res.render("500");
    console.error(err);
    return;
  }
};

const editProfileGet = async (req, res) => {
  try {
    const { profile } = await getUser(req.session.user.id);

    if (profile.type == "teacher") {
      res.render("profile/updateTeacher", {
        title: " | Edit Profile",
        user: profile,
        countries: Country.getAllCountries(),
        states: State.getStatesOfCountry(profile.country),
        cities: City.getCitiesOfState(profile.country, profile.state),
        error: "",
      });
    } else if (profile.type == "student") {
      res.render("profile/updateStudent", {
        title: " | Edit Profile",
        user: profile,
        countries: Country.getAllCountries(),
        states: State.getStatesOfCountry(profile.country),
        cities: City.getCitiesOfState(profile.country, profile.state),
      });
    }
  } catch (err) {
    res.status(500);
    res.render("500");
    console.error(err);
    return;
  }
};

const editProfilePost = async (req, res) => {
  const user = req.session.user;
  const body = req.body;
  try {
    await updateProfile(user, body);
    res.redirect("/profile");
  } catch (err) {
    res.status(500);
    res.render("500");
    console.error(err);
    return;
  }
};

const editPasswordGet = async (req, res) => {
  res.render("profile/editPassword", {
    title: " | Edit Password",
    error: "",
  });
};

const editPasswordPost = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.session.user.id);

    if (user && (await argon2.verify(user.password, oldPassword))) {
      const hashedPassword = await argon2.hash(newPassword);
      user.password = hashedPassword;
      await user.save();
    } else {
      res.render("profile/editPassword", {
        title: " | Edit Password",
        error: "Password does not match",
      });
    }

    res.redirect("/profile");
  } catch (err) {
    res.status(500);
    res.render("500");
    console.error(err);
    return;
  }
};

module.exports = {
  profileDetail,
  editProfileGet,
  editProfilePost,
  editPasswordGet,
  editPasswordPost,
};
