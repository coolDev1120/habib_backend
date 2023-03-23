const db = require("../models");
const Material = db.material;

exports.addmaterial = async function (req, res, next) {
	console.log(req.body)
	Material.create(req.body)
	res.send({ flag: "success" })
}


exports.getmaterial = async function (req, res, next) {
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
		`select count(material_id) as total from materials 
		where ${option} (title like '%${search}%' or category like '%${search}%' or subcategory like '%${search}%' or subsubcategory like '%${search}%' or status like '%${search}%')`,
		{ type: db.Sequelize.QueryTypes.SELECT })

	total.length > 0 ? total = total[0].total : total = 0;

	await db.sequelize.query(
		`select * from materials 
		where ${option} (title like '%${search}%' or category like '%${search}%' or subcategory like '%${search}%' or subsubcategory like '%${search}%' or status like '%${search}%') ORDER BY ${field} ${order} limit ${start}, ${perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result, total: total });
		});
}


exports.deletematerial = async function (req, res, next) {
	await db.sequelize.query(`DELETE FROM materials WHERE material_id = '${req.body.id}' `)
	res.send({ flag: "success" });
}

exports.getmaterialByid = async function (req, res, next) {
	await db.sequelize.query(
		`select * from materials where material_id = ${req.body.id}`, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result });
		});
}

exports.editmaterial = async function (req, res, next) {
	const result = await Material.findOne({ where: { material_id: req.body.id } });
	result.update(req.body.value);
	res.send({ flag: "success" })
}

exports.test = async function (req, res, next) {
	res.send({ flag: "success" })
}





