const db = require("../models");
const Event = db.event;

exports.addevent = async function (req, res, next) {
	console.log(req.body)
	var params = req.body.data;
	params.email = req.body.email;
	Event.create(params)
	res.send({ flag: "success" })
}


exports.getevent = async function (req, res, next) {
	await db.sequelize.query(
		`select * from events`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result });
		});
}


exports.deleteevent = async function (req, res, next) {
	await db.sequelize.query(`DELETE FROM events WHERE id = '${req.body.id}' `)
	res.send({ flag: "success" });
}

exports.geteventByid = async function (req, res, next) {
	await db.sequelize.query(
		`select * from events where id = ${req.body.id}`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result });
		});
}

exports.editevent = async function (req, res, next) {
	var params = req.body.data;
	params.email = req.body.email;

	const result = await Event.findOne({ where: { id: req.body.id } });
	console.log(result)
	result.update(params);
	res.send({ flag: "success" })
}

exports.test = async function (req, res, next) {
	res.send({ flag: "success" })
}





