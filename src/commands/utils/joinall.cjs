const db = require('@/utils/getDB.cjs');
const { createEmbed } = require('utilscord');
const { range } = require('discord.js');

/** @param {import("discord.js").Message} message */
module.exports.run = async (message, params) => {
	const embedBuilder = () => createEmbed(message.author);
	/** @type {import("@/typings/index").DiscordAPIUserToken[] | null} */
	const users = await db.get('oauth') ?? [];
	const count = params[0] ?? users.length;

	if (count > users.length) {
		const finalEmbed = embedBuilder()
			.setTitle('❌ İşlem iptal edildi')
			.setDescription(`• Sokmak istediğiniz kullanıcı sayısı çok büyük, en fazla \`${users.length}\` adet sokabilirsiniz.`);

		await message.reply({ embeds: [finalEmbed] });
		return;
	}

	let total = 0;
	let already_here = 0;
	let invalid_access = 0;
	let server_limit = 0;
	let success = 0;

	/**
     *
     * @param {string} accessToken
     * @param {string} guildID
     * @param {string} userID
     * @returns
     */
	async function addToGuild(accessToken, guildID, userID) {
		const response = await fetch(`https://discordapp.com/api/v9/guilds/${guildID}/members/${userID}`, {
			method: 'PUT',
			body: JSON.stringify({
				'access_token': accessToken,
			}),
			headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}`, 'Content-Type': 'application/json' },
		});


		if (response.status == 204) {
			already_here++;
			return;
		}
		const data = await response.json();

		if (data.code == 50025) {
			invalid_access++;
		}

		if (data.code == 30001) {
			server_limit++;
		}

		if (data.user) {
			success++;
		}

		return data;
	}

	const finalEmbed = embedBuilder()
		.setTitle('🚀 İşlem başlatıldı')
		.setDescription(`• İşlem başlatıldı, toplamda \`${count}\` kullanıcı sunucuya girecek.`)
		.setFields([
			{
				name: '🦴 Burada:',
				value: `> ${already_here.toString()}`,
				inline: true,
			},
			{
				name: '✅ Başarılı:',
				value: `> ${success.toString()}`,
				inline: true,
			},
			{
				name: '❌ Başarısız:',
				value: `> ${invalid_access.toString()}`,
				inline: true,
			},
		]);

	const msg = await message.reply({ embeds: [finalEmbed] });

	for await (const number of range(count)) {
		const user = users[number];
		await addToGuild(user.access_token, message.guildId, user.id);
		total++;

		await msg.edit({
			embeds: [
				finalEmbed.setFields([
					{
						name: '🦴 Burada:',
						value: `> ${already_here.toString()}`,
						inline: true,
					},
					{
						name: '✅ Başarılı:',
						value: `> ${success.toString()}`,
						inline: true,
					},
					{
						name: '❌ Başarısız:',
						value: `> ${invalid_access.toString()}`,
						inline: true,
					},
				]),
			],
		});
	}

	console.log({ total, already_here, invalid_access, server_limit, success });

	await msg.edit({
		embeds: [
			finalEmbed
				.setTitle('✅ İşlem sonlandırıldı')
				.setDescription(`• \`${total}\` kullanıcıdan \`${success}\` kullanıcı giriş yaptı.`),
		],
	});
};

module.exports.help = {
	name: 'joinall',
	description: '',
};