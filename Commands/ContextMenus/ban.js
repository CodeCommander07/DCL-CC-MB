const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

const banSchema = require("../../Schemas/bansSchema");
const infrSchema = require("../../Schemas/infrSchema");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Ban - CM")
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
        embeds: [errEmbed.setDescription("You cannnot ban yourself")],
        ephemeral: true,
      });

    if (targetId === client.id)
      return interaction.reply({
        embeds: [errEmbed.setDescription("You cannnot ban me silly")],
        ephemeral: true,
      });

    await banSchema.create({
      Guild: interaction.guild.id,
      UserID: targetId,
      ModeratorID: interaction.user.id,
      InfractionDate: Date.now(),
      Reason: `No reason Provided | Banned by - ${interaction.username} | Context Menu Ban.`,
    });

    const data = await infrSchema.findOne({
      Guild: interaction.guild.id,
      UserID: targetId,
    });
    if (!data) {
      await infrSchema.create({
        Guild: interaction.guild.id,
        UserID: targetId,
        Points: 4,
      });
    } else {
      const newPoints = (data.Points += 4);
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
        `You have been banned from ${interaction.guild.name} at <t:${Math.round(
          Date.now() / 1000
        )}:f>`
      );

    await member.send({
      embeds: [embed1],
    });

    await member.ban(
      `No reason Provided | Banned by - ${interaction.username} | Context Menu Ban.`
    );

    await interaction.guild.bans.create(targetId, {
      reason: `No reason Provided | Banned by - ${interaction.username} | Context Menu Ban.`,
    });

    const embed = new EmbedBuilder()
      .setColor("#c72c3b")
      .setTitle("Ban Success")
      .setDescription(
        `You have sucessfully banned <@!${targetId}> at <t:${Math.round(
          Date.now() / 1000
        )}:f>`
      );
    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
