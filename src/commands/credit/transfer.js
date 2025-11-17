import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import CreditService from '../../services/CreditService.js';
import Streamer from '../../models/Streamer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer credits to another streamer')
    .setDescriptionLocalizations({
      'ar': 'تحويل كريدت لستريمر آخر'
    })
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to transfer to')
        .setDescriptionLocalizations({ 'ar': 'المستخدم المراد التحويل له' })
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount of credits to transfer')
        .setDescriptionLocalizations({ 'ar': 'كمية الكريدت للتحويل' })
        .setRequired(true)
        .setMinValue(1)
    ),
  
  async execute(interaction) {
    const fromUser = interaction.user;
    const toUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    
    if (fromUser.id === toUser.id) {
      return interaction.reply({
        content: 'You cannot transfer credits to yourself. / لا يمكنك تحويل كريدت لنفسك.',
        ephemeral: true
      });
    }
    
    const fromStreamer = await Streamer.findOne({ discordId: fromUser.id });
    const toStreamer = await Streamer.findOne({ discordId: toUser.id });
    
    if (!fromStreamer || !toStreamer) {
      return interaction.reply({
        content: 'One or both users are not registered streamers. / أحد المستخدمين أو كلاهما غير مسجل كستريمر.',
        ephemeral: true
      });
    }
    
    const language = fromStreamer.preferences.language || 'ar';
    
    try {
      const result = await CreditService.transferCredits(fromUser.id, toUser.id, amount);
      
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(language === 'ar' ? '✅ تم التحويل بنجاح' : '✅ Transfer Successful')
        .setDescription(
          language === 'ar'
            ? `تم تحويل **${amount}** كريدت إلى ${toUser.username}`
            : `Transferred **${amount}** credits to ${toUser.username}`
        )
        .addFields(
          {
            name: language === 'ar' ? 'رصيدك الجديد' : 'Your New Balance',
            value: `${result.fromStreamer.credits.balance} ${language === 'ar' ? 'كريدت' : 'Credits'}`
          }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
      // Notify receiver
      try {
        const receiverEmbed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle(language === 'ar' ? '💰 استلمت كريدت!' : '💰 Credits Received!')
          .setDescription(
            language === 'ar'
              ? `استلمت **${amount}** كريدت من ${fromUser.username}`
              : `You received **${amount}** credits from ${fromUser.username}`
          )
          .setTimestamp();
        
        await toUser.send({ embeds: [receiverEmbed] });
      } catch (error) {
        console.log('Could not send DM to receiver');
      }
      
    } catch (error) {
      const errorMsg = language === 'ar'
        ? error.message === 'Insufficient credits'
          ? 'رصيد غير كافٍ للتحويل'
          : 'حدث خطأ أثناء التحويل'
        : error.message;
      
      await interaction.reply({
        content: `❌ ${errorMsg}`,
        ephemeral: true
      });
    }
  }
};
