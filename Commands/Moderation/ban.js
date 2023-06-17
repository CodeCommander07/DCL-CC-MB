const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const infrSchema = require("../../Schemas/infrSchema");

module.exports = {
  moderatorOnly: true,
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the discord server.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to be banned.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the ban.")
    ),

  async execute(interaction) {
    const { channel, options } = interaction;

    const user = options.getUser("target");
    const reason = options.getString("reason") || "No reason provided.";

    const member = await interaction.guild.members.fetch(user.id);

    const errEmbed = new EmbedBuilder()
      .setDescription(
        `You can't take action on ${user.username} since they have a higher role.`
      )
      .setColor(0xc72c3b);

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    await member.ban({ reason });

    const embed = new EmbedBuilder()
      .setDescription(`Succesfully banned ${user} with reason: ${reason}`)
      .setColor(0x5fb041)
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });

    const data = await infrSchema.findOne({
      Guild: interaction.Guild.id,
      UserID: targetId,
    });
    if (!data) {
      await infrSchema.create({
        Guild: interaction.Guild.id,
        UserID: targetId,
        Points: 4,
      });
    } else {
      const newPoints = (data.Points += 4);
      await data.updateOne({
        Guild: interaction.Guild.id,
        UserID: targetId,
        Points: newPoints,
      });
    }
  },
};