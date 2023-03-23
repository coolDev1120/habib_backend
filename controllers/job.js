const db = require("../models");
const Job = db.job;

exports.addjob = async function (req, res, next) {
	console.log(req.body)
	Job.create(req.body)
	res.send({ flag: "success" })
}


exports.getjobs = async function (req, res, next) {
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
		`select count(job_id) as total from jobs 
		where ${option} (title like '%${search}%' or contact like '%${search}%' or category like '%${search}%' or status like '%${search}%' or postcode like '%${search}%' or email like '%${search}%' or responsible like '%${search}%' or quoted like '%${search}%')`,
		{ type: db.Sequelize.QueryTypes.SELECT })
		
	total.length > 0 ? total = total[0].total : total = 0;

	await db.sequelize.query(
		`select * from jobs 
		where ${option} (title like '%${search}%' or contact like '%${search}%' or category like '%${search}%' or status like '%${search}%' or postcode like '%${search}%' or email like '%${search}%' or responsible like '%${search}%' or quoted like '%${search}%') ORDER BY ${field} ${order} limit ${start}, ${perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result, total: total });
		});
}


exports.deletejob = async function (req, res, next) {
	await db.sequelize.query(`DELETE FROM jobs WHERE job_id = '${req.body.id}' `)
	res.send({ flag: "success" });
}

exports.getjobByid = async function (req, res, next) {
	await db.sequelize.query(
		`select * from jobs where job_id = ${req.body.id}`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result });
		});
}

exports.editjobs = async function (req, res, next) {
	const result = await Job.findOne({ where: { job_id: req.body.id } });
	result.update(req.body.value);
	res.send({ flag: "success" })
}

exports.test = async function (req, res, next) {
	res.send({ flag: "success" })
}





