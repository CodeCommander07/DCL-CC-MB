const { model, Schema } = require("mongoose");

let bansSchema = new Schema({
  Guild: String,
  UserID: String,
  ModeratorID: String,
  InfractionDate: String,
  Reason: String,
});

module.exports = model("Bans", bansSchema);
