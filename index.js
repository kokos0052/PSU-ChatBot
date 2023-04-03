const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
const getAnswer = require("./classifier");

dotenv.config();

const botToken = process.env.BOT_TOKEN;

const bot = new TelegramBot(botToken, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async(msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    const answer = getAnswer(text);

    await bot.sendMessage(chatId, answer);
})
