const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const logger = require("./Functions/errorHandler");

const { loadEvents } = require("./Functions/eventHandler");
const { loadCommands } = require("./Functions/commandHandler");

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});

client.on("unhandledRejection", (reason, p) => {
  const ChannelID = "1118194572397387889";
  console.error("Unhandled promise rejection:", reason, p);
  const Embed = new EmbedBuilder()
    .setColor("#9900ff")
    .setTimestamp()
    .setFooter({ text: "Crash Prevention" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Unhandled Rejection/Catch:\n\n** ```" + reason + "```"
      ),
    ],
  });
});

client.config = require("./config.json");
client.commands = new Collection();

module.exports = client;

client.login(client.config.config.token).then(() => {
  loadEvents(client);
  loadCommands(client);
});

//**DB TEMPLATES**

// const data = await infrSchema.findOne({
//   Guild: interaction.Guild.id,
//   UserID: targetId,
// });
// if (!data) {
//   await infrSchema.create({
//     Guild: interaction.Guild.id,
//     UserID: targetId,
//     Points: 3,
//   });
// } else {
//   const newPoints = (data.Points += 3);
//   await data.updateOne({
//     Guild: interaction.Guild.id,
//     UserID: targetId,
//     Points: newPoints,
//   });
// }
