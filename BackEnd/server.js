const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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

app.post("/signin", (req, res) => {
  postgres
    .select("email", "hash")
    .where("email", "=", req.body.email)
    .from("login")
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return postgres
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else res.status(400).json("wrong credentials");
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  console.log("email is", email);
  postgres
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into("login")
        .returning("email")
        .then((loginemail) => {
          return trx("users")
            .returning("*")
            .insert({
              name: name,
              email: loginemail[0],
              joined: new Date(),
            })
            .then((user) => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })

    .catch((err) => res.status(400).json("unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  postgres
    .select("*")
    .from("users")
    .where("id", id)
    .then((user) => {
      if (user.length) res.json(user[0]);
      else res.status(404).json(`user with id : ${id} is not registered!`);
    })
    .catch((err) => res.status(400).json("error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  postgres
    .from("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((resp) => res.json(resp[0]))
    .catch((err) => res.status(400).json("unable to get entries"));
});

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
