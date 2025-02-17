const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server"); 

let authToken;

describe("Railway Management API", () => {

  // User Login (Get Token)
  it("should log in a user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "testuser@example.com",
        password: "testpass"
      });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");

    // Store the token for further use
    authToken = res.body.token;
  });

  // Fail to Add Train Without API Key
  it("should fail to add a train without API key", async () => {
    const res = await request(app)
      .post("/admin/trains")
      .send({
        name: "Rajdhani Express",
        source: "Delhi",
        destination: "Mumbai",
        total_seats: 120
      });
    expect(res.status).to.equal(401); // Unauthorized
  });

  // Add Train with API Key (Authenticated)
  it("should add a train with a valid API key", async () => {
    const res = await request(app)
      .post("/admin/trains")
      .set('x-api-key', process.env.ADMIN_API_KEY) // Pass API Key
      .send({
        name: "Rajdhani Express",
        source: "Delhi",
        destination: "Mumbai",
        total_seats: 120
      });
    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("Train added successfully");
  });

});
