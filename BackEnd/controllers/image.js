const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "675852916f70476fa1a2349789bfcad6",
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to call api"));
};

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
  handleApiCall: handleApiCall,
};
