/** @param {import("discord.js").Message} message */
module.exports.run = (message) => {
	message.reply('PONG!');
};

module.exports.help = {
	name: 'ping',
	description: 'Bot\'un websocket gecikmesini öğrenebilirsiniz.',
};