const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const { app } = require("../src");
const db = require("../src/utils/db");

const regex = new RegExp('name="_csrf" value="[a-zA-Z0-9]*"');
let csrf;
let session;

describe("User: ", () => {
  after((done) => {
    db.execute("DELETE FROM `users` WHERE `email` = 'a@b.com'");
    db.execute(
      "DELETE FROM `teacherCreationRequests` WHERE `email` = 'a@bc.com'"
    );
    app.close();
    done();
  });

  describe("Create User", () => {
    it("Fill register form", (done) => {
      request(app)
        .post("/register")
        .send({
          name: "a",
          fatherName: "b",
          email: "a@b.com",
          password: "bs",
          dob: "1999-06-08",
          studentClass: "BSc",
          house: "22",
          street: "Shibli",
          country: "IN",
          state: "UP",
          city: "Aligarh",
          pincode: "202002",
          phone: "123456789",
        })
        .end((err, res) => {
          expect(res.status).to.eq(302);
          expect(res.headers.location).to.eq("/login");
          done();
        });
    });

    it("Enter existing email", (done) => {
      request(app)
        .post("/register")
        .send({
          name: "a",
          fatherName: "b",
          email: "a@b.com",
          password: "bs",
          dob: "1999-06-08",
          studentClass: "BSc",
          house: "22",
          street: "Shibli",
          country: "IN",
          state: "UP",
          city: "Aligarh",
          pincode: "202002",
          phone: "123456789",
        })
        .end((err, res) => {
          expect(res.status).to.eq(400);
          expect(res.text).to.contain("given email is already in use");
          done();
        });
    });

    it("Don't fill all the fields", (done) => {
      request(app)
        .post("/register")
        .send({ _csrf: csrf, email: "a@b.com", password: "bs" })
        .end((err, res) => {
          expect(res.status).to.eq(400);
          expect(res.text).to.contain("must fill all the fields");
          done();
        });
    });
  });

  describe("Login User", () => {
    it("Enter wrong email password", (done) => {
      request(app)
        .post("/login")
        .send({ email: "a@bc.com", password: "bs" })
        .end((err, res) => {
          expect(res.status).to.eq(401);
          expect(res.text).to.contain("email or password incorrect");
          done();
        });
    });

    it("Don't enter all fields", (done) => {
      request(app)
        .post("/login")
        .send({ email: "a@b.com" })
        .end((err, res) => {
          expect(res.status).to.eq(400);
          expect(res.text).to.contain("must fill all the fields");
          done();
        });
    });

    it("Successfully login", (done) => {
      request(app)
        .post("/login")
        .send({ email: "a@b.com", password: "bs" })
        .end((err, res) => {
          session = res.headers["set-cookie"][0];
          expect(res.status).to.eq(302);
          expect(res.headers.location).to.eq("/");
          done();
        });
    });
  });

  describe("Logout User", (done) => {
    it("Successfully logout", (done) => {
      request(app)
        .post("/logout")
        .set("Cookie", session)
        .send({})
        .end((err, res) => {
          expect(res.status).to.eq(302);
          expect(res.headers.location).to.eq("/login");
          done();
        });
    });
  });

  describe("Instructor", (done) => {
    describe("Create Teacher request", () => {
      it("Fill register form", (done) => {
        request(app)
          .post("/register/teacher")
          .send({
            name: "a",
            email: "a@bc.com",
            qualification: "b",
            designation: "bs",
            institute: "IGNOU",
            department: "dept",
            country: "IN",
            state: "UP",
            city: "Aligarh",
            pincode: "202002",
            phone: "123456789",
          })
          .end((err, res) => {
            expect(res.status).to.eq(302);
            expect(res.headers.location).to.eq("/");
            done();
          });
      });

      it("Enter existing email", (done) => {
        request(app)
          .post("/register/teacher")
          .send({
            name: "a",
            email: "a@bc.com",
            qualification: "b",
            designation: "bs",
            institute: "IGNOU",
            department: "dept",
            country: "IN",
            state: "UP",
            city: "Aligarh",
            pincode: "202002",
            phone: "123456789",
          })
          .end((err, res) => {
            expect(res.status).to.eq(400);
            expect(res.text).to.contain("given email is already in use");
            done();
          });
      });

      it("Don't fill all the fields", (done) => {
        request(app)
          .post("/register/teacher")
          .send({ _csrf: csrf, email: "a@b.com", password: "bs" })
          .end((err, res) => {
            expect(res.status).to.eq(400);
            expect(res.text).to.contain("must fill all the fields");
            done();
          });
      });
    });
  });
});
