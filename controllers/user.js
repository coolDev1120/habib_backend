const db = require("../models");

exports.getusers = async function (req, res, next) {
	await db.sequelize.query(`SELECT * FROM users`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ flag: "success", data: result });
		})
		.catch(err => {
			console.log(err)
		});
}









