const { uid } = require("uid");
const argon2 = require("argon2");
const postalCodes = require("postal-codes-js");
const {
  User,
  AdminProfile,
  StudentProfile,
  TeacherProfile,
  TeacherCreationRequest,
} = require("../models/User");

async function registerStudent(
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
) {
  const user = await User.findOne({
    where: { email },
  });

  if (user) {
    return "given email is already in use, email needs to be unique";
  }

  const pk = uid(6);
  const hashedPassword = await argon2.hash(password);

  await User.create({
    id: pk,
    name,
    email,
    password: hashedPassword,
    type: "student",
  });

  await StudentProfile.create({
    id: pk,
    dob,
    fatherName,
    class: studentClass,
    house,
    street,
    pincode,
    city,
    state,
    country,
    institute,
    phone,
  });
}

async function registerTeacherRequest(
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
) {
  const user = await TeacherCreationRequest.findOne({
    where: { email },
  });
  if (user) {
    return "given email is already in use, email needs to be unique";
  }

  if (postalCodes.validate(country, pincode) !== true) {
    return "Invalid Postal code";
  }

  const pk = uid(6);

  await TeacherCreationRequest.create({
    id: pk,
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
    isActivated: false,
  });
}

async function verifyUser(email, password) {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user && (await argon2.verify(user.password, password))) {
    return user;
  }

  return null;
}

module.exports = { registerStudent, verifyUser, registerTeacherRequest };
