const handleProfileRequest = (req, res, postgres) => {
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
};

module.exports = {
  handleProfileRequest: handleProfileRequest,
};
