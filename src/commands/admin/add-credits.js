import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Streamer from '../../models/Streamer.js';
import CreditService from '../../services/CreditService.js';

export default {
  data: new SlashCommandBuilder()
    .setName('add-credits')
    .setDescription('Add credits to a streamer (Admin only)')
    .setDescriptionLocalizations({
      'ar': 'إضافة كريدت لستريمر (للمشرفين فقط)'
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The streamer')
        .setDescriptionLocalizations({ 'ar': 'الستريمر' })
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount of credits')
        .setDescriptionLocalizations({ 'ar': 'كمية الكريدت' })
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for adding credits')
        .setDescriptionLocalizations({ 'ar': 'سبب إضافة الكريدت' })
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const reason = interaction.options.getString('reason');
    
    try {
      await CreditService.addCredits(
        user.id,
        amount,
        'earn_bonus',
        reason,
        {
          adminId: interaction.user.id,
          adminUsername: interaction.user.username
        }
      );
      
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Credits Added / تم إضافة الكريدت')
        .addFields(
          { name: 'User / المستخدم', value: `<@${user.id}>`, inline: true },
          { name: 'Amount / الكمية', value: `+${amount}`, inline: true },
          { name: 'Reason / السبب', value: reason }
        )
        .setFooter({ text: `By / بواسطة: ${interaction.user.username}` })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
      // Notify the user
      try {
        await user.send(`✅ You received **${amount}** credits!\nReason: ${reason}\n\nتلقيت **${amount}** كريدت!\nالسبب: ${reason}`);
      } catch (error) {
        console.log('Could not send DM to user');
      }
      
    } catch (error) {
      await interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true
      });
    }
  }
};
