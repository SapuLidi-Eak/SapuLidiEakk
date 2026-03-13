import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    ChannelType,
} from "discord.js";
import fetch from "node-fetch";

// Panel embed builder - bisa dipakai ulang di setup.js juga
export async function buildPanelEmbed() {
    let supportedGamesText = "Memuat daftar game...";
    try {
        const webUrl = (process.env.WEBSITE_URL || "").replace(/\/$/, "");
        const res = await fetch(`${webUrl}/api/game-support`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.items || []);

        if (items.length > 0) {
            // Sort by sortOrder if available
            items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
            supportedGamesText = items.map(g => {
                const name = `**${g.gameName}**`;
                if (g.status === "maintenance") return `🛠️ ${name} *(Maintenance)*`;
                if (g.status === "comingsoon") return `⏳ ${name} *(Coming Soon)*`;
                return `🎮 ${name} *(Ready)*`;
            }).join("\n");
        } else {
            supportedGamesText = "Belum ada data game saat ini.";
        }
    } catch (err) {
        supportedGamesText = "Gagal terhubung ke database server.\n*(Web Server Offline)*";
    }

    return new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({
            name: "KingVypers Premium System",
            iconURL: "https://raw.githubusercontent.com/taurusss1000-design/web/refs/heads/main/Kingvyperslogo.jpg",
        })
        .setTitle("👑  K I N G V Y P E R S  P R E M I U M")
        .setDescription(
            "```\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  PANEL MANAJEMEN KEY PREMIUM\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n```\n" +
            "Selamat datang di sistem premium **KingVypers**!\n" +
            "Gunakan tombol di bawah untuk mengelola akun premium kamu.\n\n" +
            "```yaml\n" +
            "🔑 Redeem Key   → Aktivasi key premium\n" +
            "📜 Get Script   → Download loader script\n" +
            "🏅 Get Role     → Klaim role Discord\n" +
            "🔄 Reset HWID   → Reset hardware ID\n" +
            "📊 Get Stats    → Lihat info key kamu\n" +
            "🔍 Find My Key  → Cek key tersimpan kamu\n" +
            "```"
        )
        .addFields(
            {
                name: "🚀  Supported Games",
                value: supportedGamesText + "\n",
                inline: false,
            },
            {
                name: "⚠️  Perhatian",
                value:
                    "> Semua response bot **hanya bisa dilihat oleh kamu** *(ephemeral)*\n" +
                    "> Jangan share key kamu ke siapapun\n" +
                    "> 1 key hanya bisa digunakan untuk 1 akun Discord",
                inline: false,
            },
            {
                name: "🌐 Website",
                value: `[kingvypers.com](${process.env.WEBSITE_URL || "#"})`,
                inline: true,
            },
            {
                name: "📞 Support",
                value: "Hubungi admin jika ada masalah",
                inline: true,
            }
        )
        .setImage("https://raw.githubusercontent.com/taurusss1000-design/web/refs/heads/main/welcomee.jpg")
        .setFooter({
            text: "KingVypers Premium  •  Powered by KingVypers System",
            iconURL: "https://raw.githubusercontent.com/taurusss1000-design/web/refs/heads/main/Kingvyperslogo.jpg",
        })
        .setTimestamp();
}

export function buildPanelRows() {
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("btn_redeem")
            .setLabel("Redeem Key")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🔑"),
        new ButtonBuilder()
            .setCustomId("btn_getscript")
            .setLabel("Get Script")
            .setStyle(ButtonStyle.Success)
            .setEmoji("📜"),
        new ButtonBuilder()
            .setCustomId("btn_getrole")
            .setLabel("Get Role")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🏅"),
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("btn_resethwid")
            .setLabel("Reset HWID")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🔄"),
        new ButtonBuilder()
            .setCustomId("btn_getstats")
            .setLabel("Get Stats")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("📊"),
        new ButtonBuilder()
            .setCustomId("btn_findmykey")
            .setLabel("Find My Key")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("🔍"),
    );

    return [row1, row2];
}

export default {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("👑 Buka KingVypers Premium Panel (private / hanya kamu)"),

    async execute(interaction) {
        const allowedRoleId = process.env.ALLOWED_ROLE_ID;
        if (allowedRoleId && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            if (!interaction.member.roles.cache.has(allowedRoleId)) {
                return interaction.reply({
                    content: `❌ **Akses Ditolak**\nMaaf, kamu harus memiliki role khusus untuk menggunakan command ini.`,
                    flags: 64
                });
            }
        }

        await interaction.deferReply({ flags: 64 });
        const embed = await buildPanelEmbed();
        await interaction.editReply({
            embeds: [embed],
            components: buildPanelRows(),
        });
    },
};
