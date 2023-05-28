const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../src");
const path = require("path");

const regex = new RegExp('name="_csrf" value="[a-zA-Z0-9]*"');
let csrf;
let session;
let cookie;

describe("Lessons:", () => {
  const course = 93;
  let lesson;

  // login as a user
  before((done) => {
    request(app)
      .get("/login")
      .end((err, res) => {
        if (err) throw err;
        csrf = res.text.match(regex)[0].split('"')[3];
        cookie = res.headers["set-cookie"][0];
        request(app)
          .post("/login")
          .set("Cookie", cookie)
          .send({ _csrf: csrf, email: "test@mail.com", password: "sec" })
          .end((err, res) => {
            if (err) throw err;
            session = res.headers["set-cookie"][1];
            done();
          });
      });
  });

  after((done) => {
    app.close();
    done();
  });

  describe("Create Text Lesson", () => {
    it("Should get 404", (done) => {
      request(app)
        .get("/course/1240/textlesson")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(404);
          done();
        });
    });

    it("Don't fill all fields", (done) => {
      request(app)
        .get(`/course/${course}/textlesson`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/course/${course}/textlesson`)
            .set("Cookie", `${session};${cookie}`)
            .send({
              _csrf: csrf,
              title: "Test Text Lesson",
            })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(400);
              expect(res.text).to.contain("All fields must be filled");
              done();
            });
        });
    });

    it("Successfully create a text lesson", (done) => {
      request(app)
        .get(`/course/${course}/textlesson`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/course/${course}/textlesson`)
            .set("Cookie", `${session};${cookie}`)
            .send({
              _csrf: csrf,
              title: "Test Text Lesson",
              content: "Lesson to perform integration test",
            })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(302);
              expect(res.headers.location).to.contain("/lesson/textlesson");
              lesson = res.text.split("/")[3];
              done();
            });
        });
    });
  });

  describe("View created text lesson", () => {
    it("Display 404", (done) => {
      request(app)
        .get("/lesson/textlesson/13412")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(404);
          done();
        });
    });

    it("Display lesson", (done) => {
      request(app)
        .get(`/lesson/textlesson/${lesson}`)
        .set("Cookie", session)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.text).to.contain("Test Text Lesson");
          done();
        });
    });
  });

  describe("Delete lesson", () => {
    it("Display 404", (done) => {
      request(app)
        .get("/lesson/delete/14213")
        .set("Cookie", session)
        .end((err, res) => {
          expect(res.status).to.eq(404);
          done();
        });
    });

    it("Delete the created lesson", (done) => {
      request(app)
        .get(`/lesson/delete/${lesson}`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          expect(res.status).to.eq(200);
          request(app)
            .post(`/lesson/delete/${lesson}`)
            .set("Cookie", `${session}; ${cookie}`)
            .send({ _csrf: csrf })
            .end((err, res) => {
              expect(res.status).to.eq(302);
              expect(res.headers.location).to.eq(`/course/${course}`);
              done();
            });
        });
    });
  });

  describe("Create video lesson", () => {
    it("Should get 404", (done) => {
      request(app)
        .get("/course/1240/videolesson")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(404);
          done();
        });
    });

    it("Don't fill all fields", (done) => {
      request(app)
        .get(`/course/${course}/videolesson`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/course/${course}/videolesson`)
            .set("Cookie", `${session};${cookie}`)
            .send({
              _csrf: csrf,
              title: "Test Text Lesson",
            })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(400);
              expect(res.text).to.contain("All fields must be filled");
              done();
            });
        });
    });

    it("Successfully create a video lesson", (done) => {
      request(app)
        .get(`/course/${course}/videolesson`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/course/${course}/videolesson`)
            .set("Cookie", `${session};${cookie}`)
            .set("x-csrf-token", csrf)
            .field("Content-Type", "multipart/form-data")
            .field("_csrf", csrf)
            .field("title", "Test Video Lesson")
            .attach("video", path.resolve(__dirname, "../public/test/out.mp4"))
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(302);
              expect(res.headers.location).to.contain("/lesson/videolesson");
              lesson = res.text.split("/")[3];
              done();
            });
        });
    });
  });

  describe("Display video lesson", () => {
    it("Display 404", (done) => {
      request(app)
        .get("/lesson/videolesson/12341")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(404);
          done();
        });
    });

    it("Display video lesson", (done) => {
      request(app)
        .get(`/lesson/videolesson/${lesson}`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(200);
          expect(res.text).to.contain("Test Video Lesson");
          done();
        });
    });
  });
});
