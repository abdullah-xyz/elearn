const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../src");
const path = require("path");

const regex = new RegExp('name="_csrf" value="[a-zA-Z0-9]*"');
let csrf;
let session;
let cookie;

describe("Payment:", () => {
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

  describe("Stripe KYC", () => {
    it("Should get a 302", (done) => {
      request(app)
        .get("/join")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(302);
          done();
        });
    });
  });

  describe("Checkout", () => {
    it("should create a checkout link and redirect", (done) => {
      request(app)
        .get("/cart")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/checkout`)
            .set("Cookie", `${session};${cookie}`)
            .send({ _csrf: csrf })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(302);
              done();
            });
        });
    });
  });
});
