import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import CreditService from '../../services/CreditService.js';
import Streamer from '../../models/Streamer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('credit-history')
    .setDescription('View your credit transaction history')
    .setDescriptionLocalizations({
      'ar': 'عرض سجل معاملات الكريدت'
    })
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of transactions to show')
        .setDescriptionLocalizations({ 'ar': 'عدد المعاملات المراد عرضها' })
        .setRequired(false)
        .setMinValue(5)
        .setMaxValue(50)
    ),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const limit = interaction.options.getInteger('limit') || 10;
    
    const streamer = await Streamer.findOne({ discordId: userId });
    
    if (!streamer) {
      return interaction.reply({
        content: 'You are not registered as a streamer. / أنت غير مسجل كستريمر.',
        ephemeral: true
      });
    }
    
    const language = streamer.preferences.language || 'ar';
    
    await interaction.deferReply();
    
    const transactions = await CreditService.getTransactionHistory(userId, limit);
    
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(
        language === 'ar' ? '📜 سجل معاملات الكريدت' : '📜 Credit Transaction History'
      )
      .setDescription(
        language === 'ar'
          ? `آخر ${transactions.length} معاملة`
          : `Last ${transactions.length} transactions`
      );
    
    if (transactions.length === 0) {
      embed.addFields({
        name: language === 'ar' ? 'لا توجد معاملات' : 'No transactions',
        value: language === 'ar' ? 'لم تقم بأي معاملات بعد' : 'You haven\'t made any transactions yet'
      });
    } else {
      const transactionText = transactions
        .slice(0, 10)
        .map(t => {
          const sign = t.amount >= 0 ? '+' : '';
          const date = new Date(t.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
          return `${sign}${t.amount} - ${t.description} (${date})`;
        })
        .join('\n');
      
      embed.addFields({
        name: language === 'ar' ? 'المعاملات' : 'Transactions',
        value: transactionText
      });
    }
    
    embed.setFooter({
      text: language === 'ar'
        ? `الرصيد الحالي: ${streamer.credits.balance} كريدت`
        : `Current Balance: ${streamer.credits.balance} Credits`
    })
    .setTimestamp();
    
    await interaction.editReply({ embeds: [embed] });
  }
};
