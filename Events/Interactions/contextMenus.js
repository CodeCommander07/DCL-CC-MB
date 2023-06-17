const { ContextMenuInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ContextMenuInteraction} interaction
   */
  execute(interaction, client) {
    if (!interaction.isContextMenuCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      interaction.reply({ content: "Outdated context menu" });
    }

    command.execute(interaction, client);
    // console.log(interaction);
  },
};
