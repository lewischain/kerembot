// @ts-check

const express = require('express');
const app = express();
const { consola } = require('consola');
const db = require('./utils/getDB.cjs');

function start() {
	app.get('/login', async (req, res) => {
		const code = req.query['code'];

		const oauthPost = await fetch('https://discordapp.com/api/oauth2/token', {
			method: 'POST',
			body: new URLSearchParams({
				client_id: process.env.DISCORD_ID,
				client_secret: process.env.DISCORD_SECRET,
				code: code.toString(),
				grant_type: 'authorization_code',
				redirect_uri: process.env.REDICET_URI,
				scope: 'identify guilds.join',
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		/** @type {import("@/typings/index").DiscordAPIUserToken} */
		const oauthData = await oauthPost.json();
		const userResult = await fetch('https://discordapp.com/api/users/@me', {
			headers: {
				authorization: `${oauthData.token_type} ${oauthData.access_token}`,
			},
		});

		/** @type {import("@/typings/index").DiscordAPIUser} */
		const userInfo = await userResult.json();
		/** @type {import("@/typings/index").DiscordAPIUserToken[] | null} */
		const authDatas = await db.get('oauth') ?? [];

		if (authDatas.find((data) => data.access_token === oauthData.access_token)) return;

		db.set('oauth', [{ ...oauthData, id: userInfo.id }, ...authDatas]);
		consola.info(`${userInfo.global_name} (@${userInfo.username}) adlı kullanıcı sisteme eklendi.`);

		res.send('hello world');
	});

	app.listen(process.env.EXPRESS_PORT, () =>
		consola.success('Port dinlemesi başarıyla aktif!'),
	);
}

module.exports = {
	start,
};
