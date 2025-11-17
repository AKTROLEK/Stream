import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Streamer from '../../models/Streamer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change your language preference')
    .setDescriptionLocalizations({
      'ar': 'تغيير لغتك المفضلة'
    })
    .addStringOption(option =>
      option.setName('lang')
        .setDescription('Language')
        .setDescriptionLocalizations({ 'ar': 'اللغة' })
        .setRequired(true)
        .addChoices(
          { name: 'العربية', value: 'ar' },
          { name: 'English', value: 'en' }
        )
    ),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const newLang = interaction.options.getString('lang');
    
    const streamer = await Streamer.findOne({ discordId: userId });
    
    if (!streamer) {
      return interaction.reply({
        content: 'You are not registered as a streamer. / أنت غير مسجل كستريمر.',
        ephemeral: true
      });
    }
    
    streamer.preferences.language = newLang;
    await streamer.save();
    
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle(newLang === 'ar' ? '✅ تم تغيير اللغة' : '✅ Language Changed')
      .setDescription(
        newLang === 'ar'
          ? 'تم تغيير لغتك إلى العربية بنجاح'
          : 'Your language has been changed to English successfully'
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
