import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import AnalyticsService from '../../services/AnalyticsService.js';
import Streamer from '../../models/Streamer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View your streaming statistics')
    .setDescriptionLocalizations({
      'ar': 'عرض إحصائيات البث'
    })
    .addStringOption(option =>
      option.setName('period')
        .setDescription('Time period')
        .setDescriptionLocalizations({ 'ar': 'الفترة الزمنية' })
        .setRequired(false)
        .addChoices(
          { name: 'Weekly / أسبوعي', value: 'weekly' },
          { name: 'Monthly / شهري', value: 'monthly' }
        )
    ),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const period = interaction.options.getString('period') || 'weekly';
    
    const streamer = await Streamer.findOne({ discordId: userId });
    
    if (!streamer) {
      return interaction.reply({
        content: 'You are not registered as a streamer. / أنت غير مسجل كستريمر.',
        ephemeral: true
      });
    }
    
    const language = streamer.preferences.language || 'ar';
    
    await interaction.deferReply();
    
    const report = period === 'weekly'
      ? await AnalyticsService.getWeeklyReport(userId)
      : await AnalyticsService.getMonthlyReport(userId);
    
    const platformComparison = await AnalyticsService.compareplatforms(userId);
    
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle(
        language === 'ar'
          ? `📊 ${period === 'weekly' ? 'التقرير الأسبوعي' : 'التقرير الشهري'}`
          : `📊 ${period === 'weekly' ? 'Weekly Report' : 'Monthly Report'}`
      )
      .setDescription(`**${streamer.username}**`)
      .addFields(
        {
          name: language === 'ar' ? 'إجمالي المقاطع' : 'Total Videos',
          value: `${report.totalVideos}`,
          inline: true
        },
        {
          name: language === 'ar' ? 'ساعات البث' : 'Stream Hours',
          value: `${report.totalStreamHours.toFixed(1)}`,
          inline: true
        },
        {
          name: language === 'ar' ? 'المشاهدات' : 'Views',
          value: `${report.totalViews.toLocaleString()}`,
          inline: true
        }
      );
    
    // Add platform breakdown
    if (Object.keys(platformComparison).length > 0) {
      let platformText = '';
      for (const [platform, stats] of Object.entries(platformComparison)) {
        platformText += `**${platform}**: ${stats.videos} ${language === 'ar' ? 'مقاطع' : 'videos'}, ${stats.streamHours.toFixed(1)}h, ${stats.views.toLocaleString()} ${language === 'ar' ? 'مشاهدات' : 'views'}\n`;
      }
      
      embed.addFields({
        name: language === 'ar' ? 'تفصيل المنصات' : 'Platform Breakdown',
        value: platformText || (language === 'ar' ? 'لا توجد بيانات' : 'No data')
      });
    }
    
    embed.setFooter({
      text: language === 'ar' ? 'استمر في العمل الرائع! 🚀' : 'Keep up the great work! 🚀'
    })
    .setTimestamp();
    
    await interaction.editReply({ embeds: [embed] });
  }
};
