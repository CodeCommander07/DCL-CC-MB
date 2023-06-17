const { model, Schema } = require("mongoose");

let infrSchema = new Schema({
  Guild: String,
  UserID: String,
  Points: Number,
});

module.exports = model("Infractions", infrSchema);
