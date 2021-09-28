const handleRegister = (req, res, postgres, bcrypt) => {
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
};

module.exports = {
  handleRegister: handleRegister,
};
