// @ts-check

const { consola } = require('consola');
const { Client, IntentsBitField, Collection } = require('discord.js');
const glob = require('glob').glob;

const bot = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.MessageContent,
	],
	allowedMentions: {
		parse: ['everyone', 'roles', 'users'],
	},
});

// @ts-ignore
bot.commands = new Collection();

async function registerCommands() {
	const commandFiles = await glob('**/*.{cjs, js}', {
		cwd: './src/commands',
	});
	for await (const commandFile of commandFiles) {
		const command = require(`./commands/${commandFile}`);
		if (!('help' in command && 'run' in command)) continue;

		// @ts-ignore
		bot.commands.set(command.help.name, command);
		consola.info(`"${command.help.name}" adlı komut başarıyla yüklendi.`);
	}
}

async function registerEvents() {
	const eventFiles = await glob('*.{cjs, js}', { cwd: './src/events' });
	for await (const eventFile of eventFiles) {
		const event = require(`./events/${eventFile}`);
		if (!('category' in event && 'run' in event)) continue;

		bot.on(event.category, (...args) => event.run(...args));
		consola.info(`"${event.category}" adlı etkinlik başarıyla yüklendi.`);
	}
}

async function start() {
	await registerEvents();
	await registerCommands();
	await bot.login(process.env.DISCORD_TOKEN);
}

module.exports = {
	bot,
	start,
};
