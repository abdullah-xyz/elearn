const { name } = require("ejs");
const {
  TeacherProfile,
  StudentProfile,
  AdminProfile,
  User,
  Contact,
} = require("../models/User");
const { uid } = require("uid");

async function getProfile(user) {
  let profile;
  if (user.type == "teacher") {
    profile = await TeacherProfile.findByPk(user.id);
  } else if (user.type == "student") {
    profile = await StudentProfile.findByPk(user.id);
  } else if (user.type == "admin") {
    profile = await AdminProfile.findByPk(user.id);
  }
  return profile;
}

async function getContacts(user) {
  return await Contact.findAll({
    where: {
      user: user.id,
    },
  });
}

async function updateProfile(user, body) {
  if (user.type == "student") {
    const {
      name,
      fatherName,
      dob,
      institute,
      house,
      street,
      country,
      state,
      city,
      pincode,
      phone,
    } = body;

    const profile = await User.findByPk(user.id);
    const profileDetail = await StudentProfile.findByPk(user.id);

    profile.name = name;
    await profile.save();

    profileDetail.fatherName = fatherName;
    profileDetail.dob = dob;
    profileDetail.institute = institute;
    profileDetail.house = house;
    profileDetail.street = street;
    profileDetail.country = country;
    profileDetail.state = state;
    profileDetail.city = city;
    profileDetail.pincode = pincode;
    profileDetail.phone = phone;
    await profileDetail.save();
  } else if (user.type == "teacher") {
    const {
      name,
      designation,
      qualification,
      institute,
      department,
      country,
      state,
      city,
      pincode,
      phone,
      profile,
    } = body;

    const userProfile = await User.findByPk(user.id);
    const userProfileDetail = await TeacherProfile.findByPk(user.id);

    userProfile.name = name;
    await userProfile.save();

    userProfileDetail.designation = designation;
    userProfileDetail.qualification = qualification;
    userProfileDetail.institute = institute;
    userProfileDetail.department = department;
    userProfileDetail.country = country;
    userProfileDetail.state = state;
    userProfileDetail.city = city;
    userProfileDetail.pincode = pincode;
    userProfileDetail.phone = phone;
    userProfileDetail.profile = profile;
    await userProfileDetail.save();

    Object.keys(body)
      .filter((keys) => keys.includes("type"))
      .map(async (key) => {
        let number = key.split("-")[1];
        let fieldName = `value-${number}`;
        let label = body[key];
        let contact = body[fieldName];
        await Contact.create({
          id: uid(11),
          user: user.id,
          label,
          contact,
        });
      });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getContacts,
};
