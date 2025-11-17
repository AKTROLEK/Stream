import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import CreditService from '../../services/CreditService.js';
import Streamer from '../../models/Streamer.js';
import lang from '../../utils/language.js';

export default {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Check your credit balance')
    .setDescriptionLocalizations({
      'ar': 'التحقق من رصيد الكريدت'
    }),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const streamer = await Streamer.findOne({ discordId: userId });
    
    if (!streamer) {
      return interaction.reply({
        content: 'You are not registered as a streamer. / أنت غير مسجل كستريمر.',
        ephemeral: true
      });
    }
    
    const language = streamer.preferences.language || 'ar';
    
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(language === 'ar' ? '💰 محفظة الكريدت' : '💰 Credit Wallet')
      .addFields(
        {
          name: language === 'ar' ? 'الرصيد الحالي' : 'Current Balance',
          value: `**${streamer.credits.balance}** ${language === 'ar' ? 'كريدت' : 'Credits'}`,
          inline: true
        },
        {
          name: language === 'ar' ? 'إجمالي المكتسب' : 'Total Earned',
          value: `${streamer.credits.totalEarned} ${language === 'ar' ? 'كريدت' : 'Credits'}`,
          inline: true
        },
        {
          name: language === 'ar' ? 'إجمالي المصروف' : 'Total Spent',
          value: `${streamer.credits.totalSpent} ${language === 'ar' ? 'كريدت' : 'Credits'}`,
          inline: true
        }
      )
      .setFooter({ 
        text: language === 'ar' 
          ? 'استخدم /credit-history لعرض سجل المعاملات' 
          : 'Use /credit-history to view transaction history'
      })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  }
};
