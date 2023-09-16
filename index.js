const { JSONSchemaDB } = require('@tfagaming/jsondb');
const { time, wait } = require('./functions');
const { CommandsHandler, EventsHandler } = require('horizon-handler');
require('colors');
const config = require("./config.js");
const projectVersion = require('./package.json').version || "v0.0.0";
const { readdirSync } = require('fs');
require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require('discord.js');

const client = new Client({
    intents: [
        Object.keys(GatewayIntentBits)
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ],
    presence: {
        activities: [{
            name: "DM me to create a mail!",
            type: 1,
            url: "https://www.youtube.com/watch?v=e0IrQtaJrBI"
        }]
    },
    shards: "auto"
});

const db = {
    bans: new JSONSchemaDB('./JSON/bans.json', {
        automaticId: true,
        uneditableId: true
    }),
    mails: new JSONSchemaDB('./JSON/mails.json', {
        automaticId: true,
        uneditableId: true
    })
};

const collection = {
    commands: new Collection()
};

console.log(`Modmail Farhan Store `.underline.blue + `version ${projectVersion}, by Farhan Store.
`.underline.cyan);

require('http').createServer((_req, res) => res.end('The express site is ready.') && console.log('Express is ready!'.green)).listen(3030);

client.login(config.client.token || process.env.CLIENT_TOKEN).catch((e) => {
    console.error('Unable to connect to the bot, this might be an invalid token or missing required intents!\n', e);
});

const commandshandler = new CommandsHandler('./commands/', false);
const eventshandler = new EventsHandler('./events/', false);

commandshandler.on('fileLoad', (command) => console.log('Loaded new command: ' + command.name));
eventshandler.on('fileLoad', (event) => console.log('Loaded new event: ' + event));

module.exports = {
    client,
    db,
    collection,
    commandshandler,
    eventshandler
};

(async () => {
    await commandshandler.load(collection.commands);

    await eventshandler.load(client, (file) => `Loaded new event: ${file}`.green);
})();

process.on('unhandledRejection', (reason, promise) => {
    console.error("[ANTI-CRASH] An error has occured and been successfully handled: [unhandledRejection]".red);
    console.error(promise, reason);
});

process.on("uncaughtException", (err, origin) => {
    console.error("[ANTI-CRASH] An error has occured and been successfully handled: [uncaughtException]".red);
    console.error(err, origin);
});

