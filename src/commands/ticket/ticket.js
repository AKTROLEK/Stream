import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import TicketService from '../../services/TicketService.js';
import lang from '../../utils/language.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a support ticket')
    .setDescriptionLocalizations({
      'ar': 'إنشاء تذكرة دعم'
    })
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Ticket type')
        .setDescriptionLocalizations({ 'ar': 'نوع التذكرة' })
        .setRequired(true)
        .addChoices(
          { name: 'Application / تقديم', value: 'application' },
          { name: 'Issue / مشكلة', value: 'issue' },
          { name: 'Credit Edit / تعديل كريدت', value: 'credit_edit' },
          { name: 'Promotion / ترويج', value: 'promotion' },
          { name: 'Support / دعم', value: 'support' }
        )
    ),
  
  async execute(interaction) {
    const type = interaction.options.getString('type');
    const userId = interaction.user.id;
    const username = interaction.user.username;
    
    // Show modal for ticket details
    const modal = new ModalBuilder()
      .setCustomId(`ticket_modal_${type}`)
      .setTitle(type === 'application' ? 'Application Form / نموذج التقديم' : 'Create Ticket / إنشاء تذكرة');
    
    const titleInput = new TextInputBuilder()
      .setCustomId('title')
      .setLabel(type === 'application' ? 'Full Name / الاسم الكامل' : 'Title / العنوان')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);
    
    const descInput = new TextInputBuilder()
      .setCustomId('description')
      .setLabel('Description / الوصف')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);
    
    const row1 = new ActionRowBuilder().addComponents(titleInput);
    const row2 = new ActionRowBuilder().addComponents(descInput);
    
    modal.addComponents(row1, row2);
    
    if (type === 'application') {
      const platformsInput = new TextInputBuilder()
        .setCustomId('platforms')
        .setLabel('Platforms (YouTube, Twitch, etc.) / المنصات')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      
      const experienceInput = new TextInputBuilder()
        .setCustomId('experience')
        .setLabel('Experience / الخبرة')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);
      
      const sampleInput = new TextInputBuilder()
        .setCustomId('sample')
        .setLabel('Sample Content Link / رابط محتوى تجريبي')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
      
      const row3 = new ActionRowBuilder().addComponents(platformsInput);
      const row4 = new ActionRowBuilder().addComponents(experienceInput);
      const row5 = new ActionRowBuilder().addComponents(sampleInput);
      
      modal.addComponents(row3, row4, row5);
    }
    
    await interaction.showModal(modal);
  }
};
