const { JSON } = require("sequelize");
const db = require("../models");
const Tutor_contact = db.tutor_contact;
const User1 = db.user;
const Message = db.message
const { Op } = require("sequelize");

exports.getMessages = async function (req, res, next) {
	var message = await db.sequelize.query(
		`SELECT u.username, u.email, u.image, m.createdAt, m.message FROM 
		(SELECT * FROM
		(SELECT a.email AS email, a.createdAt, a.message FROM messages a , users b WHERE a.emailTo = b.email AND a.email = "${req.body.email}" OR a.emailTo = "${req.body.email}"   UNION 
		SELECT a.emailTo AS email,a.createdAt, a.message FROM messages a , users b WHERE a.emailTo = b.email AND a.email = "${req.body.email}" OR a.emailTo = "${req.body.email}" ORDER BY createdAt DESC) AS result
		WHERE result.email != "${req.body.email}"
		GROUP BY result.email) AS m , users AS u 
		WHERE m.email = u.email `,
		{ type: db.Sequelize.QueryTypes.SELECT })

	var unread = await db.sequelize.query(
		`SELECT email, SUM(unread) AS unread FROM messages WHERE emailTo = "${req.body.email}" GROUP BY email`,
		{ type: db.Sequelize.QueryTypes.SELECT })

	var temp = {}
	for (const i in unread) {
		temp[unread[i].email] = unread[i].unread
	}
	res.send({ flag: "success", data: message, unread: temp });
}


exports.getChatList = async function (req, res, next) {
	await db.sequelize.query(
		`SELECT * FROM messages WHERE (email = "${req.body.me}" AND emailTo = "${req.body.email}") OR email = "${req.body.email}" AND emailTo = "${req.body.me}" ORDER BY createdAt`,
		{ type: db.Sequelize.QueryTypes.SELECT })
		.then((result) => {
			if (!result) {
				res.send({ flag: "no" });
				return
			}
			res.send({ flag: "success", data: result });
		})
		.catch(err => {
			console.log(err)
		});
}

exports.saveMessage = async function (req, res, next) {
	const user = await User1.findOne({ where: { email: req.body.email } });
	const userTo = await User1.findOne({ where: { email: req.body.emailTo } });

	var message = {
		email: req.body.email,
		emailTo: req.body.emailTo,
		message: req.body.message,
		user: user.username,
		userTo: userTo.username,
		unread: 1
	}
	Message.create(message)
	res.send({ flag: "success" })
}

exports.readallmessages = async function (req, res, next) {
	await db.sequelize.query(`UPDATE messages SET unread = 0 WHERE email = "${req.body.email}" AND emailTo = "${req.body.me}" `)
}






