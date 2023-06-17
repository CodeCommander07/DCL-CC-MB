const {
  ActivityType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const mongoose = require("mongoose");
const config = require("../../config.json");
const logger = require("../../Functions/errorHandler");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await mongoose.connect(config.config.mongodb || "", {
      keepAlive: true,
    });

    if (mongoose.connect) {
      logger.info("client", " MongoDB connection succesful.");
    }

    client.user.setActivity("New Commands & COntext Menys", {
      type: ActivityType.Watching,
    });
    logger.info(
      "client",
      ` ${client.user.tag} is online in ${client.guilds.cache.size} servers! `
    );
  },
};
