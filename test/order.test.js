const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../src");
const path = require("path");

const regex = new RegExp('name="_csrf" value="[a-zA-Z0-9]*"');
let csrf;
let session;
let cookie;

describe("Order:", () => {
  let course = 56;
  let order;

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

  describe("Add Item to cart", () => {
    it("Display 404", (done) => {
      request(app)
        .get(`/course/${course}`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post("/cart/14023")
            .set("Cookie", `${session};${cookie}`)
            .send({ _csrf: csrf })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(404);
              done();
            });
        });
    });

    it("Add item to cart", (done) => {
      request(app)
        .get(`/course/${course}`)
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/cart/${course}`)
            .set("Cookie", `${session};${cookie}`)
            .send({ _csrf: csrf })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(302);
              expect(res.headers.location).to.eq("/cart");
              done();
            });
        });
    });
  });

  describe("display cart", () => {
    it("Should return 200", (done) => {
      request(app)
        .get("/cart")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          expect(res.status).to.eq(200);
          order = res.text.match("/cart/delete/[0-9]*")[0].split("/")[3];
          done();
        });
    });
  });

  describe("Delete cart item", () => {
    it("Should return 404", (done) => {
      request(app)
        .get("/cart")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/cart/delete/2149`)
            .set("Cookie", `${session};${cookie}`)
            .send({ _csrf: csrf })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(404);
              done();
            });
        });
    });

    it("Should remove item from cart", (done) => {
      request(app)
        .get("/cart")
        .set("Cookie", session)
        .end((err, res) => {
          if (err) throw err;
          csrf = res.text.match(regex)[0].split('"')[3];
          cookie = res.headers["set-cookie"][0];
          request(app)
            .post(`/cart/delete/${order}`)
            .set("Cookie", `${session};${cookie}`)
            .send({ _csrf: csrf })
            .end((err, res) => {
              if (err) throw err;
              expect(res.status).to.eq(302);
              expect(res.headers.location).to.eq("/cart");
              done();
            });
        });
    });
  });
});
