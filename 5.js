(() => {
    'use strict';
    const token = '____',
        request = require('request'),
        TelegramBot = require('telegram-bot-api.js').default,
        weatherAPIKey = '____',
        commands = ['/start', '/weather', '/currency'],
        bot = new TelegramBot(token, {
            autoChatAction: true,
            autoUpdate: true
        });

    main();

    function main() {
        onMessage();
    }
    /**
     * @description به ازای دریافت هر پیامی اجرا میشود و به ازای کمند یا متن بودن پاسخ مناسبی می دهد
     */
    function onMessage() {
        let lastCommnd;
        bot.on('update.message', (msg) => {
            if (isCommand(msg)) {
                lastCommnd = updateLastCommand(msg, commands, lastCommnd);
                runCommand(msg, lastCommnd);
            } else {
                runMessage(msg, lastCommnd);
            }
        });
    }
    /**
     * @description تنها بررسی می کند که آیا پیام دریافتی جزه دستورهای تعریف شده است یا نه
     * @param {Object} msg پیام دریافتی از کاربر
     */
    function isCommand(msg) {
        if (msg.entities) {
            if (msg.entities[0].type === 'bot_command') {
                return true;
            }
        }
        return false;
    }
    /**
     * @description بروزرسانی آخرین دستور دریافتی از کاربر
     * @param {Object} msg 
     * @param {String[]} commands لیست دستورات تعریف شده
     * @param {String} lastCommnd آخرین دستور دریافت شده
     */
    function updateLastCommand(msg, commands, lastCommnd) {
        if (commands.indexOf(msg.text) > -1) {
            return msg.text;
        }
        return lastCommnd;
    }
    /**
     * @description پاسخ مناسب به دستور دریافت شده از کاربر
     * @param {Object} msg 
     * @param {String} lastCommnd
     */
    function runCommand(msg, lastCommnd) {
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
    }
    /**
     * @description پاسخ به دستور شروع
     * @param {Object} msg
     */
    function startCommand(msg) {
        bot.sendMessage({
            chat_id: msg.chat.id,
            text: `این دو دستور دسترس شماست 
            /weather
            /currency`
        });
    }
    /**
     * @description پاسخ به دستور ارز
     * @param {Object} msg
     */
    function currencyCommand(msg) {
        bot.sendMessage({
            chat_id: msg.chat.id,
            text: `در حال افزایش است،
            خیالت راحت، 
            بشین کد تو بزن، به این چیزا چکار داری ؟`
        });
    }
    /**
     * @description پاسخ به دستور آب و هوا
     * @param {Object} msg
     */
    function weatherCommand(msg) {
        bot.sendMessage({
            chat_id: msg.chat.id,
            text: 'کدوم شهری عزیزم؟'
        });
    }
    /**
     * @description پاسخ مناسب به پیام دریافت شده از کاربر
     * @param {Object} msg 
     * @param {String} lastCommnd
     */
    function runMessage(msg, lastCommnd) {
        switch (lastCommnd) {
            case '/weather':
                weatherMessage(msg);
                break;

            default:
                startCommand(msg);
                break;
        }
    }
    /**
     * @description دریافت نام شهر و ارسال اطلاعات آب و هوا
     * @param {Object} msg 
     * @param {String} lastCommnd
     */
    async function weatherMessage(msg, lastCommnd) {
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
    }
    /**
     * @description دریافت آب و هوا از api
     * @param {String} city
     */
    async function getWeather(city) {
        try {
            const body = await getLocationId(city);
            return await getCurrentCondition(body);
        } catch (err) {
            return null;
        }
    }
    /**
     * @description دریافت شناسه شهر
     * @param {String} city
     */
    function getLocationId(city) {
        return new Promise((resolve, reject) => {
            city = encodeURIComponent(city);

            const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${weatherAPIKey}&q=${city}&language=fa-ir`;

            request(url, requestDone);

            function requestDone(error, response, body) {
                console.log('*******', body);
                if (error) {
                    return reject(error);
                }
                body = JSON.parse(body)[0];

                if (!body) {
                    return reject('city not found');
                }
                return resolve({
                    key: body.Key,
                    city: body.LocalizedName,
                    province: body.AdministrativeArea.LocalizedName
                });
            }
        });
    }
    /**
     * @description دریافت آب و هوا از api
     * @param {Object} data
     */
    function getCurrentCondition(data) {
        return new Promise((resolve, reject) => {

            const url = `http://dataservice.accuweather.com/currentconditions/v1/${data.key}?apikey=${weatherAPIKey}&language=fa-ir&details=false`;

            request(url, requestDone);

            function requestDone(error, response, body) {
                if (error) {
                    return reject(error);
                }
                body = JSON.parse(body)[0];

                if (!body) {
                    return reject('error');
                }

                data.weatherText = body.WeatherText;
                data.temperature = body.Temperature.Metric.Value;
                return resolve(data);
            }
        });
    }
})();