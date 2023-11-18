const { consola } = require('consola');

module.exports = {
	category: 'ready',
	run() {
		consola.success('Bot başarıyla Discord\'a bağlandı.');
	},
};