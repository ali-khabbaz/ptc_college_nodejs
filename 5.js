(() => {
    'use strict';
    const token = '433529977:AAHJZ2YIZ5rkndHn7uZ5_Xx1uRiK5PZblvM',
        TelegramBot = require('telegram-bot-api.js').default,
        weatherAPIKey = 'GTyvdN7CUpoAg8b2OnKlmxLg5HGHGHuB',
        commands = ['/start', '/weather', '/currency'],
        bot = new TelegramBot(token, {
            autoChatAction: true,
            autoUpdate: true
        });

    onMessage();


    function onMessage() {
        let lastCommnd;
        bot.on('update.message', (msg) => {
            if (isCommand(msg)) {
                lastCommnd = updateLastCommand(msg, commands, lastCommnd);
                runCommand(msg, lastCommnd);
            } else {

            }
        });
    }

    function isCommand(msg) {
        if (msg.entities) {
            if (msg.entities[0].type === 'bot_command') {
                return true;
            }
        }
        return false;
    }

    function updateLastCommand(msg, commands, lastCommnd) {
        if (commands.indexOf(msg.text) > -1) {
            return msg.text;
        }
        return lastCommnd;
    }

    function runCommand(msg, lastCommnd) {
        switch (lastCommnd) {
            case '/currency':
                currencyCommand(msg);
                break;

            case '/weather':
                currencyCommand(msg);
                break;

            default:
                startCommand(msg);
                break;
        }
    }

    function startCommand(msg) {
        bot.sendMessage({
            chat_id: msg.chat.id,
            text: `این دو دستور دسترس شماست 
            /weather
            /currency`
        });
    }

    function currencyCommand(msg) {
        bot.sendMessage({
            chat_id: msg.chat.id,
            text: `در حال افزایش است،
            خیالت راحت، 
            بشین کد تو بزن، به این چیزا چکار داری ؟`
        });
    }
})();