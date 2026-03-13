# 🤖 KingVypers Premium Discord Bot

Bot Discord premium untuk **KingVypers** yang terhubung ke website panel.

## ✨ Fitur

| Tombol | Fungsi |
|--------|--------|
| 🔑 Redeem Key | Verifikasi key premium user |
| 📜 Get Script | Kirim loader script (hanya user yang bisa lihat) |
| 🏅 Get Role | Otomatis kasih role Discord premium |
| 🔄 Reset HWID | Reset hardware ID (cooldown 20 menit) |
| 📊 Get Stats | Lihat info key (status, expire date, HWID) |

## 📁 Struktur

```
bot-discord/
├── bot.js                  # Main entry point
├── deploy-commands.js      # Register slash commands
├── commands/
│   └── panel.js            # Slash command /panel
├── handlers/
│   └── interactions.js     # Handler buttons + modals
├── .env                    # Config (dari .env.example)
├── .env.example            # Template config
└── package.json
```

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Buat file .env
Copy `.env.example` jadi `.env` dan isi semua valuenya:
```bash
copy .env.example .env
```

Isi nilai berikut di `.env`:
```env
DISCORD_TOKEN=      # Token bot dari Discord Developer Portal
CLIENT_ID=          # Application ID dari Discord Developer Portal
GUILD_ID=           # ID server Discord kamu
PREMIUM_ROLE_ID=    # ID role premium di server
WEBSITE_URL=        # URL website kamu (misal: https://kingvypers.up.railway.app)
BOT_SECRET=         # Secret yang sama dengan BOT_SECRET di .env website
LOADER_SCRIPT=      # Script loader kamu
```

### 3. Tambah BOT_SECRET ke website
Di file `.env` website (`KingVyperv2warna`), uncomment dan isi:
```env
BOT_SECRET=isi_secret_rahasia_kamu_disini
```

### 4. Deploy slash commands
```bash
npm run deploy
```

### 5. Jalankan bot
```bash
npm start
```

## 🎮 Cara Pakai

1. Di server Discord, ketik `/panel`
2. Panel embed muncul dengan 5 tombol
3. Klik tombol yang diinginkan
4. Masukkan key premium di modal
5. Bot otomatis proses dan reply (only you can see)

## 🔒 Permission Bot

Pastikan bot punya permission:
- `Send Messages`
- `Use Slash Commands`
- `Manage Roles` ← **WAJIB** untuk fitur Get Role
- `Read Message History`

## ⚠️ Catatan

- Semua reply bersifat **ephemeral** (hanya user yang bisa lihat)
- HWID Reset punya **cooldown 20 menit**
- Bot Secret harus sama antara bot dan website
