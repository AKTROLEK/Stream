import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import Streamer from '../../models/Streamer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Manage your streaming schedule')
    .setDescriptionLocalizations({
      'ar': 'إدارة جدول البث'
    })
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set a streaming schedule')
        .setDescriptionLocalizations({ 'ar': 'تعيين جدول بث' })
        .addIntegerOption(option =>
          option.setName('day')
            .setDescription('Day of week (0=Sunday, 6=Saturday)')
            .setDescriptionLocalizations({ 'ar': 'يوم الأسبوع (0=الأحد، 6=السبت)' })
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(6)
        )
        .addStringOption(option =>
          option.setName('start_time')
            .setDescription('Start time (HH:MM format, 24-hour)')
            .setDescriptionLocalizations({ 'ar': 'وقت البدء (بصيغة HH:MM)' })
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('end_time')
            .setDescription('End time (HH:MM format, 24-hour)')
            .setDescriptionLocalizations({ 'ar': 'وقت الانتهاء (بصيغة HH:MM)' })
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('platform')
            .setDescription('Platform')
            .setDescriptionLocalizations({ 'ar': 'المنصة' })
            .setRequired(true)
            .addChoices(
              { name: 'YouTube', value: 'youtube' },
              { name: 'Twitch', value: 'twitch' },
              { name: 'TikTok', value: 'tiktok' },
              { name: 'Kick', value: 'kick' },
              { name: 'Instagram', value: 'instagram' },
              { name: 'Facebook', value: 'facebook' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View your streaming schedule')
        .setDescriptionLocalizations({ 'ar': 'عرض جدول البث' })
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('clear')
        .setDescription('Clear your streaming schedule')
        .setDescriptionLocalizations({ 'ar': 'مسح جدول البث' })
    ),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const subcommand = interaction.options.getSubcommand();
    
    const streamer = await Streamer.findOne({ discordId: userId });
    
    if (!streamer) {
      return interaction.reply({
        content: 'You are not registered as a streamer. / أنت غير مسجل كستريمر.',
        ephemeral: true
      });
    }
    
    const language = streamer.preferences.language || 'ar';
    
    if (subcommand === 'set') {
      const day = interaction.options.getInteger('day');
      const startTime = interaction.options.getString('start_time');
      const endTime = interaction.options.getString('end_time');
      const platform = interaction.options.getString('platform');
      
      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return interaction.reply({
          content: language === 'ar'
            ? 'صيغة الوقت غير صحيحة. استخدم HH:MM (مثال: 14:30)'
            : 'Invalid time format. Use HH:MM (example: 14:30)',
          ephemeral: true
        });
      }
      
      // Add to schedule
      streamer.schedule.push({
        dayOfWeek: day,
        startTime,
        endTime,
        platform
      });
      
      await streamer.save();
      
      const dayNames = {
        ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      };
      
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(language === 'ar' ? '✅ تم تعيين الجدول' : '✅ Schedule Set')
        .addFields(
          { name: language === 'ar' ? 'اليوم' : 'Day', value: dayNames[language][day], inline: true },
          { name: language === 'ar' ? 'الوقت' : 'Time', value: `${startTime} - ${endTime}`, inline: true },
          { name: language === 'ar' ? 'المنصة' : 'Platform', value: platform, inline: true }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'view') {
      const dayNames = {
        ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      };
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(language === 'ar' ? '📅 جدول البث' : '📅 Streaming Schedule');
      
      if (streamer.schedule.length === 0) {
        embed.setDescription(
          language === 'ar'
            ? 'لم تقم بتعيين جدول بث بعد'
            : 'You haven\'t set a streaming schedule yet'
        );
      } else {
        const scheduleText = streamer.schedule
          .map(s => `**${dayNames[language][s.dayOfWeek]}**: ${s.startTime} - ${s.endTime} (${s.platform})`)
          .join('\n');
        
        embed.setDescription(scheduleText);
      }
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'clear') {
      streamer.schedule = [];
      await streamer.save();
      
      await interaction.reply({
        content: language === 'ar'
          ? '✅ تم مسح جدول البث'
          : '✅ Schedule cleared',
        ephemeral: true
      });
    }
  }
};
