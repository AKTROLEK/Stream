import TicketService from '../services/TicketService.js';

export default async function handleTicketButton(interaction) {
  const [action, ticketId] = interaction.customId.split('_').slice(1);
  
  if (action === 'close') {
    await TicketService.closeTicket(ticketId, interaction.user.id, 'Closed by user');
    await interaction.reply({
      content: '✅ Ticket closed successfully. / تم إغلاق التذكرة بنجاح.',
      ephemeral: true
    });
    
    // Archive or delete channel after some time
    setTimeout(async () => {
      try {
        await interaction.channel.delete();
      } catch (error) {
        console.error('Error deleting ticket channel:', error);
      }
    }, 10000);
  }
}
