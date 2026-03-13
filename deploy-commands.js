import "dotenv/config";
import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
    const { default: command } = await import(`./commands/${file}`);
    if (command?.data && command?.execute) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

try {
    console.log(`🔄 Registering ${commands.length} slash command(s)...`);

    const data = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
    );

    console.log(`✅ Berhasil register ${data.length} slash command(s)!`);
} catch (error) {
    console.error("❌ Gagal register commands:", error);
}
