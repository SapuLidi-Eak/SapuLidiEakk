import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionFlagsBits,
    ChannelSelectMenuBuilder,
    ChannelType,
} from "discord.js";

// Map temporary untuk nyimpen memori admin mau kirim ke channel mana sebelum modal muncul
export const pendingEmbedTargets = new Map();

export default {
    data: new SlashCommandBuilder()
        .setName("send-embed")
        .setDescription("📢 Kirim pesan Embed keren ke channel tertentu (Admin only)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((opt) =>
            opt
                .setName("channel")
                .setDescription("Channel tujuan tempat pesan akan dikirim")
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(true)
        ),

    async execute(interaction) {
        const targetChannel = interaction.options.getChannel("channel");

        // Simpan target channel sementara memakai ID user yang mengeksekusi
        pendingEmbedTargets.set(interaction.user.id, targetChannel.id);

        const modal = new ModalBuilder()
            .setCustomId("modal_custom_embed")
            .setTitle(`Kirim Pengumuman ke #${targetChannel.name}`);

        const titleInput = new TextInputBuilder()
            .setCustomId("embed_title")
            .setLabel("Judul Pengumuman (Opsional)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Contoh: 👑 UPDATE TERBARU KINGVYPERS")
            .setRequired(false)
            .setMaxLength(256);

        const descInput = new TextInputBuilder()
            .setCustomId("embed_desc")
            .setLabel("Isi Pesan / Deskripsi")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Masukkan pesan kamu di sini... (mendukung format Discord seperti **tebal**, dll)")
            .setRequired(true)
            .setMaxLength(3999);

        const colorInput = new TextInputBuilder()
            .setCustomId("embed_color")
            .setLabel("Warna (Hex Code) Opsional")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Contoh: #5865F2, #FF0000. Kosongkan untuk default Gold.")
            .setRequired(false)
            .setMaxLength(7);

        const imageInput = new TextInputBuilder()
            .setCustomId("embed_image")
            .setLabel("Link URL Gambar (Opsional)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Contoh: https://i.imgur.com/xxx.png")
            .setRequired(false);

        // Add inputs to modal (max 5)
        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(colorInput),
            new ActionRowBuilder().addComponents(imageInput),
        );

        // Show modal to user
        await interaction.showModal(modal);
    },
};
