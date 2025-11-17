import { EmbedBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import TicketService from '../services/TicketService.js';
import dotenv from 'dotenv';

dotenv.config();

export default async function handleTicketModal(interaction) {
  const type = interaction.customId.replace('ticket_modal_', '');
  const userId = interaction.user.id;
  const username = interaction.user.username;
  
  const title = interaction.fields.getTextInputValue('title');
  const description = interaction.fields.getTextInputValue('description');
  
  let applicationData = null;
  
  if (type === 'application') {
    applicationData = {
      platforms: interaction.fields.getTextInputValue('platforms').split(',').map(p => p.trim()),
      experience: interaction.fields.getTextInputValue('experience'),
      sampleContent: interaction.fields.getTextInputValue('sample') || 'N/A'
    };
  }
  
  await interaction.deferReply({ ephemeral: true });
  
  try {
    // Create ticket channel
    const guild = interaction.guild;
    const ticketCategory = await guild.channels.fetch(process.env.TICKET_CATEGORY_ID);
    
    const ticketChannel = await guild.channels.create({
      name: `ticket-${username}`,
      type: ChannelType.GuildText,
      parent: ticketCategory,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: userId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
        },
        {
          id: process.env.SOCIAL_MEDIA_MANAGER_ROLE,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages]
        },
        {
          id: process.env.SOCIAL_TEAM_ROLE,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
        },
        {
          id: process.env.STREAMER_MANAGEMENT_ROLE,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages]
        }
      ]
    });
    
    // Create ticket in database
    const ticket = await TicketService.createTicket(userId, username, type, {
      title,
      description,
      applicationData,
      channelId: ticketChannel.id
    });
    
    // Send ticket info to channel
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle(`🎫 ${ticket.ticketId}`)
      .setDescription(description)
      .addFields(
        { name: type === 'application' ? 'Full Name / الاسم' : 'Title / العنوان', value: title },
        { name: 'Type / النوع', value: type },
        { name: 'User / المستخدم', value: `<@${userId}>` }
      )
      .setTimestamp();
    
    if (applicationData) {
      embed.addFields(
        { name: 'Platforms / المنصات', value: applicationData.platforms.join(', ') },
        { name: 'Experience / الخبرة', value: applicationData.experience },
        { name: 'Sample / عينة', value: applicationData.sampleContent }
      );
    }
    
    await ticketChannel.send({ embeds: [embed] });
    await ticketChannel.send(`<@${userId}> مرحباً! سيتم الرد عليك قريباً.\nHello! You will be contacted soon.`);
    
    // Notify staff
    const logChannel = await guild.channels.fetch(process.env.ADMIN_LOG_CHANNEL_ID);
    const logEmbed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🆕 New Ticket Created / تذكرة جديدة')
      .addFields(
        { name: 'Ticket ID', value: ticket.ticketId },
        { name: 'Type', value: type },
        { name: 'User', value: `${username} (<@${userId}>)` },
        { name: 'Channel', value: `<#${ticketChannel.id}>` }
      )
      .setTimestamp();
    
    await logChannel.send({ embeds: [logEmbed] });
    
    // Reply to user
    await interaction.editReply({
      content: `✅ Ticket created successfully! / تم إنشاء التذكرة بنجاح!\nTicket ID: **${ticket.ticketId}**\nChannel: <#${ticketChannel.id}>`
    });
    
  } catch (error) {
    console.error('Error creating ticket:', error);
    await interaction.editReply({
      content: '❌ Error creating ticket. Please try again. / خطأ في إنشاء التذكرة. الرجاء المحاولة مرة أخرى.'
    });
  }
}
