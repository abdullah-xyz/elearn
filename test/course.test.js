const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const { app } = require("../src");

let session;
describe("Course:", () => {
  let course;

  // login as a teacher
  before((done) => {
    request(app)
      .post("/login")
      .send({ email: "kushal@mail.com", password: "secret" })
      .end((err, res) => {
        console.log("body:::::::", res.text);
        if (err) throw err;
        session = res.headers["set-cookie"][0];
        done();
      });
  });
});

after((done) => {
  app.close();
  done();
});

describe("Create course", () => {
  it("Successfully create course request", (done) => {
    request(app)
      .post("/course/create")
      .set("Cookie", session)
      .send({
        title: "integration test",
        code: 123,
        credit: "3",
        level: "UG",
        duration: "7",
        rFees: "1333",
      })
      .end((err, res) => {
        if (err) throw err;
        expect(res.status).to.eq(302);
        expect(res.text).to.contain("Redirecting to /");
        done();
      });
  });

  it("Don't fill all the fields", (done) => {
    request(app);
    request(app)
      .post("/course/create")
      .set("Cookie", session)
      .send({
        title: "integration test",
        code: 123,
        credit: "3",
        duration: "7",
        rFees: "1333",
      })
      .end((err, res) => {
        if (err) throw err;
        expect(res.status).to.eq(400);
        expect(res.text).to.contain("must fill all the fields");
        done();
      });
  });

  describe("List all courses", () => {
    it("should display all courses", (done) => {
      request(app)
        .get("/")
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(200);
          expect(res.text).to.contain("integration test");
          done();
        });
    });
  });

  describe("Display course", () => {
    it("Display 404", (done) => {
      request(app)
        .get("/course/13412")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(404);
          done();
        });
    });

    it("Display created course", (done) => {
      request(app)
        .get(`/course/${course}`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(200);
          expect(res.text).to.contain("integration test");
          done();
        });
    });
  });

  describe("Update course", () => {
    it("successfully update course", (done) => {
      request(app)
        .get(`/course/update/${course}`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/course/update/${course}`)
            .set("Cookie", `${session};${cookie}`)
            .set("x-csrf-token", csrf)
            .send({
              _csrf: csrf,
              title: "updated integration test",
              price: 123,
              description: "",
            })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(302);
              expect(res.text).to.contain(`Redirecting to /course/${course}`);
              done();
            });
        });
    });

    it("return 404", (done) => {
      request(app)
        .get("/course/update/12341")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(404);
          done();
        });
    });
  });

  describe("Delete course", () => {
    it("successfully delete course", (done) => {
      request(app)
        .get(`/course/delete/${course}`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/course/delete/${course}`)
            .set("Cookie", `${session};${cookie}`)
            .send({
              _csrf: csrf,
            })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(302);
              expect(res.headers.location).to.eq("/");
              done();
            });
        });
    });

    it("return 404", (done) => {
      request(app)
        .get("/course/delete/12341")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(404);
          done();
        });
    });
  });
});
