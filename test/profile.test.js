const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../src");
const path = require("path");

const regex = new RegExp('name="_csrf" value="[a-zA-Z0-9]*"');
let csrf;
let session;
let cookie;

describe("Profile:", () => {
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

  describe("Display purchase history", () => {
    it("Should get a 200", (done) => {
      request(app)
        .get("/profile/history")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(200);
          expect(res.text).to.contain("Purchase History");
          done();
        });
    });
  });

  describe("Display sales history", () => {
    it("Should get a 200", (done) => {
      request(app)
        .get("/profile/sale")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(200);
          expect(res.text).to.contain("Sales History");
          done();
        });
    });
  });
});
