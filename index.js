const express = require('express');
const fs = require('fs');
const path = require('path');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    getContentType,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys');

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const P = require('pino');
const config = require('./config');
const chalk = require('chalk');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const { commands } = require('./command');
const axios = require('axios');
const { File } = require('megajs');

const app = express();
const port = process.env.PORT || 8000;

const ownerNumber = [config.OWNER_NUMBER];
const ownerName = config.OWNER_NAME;
const botMode = config.MODE;
const prefix = config.PREFIX;

//=================== SESSION-AUTH =============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
    if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
    const sessdata = config.SESSION_ID;
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
    filer.download((err, data) => {
        if (err) throw err;
        fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
            console.log("Session downloaded ✅");
        });
    });
}

//==================== CONNECT TO WHATSAPP ===========================
async function connectToWA() {
    console.log(chalk.green("ᴍᴀʀɪᴀ-ᴍᴅ ᴄᴏɴɴᴇᴄᴛɪɴɢ..."));

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
    });

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log("Scan this QR Code to connect:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                console.log("🔄 Reconnecting...");
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log(chalk.green('ᴍᴀʀɪᴀ-ᴍᴅ ᴘʟᴜɢɪɴs ɪɴsᴛᴀʟʟɪɴɢ ᴘʟᴇᴀsᴇ ʙᴇ ᴘᴀᴛɪᴇɴᴛ...'));
            let pluginCount = 0;
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() === ".js") {
                    require("./plugins/" + plugin);
                    pluginCount++;
                }
            });
            console.log(chalk.green(`✅ ᴍᴀʀɪᴀ-ᴍᴅ ᴘʟᴜɢɪɴs ɪɴsᴛᴀʟʟᴇᴅ: ${pluginCount}`));
            console.log(chalk.green('🤖 ᴍᴀʀɪᴀ-ᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ ✅'));

            let statusMessage = `
*Mᴀʀɪᴀ-ᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ ✅*\n\n` +

                `ᴏᴡɴᴇʀ ɴᴀᴍᴇ: ʟᴏʀᴅ ᴀʙʙʏ ᴛᴇᴄʜ\n\n` +
                
                `ᴘʀᴇғɪx: ${prefix || "#"}\n\n` +
                
                `ᴜsᴇʀ: ${conn.user?.id || "Unknown"}\n\n` +
                
                `ᴄᴜʀʀᴇɴᴛ ᴅᴀᴛᴇ: ${new Date().toLocaleString()}\n\n` +
                
                `ᴘʟᴜɢɪɴs: ${pluginCount}\n\n` +
                
                `ᴘʟᴇᴀsᴇ ғᴏʟʟᴏᴡ ᴜs ᴏɴ:\n\n` +
                
                `ᴡʜᴀᴛsᴀᴘᴘ: https://whatsapp.com/channel/0029VahOucpCcW4s1Zk3O61A\n\n` +
                
                `ʏᴏᴜᴛᴜʙᴇ: youtube.com/abbybots141\n\n` +
                
                `ᴛʜᴀɴᴋ ʏᴏᴜ ғᴏʀ ᴄʜᴏᴏsɪɴɢ ᴍᴀʀɪᴀ-ᴍᴅ ɪ ʜᴏᴘᴇ ʏᴏᴜ ᴅᴏ ʜᴀᴠᴇ ᴀ ɢʀᴇᴀᴛ ᴛɪᴍᴇ\n\n` +
                
                `© ᴀʙʙʏ-ᴛᴇᴄʜ`;

            conn.sendMessage(config.OWNER_NUMBER + "@s.whatsapp.net", {
                text: statusMessage
            });
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (mek) => {
        try {
            mek = mek.messages[0];
            if (!mek.message) return;
            mek.message = (getContentType(mek.message) === 'ephemeralMessage')
                ? mek.message.ephemeralMessage.message
                : mek.message;

            if (mek.key && mek.key.remoteJid === 'status@broadcast') return;

            const m = sms(conn, mek);
            const from = mek.key.remoteJid;
            const body = m.text || "";
            const isCmd = body.startsWith(prefix);
            const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
            const args = body.trim().split(/ +/).slice(1);
            const q = args.join(' ');

            const isGroup = from.endsWith('@g.us');
            const sender = mek.key.fromMe
                ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id)
                : (mek.key.participant || mek.key.remoteJid);
            const senderNumber = sender.split('@')[0];
            const botNumber = conn.user.id.split(':')[0];
            const pushname = mek.pushName || 'No Name';
            const isOwner = config.OWNER_NUMBER.includes(senderNumber) || botNumber.includes(senderNumber);

            const reply = (text) => {
                conn.sendMessage(from, { text }, { quoted: mek });
            };

            // ✅ React to Owner Messages
            if (senderNumber === config.OWNER_NUMBER) {
                conn.sendMessage(from, { react: { text: "🌟", key: mek.key } });
            }

            // ✅ JavaScript Execution with "$"
            if (body.startsWith("$") && isOwner) {
                try {
                    let result = await eval(body.slice(1));
                    if (typeof result !== "string") result = util.inspect(result);
                    reply(result);
                } catch (err) {
                    reply(`Error: ${err.message}`);
                }
            }
        } catch (err) {
            console.error("❌ Error processing message:", err);
        }
    });
}

//==================== EXPRESS SERVER ===========================
app.get("/", (req, res) => {
    res.send("Maria-MD is running!");
});

app.listen(port, () => {
    console.log(`🚀 Server running on: http://localhost:${port}`);
});

//==================== START BOT ===========================
setTimeout(() => {
    connectToWA();
}, 4000);