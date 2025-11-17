export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      
      if (!command) return;
      
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error('Error executing command:', error);
        
        const errorMessage = {
          content: 'There was an error executing this command! / حدث خطأ أثناء تنفيذ هذا الأمر!',
          ephemeral: true
        };
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    }
    
    // Handle modals
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('ticket_modal_')) {
        const { default: handleTicketModal } = await import('../handlers/ticketModal.js');
        await handleTicketModal(interaction);
      }
    }
    
    // Handle buttons
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('ticket_')) {
        const { default: handleTicketButton } = await import('../handlers/ticketButton.js');
        await handleTicketButton(interaction);
      }
    }
    
    // Handle select menus
    if (interaction.isStringSelectMenu()) {
      // Handle select menu interactions
    }
  }
};
