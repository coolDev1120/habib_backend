const db = require("../models");
const Task = db.task;

exports.addtask = async function (req, res, next) {
	console.log(req.body)
	Task.create(req.body)
	res.send({ flag: "success" })
}


exports.gettask = async function (req, res, next) {
	console.log(req.body)
	var current = req.body.current;
	var perpage = req.body.perpage;
	var search = req.body.search;
	var order = req.body.order;
	var field = req.body.field;
	var option = '';

	for (let i = 0; i < req.body.option.length; i++) {
		if (req.body.option[i].value) {
			if (i == 0) {
				option = ` ${req.body.option[i].name} = '${req.body.option[i].value}' AND `
			}
			else {
				option = option + ` ${req.body.option[i].name} = '${req.body.option[i].value}' AND `
			}
		}
	}

	var start = perpage * (current - 1);
	if (!search) { search = ''; }
	order == 'descend' ? order = 'desc' : order = 'asc';

	var total = await db.sequelize.query(
		`select count(task_id) as total from tasks 
		where ${option} (responsible like '%${search}%')`,
		{ type: db.Sequelize.QueryTypes.SELECT })

	total.length > 0 ? total = total[0].total : total = 0;

	await db.sequelize.query(
		`select * from tasks 
		where ${option} (responsible like '%${search}%') ORDER BY ${field} ${order} limit ${start}, ${perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result, total: total });
		});
}


exports.deletetask = async function (req, res, next) {
	await db.sequelize.query(`DELETE FROM tasks WHERE task_id = '${req.body.id}' `)
	res.send({ flag: "success" });
}

exports.gettaskByid = async function (req, res, next) {
	await db.sequelize.query(
		`select * from tasks where task_id = ${req.body.id}`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result });
		});
}

exports.edittask = async function (req, res, next) {
	const result = await Task.findOne({ where: { task_id: req.body.id } });
	result.update(req.body.value);
	res.send({ flag: "success" })
}

exports.test = async function (req, res, next) {
	res.send({ flag: "success" })
}





