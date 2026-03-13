import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
} from "discord.js";
import { buildPanelEmbed, buildPanelRows } from "./panel.js";

export default {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("📢 Kirim KingVypers Premium Panel ke channel (Admin only)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((opt) =>
            opt
                .setName("channel")
                .setDescription("Channel tujuan pengiriman panel (default: channel sekarang)")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
        ),

    async execute(interaction) {
        const target = interaction.options.getChannel("channel") ?? interaction.channel;
        await interaction.deferReply({ flags: 64 }); // Tambahkan deferReply karena fetch butuh waktu

        try {
            const embed = await buildPanelEmbed();
            await target.send({
                embeds: [embed],
                components: buildPanelRows(),
            });

            await interaction.editReply({
                content: `✅ Panel berhasil dikirim ke ${target}!`,
            });
        } catch (err) {
            console.error("Setup send error:", err);
            await interaction.editReply({
                content: `❌ Gagal mengirim panel ke ${target}. Pastikan bot punya permission **Send Messages** di channel tersebut.`,
            });
        }
    },
};
