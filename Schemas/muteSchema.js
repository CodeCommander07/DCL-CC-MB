const { model, Schema } = require("mongoose");

let muteSchema = new Schema({
  Guild: String,
  UserID: String,
  ModeratorID: String,
  InfractionDate: String,
  Duration: String,
  Reason: String,
});

module.exports = model("Mute", muteSchema);
