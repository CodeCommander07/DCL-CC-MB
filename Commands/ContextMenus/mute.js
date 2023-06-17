const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

const muteSchema = require("../../Schemas/muteSchema");
const infrSchema = require("../../Schemas/infrSchema");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Mute - CM")
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  async execute(interaction, client) {
    const { targetId, target } = interaction;

    const errEmbed = new EmbedBuilder().setColor(0xc72c3b);

    const member = await interaction.guild.members.fetch(user.id);

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    if (targetId === interaction.user.id)
      return interaction.reply({
        embeds: [errEmbed.setDescription("You cannnot mute yourself")],
        ephemeral: true,
      });

    if (targetId === client.id)
      return interaction.reply({
        embeds: [errEmbed.setDescription("You cannnot mute me silly")],
        ephemeral: true,
      });

    await new muteSchema({
      Guild: interaction.guild.id,
      UserID: targetId,
      ModeratorID: interaction.user.id,
      InfractionDate: Date.now(),
      Reason: `No reason Provided | Muted by - ${interaction.username} | Context Menu Mute.`,
    }).save();

    const data = await infrSchema.findOne({
      Guild: interaction.guild.id,
      UserID: targetId,
    });
    if (!data) {
      await infrSchema.create({
        Guild: interaction.guild.id,
        UserID: targetId,
        Points: 2,
      });
    } else {
      const newPoints = (data.Points += 2);
      await data.updateOne({
        Guild: interaction.guild.id,
        UserID: targetId,
        Points: newPoints,
      });
    }

    const embed1 = new EmbedBuilder()
      .setColor("#c72c3b")
      .setTitle("Moderation Event")
      .setDescription(
        `You have been muted in ${
          interaction.guild.name
        } for \`3 hours\` at <t:${Math.round(Date.now() / 1000)}:f>`
      );

    await member.send({
      embeds: [embed1],
    });
    await member.timeout(
      3 * 60 * 60 * 1000,
      `No reason Provided | Kicked by - ${interaction.username} | Context Menu Kick.`
    );

    const embed = new EmbedBuilder()
      .setColor("#c72c3b")
      .setTitle("Mute Success")
      .setDescription(
        `You have sucessfully muted <@!${targetId}> for \`3 hours\` at <t:${Math.round(
          Date.now() / 1000
        )}:f>`
      );
    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
