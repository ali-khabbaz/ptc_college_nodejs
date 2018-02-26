(() => {
    'use strict';
    const
        request = require('request'),
        telegraf = require('telegraf'),
        Markup = require('telegraf/markup'),
        bot = new telegraf('_____'),
        weatherAPIKey = '_____',
        commands = ['/weather', '/curreny'];

    let lastCommand;

    main();

    function main() {
        bot.startPolling();
        bot.start(start);
        initCommands();
        onText();
    }
    /**
     * @param  {Object} ctx
     * @description ارسال دستورها
     */
    function start(ctx) {
        return ctx.reply('من خیلی کارا میتونم بکنم ، ولی فعلا در همین حد کفایت میکنه 😜',
            Markup
            .keyboard(commands)
            .resize()
            .extra()
        )
    }

    function initCommands() {
        bot.command('weather', weatherCommand);
        bot.command('curreny', currenyCommand);
    }

    function onText() {
        bot.on('text', onText);

        async function onText(ctx) {
            if (lastCommand === 'weather') {
                const data = await getWeather(ctx.update.message.text);
                if (data) {
                    return ctx.reply(`${data.province}  ${data.city}
                                    اوضاع : ${data.weatherText}
                                    دما : ${data.temperature}`);
                }
                return ctx.reply(`اینجا کدوم قبرستونی بود عزیز دلم`);
            }
            ctx.reply('مثل بچه آدم، یکی از گزینه های پیش رویت استفاده کن گلم 😒');
        }
    }

    function currenyCommand(ctx) {
        lastCommand = 'curreny';
        return ctx.reply(`در حال افزایش است،
         خیالت راحت، 
         بشین کد تو بزن، به این چیزا چکار داری ؟`);
    }

    function weatherCommand(ctx) {
        lastCommand = 'weather';
        return ctx.reply('کدوم شهری عزیزم؟');
    }

    async function getWeather(city) {
        try {
            const body = await getLocationId(city);
            return await getCurrentCondition(body);
        } catch (err) {
            return null;
        }
    }

    function getLocationId(city) {
        return new Promise((resolve, reject) => {
            city = encodeURIComponent(city);

            const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${weatherAPIKey}&q=${city}&language=fa-ir`;

            request(url, requestDone);

            function requestDone(error, response, body) {
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