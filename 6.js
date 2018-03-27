'use strict';

const {
    onMessage
} = require('./bot');

main();

async function main() {
    console.log('msg-----', await onMessage());
    onMessage();
}