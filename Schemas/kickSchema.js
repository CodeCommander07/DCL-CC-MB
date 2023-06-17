const { model, Schema } = require("mongoose");

let kickSchema = new Schema({
  Guild: String,
  UserID: String,
  ModeratorID: String,
  InfractionDate: String,
  Reason: String,
});

module.exports = model("Kick", kickSchema);
