const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

const kickSchema = require("../../Schemas/kickSchema");
const infrSchema = require("../../Schemas/infrSchema");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Kick - CM")
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
        embeds: [errEmbed.setDescription("You cannnot kick yourself")],
        ephemeral: true,
      });

    if (targetId === client.id)
      return interaction.reply({
        embeds: [errEmbed.setDescription("You cannnot kick me silly")],
        ephemeral: true,
      });

    await new kickSchema({
      Guild: interaction.guild.id,
      UserID: targetId,
      ModeratorID: interaction.user.id,
      InfractionDate: Date.now(),
      Reason: `No reason Provided | Kicked by - ${interaction.username} | Context Menu Kick.`,
    }).save();

    const data = await infrSchema.findOne({
      Guild: interaction.guild.id,
      UserID: targetId,
    });
    if (!data) {
      await infrSchema.create({
        Guild: interaction.guild.id,
        UserID: targetId,
        Points: 3,
      });
    } else {
      const newPoints = (data.Points += 3);
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
        `You have been kicked from ${interaction.guild.name} at <t:${Math.round(
          Date.now() / 1000
        )}:f>`
      );

    await member.send({
      embeds: [embed1],
    });

    await member.kick(
      `No reason Provided | Kicked by - ${interaction.username} | Context Menu Kick.`
    );

    const embed = new EmbedBuilder()
      .setColor("#c72c3b")
      .setTitle("Kick Success")
      .setDescription(
        `You have sucessfully Kicked <@!${targetId}> at <t:${Math.round(
          Date.now() / 1000
        )}:f>`
      );
    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
