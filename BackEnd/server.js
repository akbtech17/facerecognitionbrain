const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const postgres = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "sql",
    database: "smart-brain-db",
  },
});

const app = express();

// midleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("this.is working");
});

app.post("/signin", (req, res) =>
  signin.handleSignIn(req, res, postgres, bcrypt)
);

app.post("/register", (req, res) =>
  register.handleRegister(req, res, postgres, bcrypt)
);

app.get("/profile/:id", (req, res) =>
  profile.handleProfileRequest(req, res, postgres)
);

app.put("/image", (req, res) => image.handleImageRequest(req, res, postgres));
app.post("/imageurl", (req, res) => image.handleApiCall(req, res));

app.listen(3000, () => {
  console.log("FaceRecog is Running on Port3000");
});

/* EndPoints

/                 --> res = this is working
/signin           --> POST = success/fail
{here we do post because we dont want our pass to be exposed in query string}
/register         --> POST = return user
/profile/:userid  --> GET = user
/image            --> PUT(update) = return the user
*/
