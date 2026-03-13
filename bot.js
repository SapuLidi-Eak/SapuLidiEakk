import "dotenv/config";
import { Client, GatewayIntentBits, Collection, Events } from "discord.js";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { handleInteraction } from "./handlers/interactions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  if (command?.data && command?.execute) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Loaded command: ${command.data.name}`);
  }
}

// Ready
client.once(Events.ClientReady, (c) => {
  console.log(`\n🤖 Bot online sebagai: ${c.user.tag}`);
  console.log(`🌐 Website: ${process.env.WEBSITE_URL}`);
  console.log(`🔑 Siap menerima interaksi!\n`);
  c.user.setPresence({
    activities: [{ name: "KingVypers Premium 👑" }],
    status: "online",
  });
});

// Slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`❌ Error command ${interaction.commandName}:`, error);
      const reply = { content: "❌ Terjadi error. Coba lagi nanti.", flags: 64 };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply).catch(() => {});
      } else {
        await interaction.reply(reply).catch(() => {});
      }
    }
  } else {
    // Handle buttons & modals
    await handleInteraction(interaction, client);
  }
});

client.login(process.env.DISCORD_TOKEN);
