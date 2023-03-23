const getDate = require('../component/date')
const db = require("../models");
const Tutor = db.tutor;

exports.about = async function (req, res, next) {
	// const aaa = await db.sequelize.query("select * from tutors");
	const tutor = {
		email: req.body.email,
		subjecttaught: req.body.subjecttaught,
		enlevel: req.body.enlevel,
		teachingexperience: req.body.teachingexperience,
		currentsituation: req.body.currentsituation,
	};

	const history = await Tutor.findOne({ where: { email: req.body.email } });
	if (!history) {
		Tutor.create(tutor)
			.then(data => {
				console.log(data)
			})
			.catch(err => {
				console.log(err)
			});
		res.json({ status: "success", insertx: "insert" });
	}
	else {
		const update = {
			subjecttaught: req.body.subjecttaught,
			enlevel: req.body.enlevel,
			teachingexperience: req.body.teachingexperience,
			currentsituation: req.body.currentsituation,
		}
		await history.update(update);
		res.json({ status: "success", insertx: "update" });
	}
}

exports.getdata = async function (req, res, next) {
	const result = await Tutor.findOne({ where: { email: req.body.email } })
	res.json({ data: result });
}


exports.experience = async function (req, res, next) {
	const tutor = {
		email: req.body.email,
		excompany: req.body.excompany,
		exendDate1: req.body.exendDate1,
		exendDate2: req.body.exendDate2,
		exlocation: req.body.exlocation,
		exsituation: req.body.exsituation,
		exstartDate1: req.body.exstartDate1,
		exstartDate2: req.body.exstartDate2,
		extitle: req.body.extitle,
	};

	const history = await Tutor.findOne({ where: { email: req.body.email } });
	if (!history) {
		Tutor.create(tutor)
			.then(data => {
				console.log(data)
			})
			.catch(err => {
				console.log(err)
			});
		res.json({ status: "success", insertx: "insert" });
	}
	else {
		const update = {
			excompany: req.body.excompany,
			exendDate1: req.body.exendDate1,
			exendDate2: req.body.exendDate2,
			exlocation: req.body.exlocation,
			exsituation: req.body.exsituation,
			exstartDate1: req.body.exstartDate1,
			exstartDate2: req.body.exstartDate2,
			extitle: req.body.extitle,
		}
		await history.update(update);
		res.json({ status: "success", insertx: "update" });
	}
}

exports.education = async function (req, res, next) {
	const tutor = {
		email: req.body.email,
		eddegree: req.body.eddegree,
		eddescription: req.body.eddescription,
		edfieldofstudy: req.body.edfieldofstudy,
		edschool: req.body.edschool,
		edstartDate1: req.body.edstartDate1,
		edstartDate2: req.body.edstartDate2,
	};

	const history = await Tutor.findOne({ where: { email: req.body.email } });
	if (!history) {
		Tutor.create(tutor)
			.then(data => {
				console.log(data)
			})
			.catch(err => {
				console.log(err)
			});
		res.json({ status: "success", insertx: "insert" });
	}
	else {
		const update = {
			eddegree: req.body.eddegree,
			eddescription: req.body.eddescription,
			edfieldofstudy: req.body.edfieldofstudy,
			edschool: req.body.edschool,
			edstartDate1: req.body.edstartDate1,
			edstartDate2: req.body.edstartDate2,
		}
		await history.update(update);
		res.json({ status: "success", insertx: "update" });
	}
}

exports.description = async function (req, res, next) {
	const tutor = {
		email: req.body.email,
		aboutme: req.body.aboutme,
		aboutsubject: req.body.aboutsubject,
	};

	const history = await Tutor.findOne({ where: { email: req.body.email } });
	if (!history) {
		Tutor.create(tutor)
			.then(data => {
				console.log(data)
			})
			.catch(err => {
				console.log(err)
			});
		res.json({ status: "success", insertx: "insert" });
	}
	else {
		const update = {
			aboutme: req.body.aboutme,
			aboutsubject: req.body.aboutsubject,
		}
		await history.update(update);
		res.json({ status: "success", insertx: "update" });
	}
}


exports.price = async function (req, res, next) {
	const tutor = {
		email: req.body.email,
		hourlyRate: req.body.hourlyRate,
	};

	const history = await Tutor.findOne({ where: { email: req.body.email } });
	if (!history) {
		Tutor.create(tutor)
			.then(data => {
				console.log(data)
			})
			.catch(err => {
				console.log(err)
			});
		res.json({ status: "success", insertx: "insert" });
	}
	else {
		const update = {
			hourlyRate: req.body.hourlyRate,
		}
		await history.update(update);
		res.json({ status: "success", insertx: "update" });
	}
}

exports.availability = async function (req, res, next) {
	const tutor = {
		email: req.body.email,
		availability: req.body.availability,
	};

	const history = await Tutor.findOne({ where: { email: req.body.email } });
	if (!history) {
		Tutor.create(tutor)
			.then(data => {
				console.log(data)
			})
			.catch(err => {
				console.log(err)
			});
		res.json({ status: "success", insertx: "insert" });
	}
	else {
		const update = {
			availability: req.body.availability,
		}
		await history.update(update);
		res.json({ status: "success", insertx: "update" });
	}
}

exports.certification = async function (req, res, next) {
	const tutor = {
		email: req.body.email,
		certitle: req.body.certitle,
		cercontent: req.body.cercontent,
	};

	const history = await Tutor.findOne({ where: { email: req.body.email } });
	if (!history) {
		Tutor.create(tutor)
			.then(data => {
				console.log(data)
			})
			.catch(err => {
				console.log(err)
			});
		res.json({ status: "success", insertx: "insert" });
	}
	else {
		const update = {
			certitle: req.body.certitle,
			cercontent: req.body.cercontent,
		}
		await history.update(update);
		res.json({ status: "success", insertx: "update" });
	}
}

exports.done = async function (req, res, next) {
	const history = await Tutor.findOne({ where: { email: req.body.email } });
	const update = { done: "done" }
	await history.update(update);
	res.json({ status: "success", insertx: "update" });
}

exports.gettutors = async function (req, res, next) {
	await db.sequelize.query(`select * from tutors a, users b where a.email = b.email and a.done = "done" `, { type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			res.json({ data: result });
		});
}