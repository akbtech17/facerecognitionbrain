const handleImageRequest = (req, res, postgres) => {
  const { id } = req.body;
  postgres
    .from("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((resp) => res.json(resp[0]))
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImageRequest: handleImageRequest,
};
