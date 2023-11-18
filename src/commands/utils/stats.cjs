const db = require('@/utils/getDB.cjs');
const { createEmbed } = require('utilscord');

/** @param {import("discord.js").Message} message */
module.exports.run = async (message) => {
	const embedBuilder = () => createEmbed(message.author);
	/** @type {import("@/typings/index").DiscordAPIUserToken[] | null} */
	const users = await db.get('oauth') ?? [];

	const finalEmbed = embedBuilder()
		.setDescription(`Şu an veritabanında \` ${users.length} \` kullanıcı bulunuyor.`);

	message.reply({ embeds: [finalEmbed] });
};

module.exports.help = {
	name: 'stats',
	description: '',
};