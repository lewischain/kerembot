const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/** @param {import("discord.js").Message} message */
module.exports.run = (message) => {
	const finalEmbed = new EmbedBuilder()
		.setColor(Colors.LuminousVividPink)
		.setTitle('Verify your ages for see nsfw channels');

	const finalButton = new ActionRowBuilder()
		.setComponents(
			new ButtonBuilder()
				.setURL(`https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&redirect_uri=${process.env.REDICET_URI}&response_type=code&scope=identify%20guilds%20guilds.join`)
				.setLabel('Verify me')
				.setStyle(ButtonStyle.Link),
		);

	message.channel.send({ embeds: [finalEmbed], components: [finalButton] });
};

module.exports.help = {
	name: 'verify',
	description: 'Bot\'un websocket gecikmesini öğrenebilirsiniz.',
};