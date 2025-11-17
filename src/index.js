import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import connectDB from './utils/database.js';
import cron from 'node-cron';
import AlertService from './services/AlertService.js';
import AnalyticsService from './services/AnalyticsService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

client.commands = new Collection();

// Load commands
async function loadCommands() {
  const commands = [];
  const commandFolders = readdirSync(join(__dirname, 'commands'));
  
  for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = await import(`./commands/${folder}/${file}`);
      client.commands.set(command.default.data.name, command.default);
      commands.push(command.default.data.toJSON());
    }
  }
  
  return commands;
}

// Register slash commands
async function registerCommands(commands) {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  
  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body: commands }
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Load events
async function loadEvents() {
  const eventFiles = readdirSync(join(__dirname, 'events')).filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    if (event.default.once) {
      client.once(event.default.name, (...args) => event.default.execute(...args, client));
    } else {
      client.on(event.default.name, (...args) => event.default.execute(...args, client));
    }
  }
}

// Schedule automated tasks
function setupScheduledTasks() {
  // Send alerts every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const alerts = await AlertService.getUnsentAlerts();
      
      for (const alert of alerts) {
        const user = await client.users.fetch(alert.streamerId);
        if (user) {
          const language = alert.title.ar ? 'ar' : 'en';
          const title = language === 'ar' ? alert.title.ar : alert.title.en;
          const message = language === 'ar' ? alert.message.ar : alert.message.en;
          
          try {
            await user.send(`**${title}**\n${message}`);
            await AlertService.markAsSent(alert._id);
          } catch (error) {
            console.log(`Could not send alert to ${alert.streamerId}`);
          }
        }
      }
    } catch (error) {
      console.error('Error sending alerts:', error);
    }
  });
  
  // Generate weekly reports (every Sunday at midnight)
  cron.schedule('0 0 * * 0', async () => {
    console.log('Generating weekly reports...');
    // Weekly report generation logic
  });
  
  // Generate monthly reports (first day of month at midnight)
  cron.schedule('0 0 1 * *', async () => {
    console.log('Generating monthly reports...');
    // Monthly report generation logic
  });
  
  // Check for inactive streamers (daily at 9 AM)
  cron.schedule('0 9 * * *', async () => {
    console.log('Checking for inactive streamers...');
    // Inactivity check logic
  });
  
  console.log('Scheduled tasks set up successfully');
}

// Initialize bot
async function initBot() {
  try {
    // Connect to database
    await connectDB();
    
    // Load commands and events
    const commands = await loadCommands();
    await registerCommands(commands);
    await loadEvents();
    
    // Setup scheduled tasks
    setupScheduledTasks();
    
    // Login to Discord
    await client.login(process.env.DISCORD_TOKEN);
    
    console.log('Bot initialized successfully!');
  } catch (error) {
    console.error('Error initializing bot:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('SIGINT', async () => {
  console.log('Shutting down bot...');
  await client.destroy();
  process.exit(0);
});

// Start the bot
initBot();

export default client;
