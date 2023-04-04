const nodemailer = require('nodemailer')
const db = require("../models");
const Email = db.email;
const Esetting = db.esetting;

exports.sendEmail = async (req, res, next) => {
    var serverInfo =
        await db.sequelize.query(`SELECT b.* FROM users a, esettings b, email_teams c 
                WHERE a.email = '${req.body.email}' AND a.team = c.id AND c.email = b.id`, { type: db.Sequelize.QueryTypes.SELECT })
    serverInfo = serverInfo[0];

    var mailOptions = {
        from: {
            name: req.body.senderName,
            address: serverInfo.email,
        },
        to: req.body.receiver,
        subject: req.body.subject,
        inReplyTo: req.body.inReplyTo,
        references: req.body.inReplyTo,
        html: req.body.message
    };
    console.log(mailOptions)

    const transporter = nodemailer.createTransport({
        name: "thehempcoop.org",
        host: serverInfo.host,
        port: serverInfo.smtp,
        secure: true, // use TLS                
        auth: {
            user: serverInfo.email,
            pass: serverInfo.password,
        },
    })

    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
            res.json({
                success: false,
                flag: "error",
            });
            return;
        } else {
            var selected = {}
            var selected = await Email.findOne({ where: { id: req.body.id } });
            var params = {
                fromName: req.body.senderName,
                fromEmail: selected.toEmail,
                toName: selected.fromName,
                toEmail: selected.fromEmail,
                subject: selected.subject,
                message: req.body.message,
                category: '1',
                accept: req.body.email,
                parentID: req.body.id,
                inReplyTo: selected.messageId,
                messageId: info.messageId,
                mainId: selected.mainId,
                hostname: selected.hostname,
            };
            console.log('param', params)
            await Email.create(params)
            await selected.update({ reply: new Date() });
            res.json({
                success: true,
                flag: "success",
            });
        }
    });
}


exports.sendEmail0 = async (req, res, next) => {
    var serverInfo =
        await db.sequelize.query(`SELECT b.* FROM users a, esettings b, email_teams c 
                WHERE a.email = '${req.body.email}' AND a.team = c.id AND c.email = b.id`, { type: db.Sequelize.QueryTypes.SELECT })
    serverInfo = serverInfo[0];

    var mailOptions = {
        from: {
            name: req.body.senderName,
            address: serverInfo.email,
        },
        to: req.body.receiver,
        subject: req.body.subject,
        inReplyTo: req.body.inReplyTo,
        references: req.body.inReplyTo,
        html: req.body.message
    };
    console.log(mailOptions)

    const transporter = nodemailer.createTransport({
        name: "thehempcoop.org",
        host: serverInfo.host,
        port: serverInfo.smtp,
        secure: true, // use TLS                
        auth: {
            user: serverInfo.email,
            pass: serverInfo.password,
        },
    })

    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
            res.json({
                success: false,
                flag: "error",
            });
            return;
        } else {
            var params = {
                fromName: req.body.senderName,
                fromEmail: serverInfo.email,
                toName: '',
                toEmail: req.body.receiver,
                subject: req.body.subject,
                message: req.body.message,
                category: '1',
                accept: req.body.email,
                messageId: info.messageId,
                mainId: info.messageId,
                hostname: serverInfo.email,
            };
            console.log('param', params)
            await Email.create(params)
            res.json({
                success: true,
                flag: "success",
            });
        }
    });


}



