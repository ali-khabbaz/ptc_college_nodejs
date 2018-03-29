'use strict';
const {
    bot,
    isCommand,
    updateLastCommand,
    runCommand,
    runMessage
} = require('./bot'), {
        getWeather,
        getLocationId,
        getCurrentCondition
    } = require('./weather'),
    commands = ['/start', '/weather', '/currency'];

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