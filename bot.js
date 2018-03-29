'use strict';
const token = '____',
    TelegramBot = require('telegram-bot-api.js').default,
    bot = new TelegramBot(token, {
        autoChatAction: true,
        autoUpdate: true
    }),

    /**
     * @description تنها بررسی می کند که آیا پیام دریافتی جزه دستورهای تعریف شده است یا نه
     * @param {Object} msg پیام دریافتی از کاربر
     */
    isCommand = (msg) => {
        if (msg.entities) {
            if (msg.entities[0].type === 'bot_command') {
                return true;
            }
        }
        return false;
    },

    /**
     * @description بروزرسانی آخرین دستور دریافتی از کاربر
     * @param {Object} msg 
     * @param {String[]} commands لیست دستورات تعریف شده
     * @param {String} lastCommnd آخرین دستور دریافت شده
     */
    updateLastCommand = (msg, commands, lastCommnd) => {
        if (commands.indexOf(msg.text) > -1) {
            return msg.text;
        }
        return lastCommnd;
    },
    /**
     * @description پاسخ مناسب به دستور دریافت شده از کاربر
     * @param {Object} msg 
     * @param {String} lastCommnd
     */
    runCommand = (msg, lastCommnd) => {
        switch (lastCommnd) {
            case '/currency':
                currencyCommand(msg);
                break;

            case '/weather':
                weatherCommand(msg);
                break;

            default:
                startCommand(msg);
                break;
        }
    },
    /**
     * @description پاسخ به دستور شروع
     * @param {Object} msg
     */
    startCommand = (msg) => {
        bot.sendMessage({
            chat_id: msg.chat.id,
            text: `این دو دستور دسترس شماست 
            /weather
            /currency`
        });
    },
    /**
     * @description پاسخ به دستور ارز
     * @param {Object} msg
     */
    currencyCommand = (msg) => {
        bot.sendMessage({
            chat_id: msg.chat.id,
            text: `در حال افزایش است،
            خیالت راحت، 
            بشین کد تو بزن، به این چیزا چکار داری ؟`
        });
    },
    /**
     * @description پاسخ به دستور آب و هوا
     * @param {Object} msg
     */
    weatherCommand = (msg) => {
        bot.sendMessage({
            chat_id: msg.chat.id,
            text: 'کدوم شهری عزیزم؟'
        });
    },
    /**
     * @description پاسخ مناسب به پیام دریافت شده از کاربر
     * @param {Object} msg 
     * @param {String} lastCommnd
     */
    runMessage = (msg, lastCommnd) => {
        switch (lastCommnd) {
            case '/weather':
                weatherMessage(msg);
                break;

            default:
                startCommand(msg);
                break;
        }
    },
    /**
     * @description دریافت نام شهر و ارسال اطلاعات آب و هوا
     * @param {Object} msg 
     * @param {String} lastCommnd
     */
    weatherMessage = async (msg, lastCommnd) => {
        const data = await getWeather(msg.text);
        if (data) {
            return bot.sendMessage({
                chat_id: msg.chat.id,
                text: `${data.province}  ${data.city}
                اوضاع : ${data.weatherText}
                دما : ${data.temperature}`
            });
        }
        return bot.sendMessage({
            chat_id: msg.chat.id,
            text: `اینجا کدوم قبرستونی بود عزیز دلم
            مثل بچه آدم، یکی از گزینه های پیش رویت استفاده کن گلم 😒`
        });
    };



module.exports = {
    bot,
    isCommand,
    updateLastCommand,
    runCommand,
    runMessage
};