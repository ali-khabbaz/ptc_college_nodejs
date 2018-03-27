'use strict';
const token = '433529977:AAHJZ2YIZ5rkndHn7uZ5_Xx1uRiK5PZblvM',
    TelegramBot = require('telegram-bot-api.js').default,
    bot = new TelegramBot(token, {
        autoChatAction: true,
        autoUpdate: true
    });

function onMessage() {
    return new Promise((resolve) => {
        bot.on('update.message', (msg) => {
            resolve(msg);
            onMessage();
        });
    });
}

module.exports = {
    onMessage
};