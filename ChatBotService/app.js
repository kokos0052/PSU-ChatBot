const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
const { predict } = require("./controllers/model");
const { getResponses } = require("./controllers/trainigData");

dotenv.config();

const botToken = process.env.BOT_TOKEN;

const bot = new TelegramBot(botToken, { polling: true });
const app = express();

const webAppUrl = "https://www.google.com/";

app.use(express.json());
app.use(cors());

function processMessage(message) {
  const prediction = predict(message);
  const responses = getResponses();

  let response;

  if (prediction in responses) {
    response = responses[prediction];
  } else {
    response = "Извините, не могу понять ваше сообщение. Попробуйте обратиться на кафедру для получения данной информации."
  }

  return response;
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/config") {
    await bot.sendMessage(
      chatId,
      "Ниже появится кнопка, заполните форму для входа",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Заполнить форму", web_app: { url: webAppUrl } }],
          ],
        },
      }
    );
  }

  const response = processMessage(text);

  await bot.sendMessage(chatId, response);
});
