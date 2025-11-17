export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guild(s)`);
    
    // Set bot activity
    client.user.setActivity('Streamer Management System', { type: 'WATCHING' });
  }
};
