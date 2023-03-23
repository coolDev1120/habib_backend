const db = require("../models");
const Contact = db.contact;

exports.add = async function (req, res, next) {
	Contact.create(req.body)
	res.send({ flag: "success" })
}


exports.get = async function (req, res, next) {
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
				option = option + ` ${req.body.option[i].name} = '${req.body.option[i].value}' `
			}
		}
	}

	var start = perpage * (current - 1);
	if (!search) { search = ''; }
	order == 'descend' ? order = 'desc' : order = 'asc';

	var total = await db.sequelize.query(
		`select count(id) as total from contacts 
		where ${option} (customer_name like '%${search}%' or address like '%${search}%' or postcode like '%${search}%' or phone like '%${search}%')`,
		{ type: db.Sequelize.QueryTypes.SELECT })
	if (total.length > 0) {
		total = total[0].total
	}
	else {
		total = 0
	}

	await db.sequelize.query(
		`select * from contacts 
		where ${option} (customer_name like '%${search}%' or address like '%${search}%' or postcode like '%${search}%' or phone like '%${search}%') 
		ORDER BY ${field} ${order} limit ${start}, ${perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result, total: total });
		});
}


exports.delete = async function (req, res, next) {
	await db.sequelize.query(`DELETE FROM contacts WHERE id = '${req.body.id}' `)
	res.send({ flag: "success" });
}

exports.getByid = async function (req, res, next) {
	await db.sequelize.query(
		`select * from contacts where id = ${req.body.id}`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result });
		});
}

exports.edit = async function (req, res, next) {
	console.log(req.body)
	const result = await Contact.findOne({ where: { id: req.body.id } });
	result.update(req.body.value);
	res.send({ flag: "success" })
}





