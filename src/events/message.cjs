// @ts-check
module.exports = {
	category: 'messageCreate',
	/** @param {import("discord.js").Message} message  */
	run(message) {
		const developers = process.env.DEVELOPERS.split(',');

		if (
			!message.guild ||
            !message.channel.isTextBased() ||
            message.author.bot ||
            !developers.includes(message.author.id)
		) {return;}

		const prefix = `<@${message.client.user.id}>`;
		if (!message.content.startsWith(prefix)) return;

		const params = message.content.slice(prefix.length).trim().split(/ +/g);
		// @ts-ignore
		const command = message.client.commands.get(
			params.shift().toLowerCase(),
		);

		if (command) {
			command.run(message, params);
		}
	},
};
