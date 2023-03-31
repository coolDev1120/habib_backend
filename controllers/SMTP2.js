const Imap = require('imap');
const imap = require('imap');
const { simpleParser } = require('mailparser');
var mIDs = [];
var emails = [];
const db = require("../models");
const Email = db.email;
const Esetting = db.esetting;

getOne()

setInterval(() => {
    mIDs = []
    emails = []
    getOne()
}, 20000);

async function getOne() {
    const serverInfo = await Esetting.findOne({ where: { status: '1' } });

    var imap = new Imap({
        user: serverInfo.email,
        password: serverInfo.password,
        host: serverInfo.host,
        port: serverInfo.imap,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    imap.connect();

    imap.once('ready', function () {
        imap.openBox('INBOX', function (err) {
            if (err) throw err;

            const fetchOptions = {
                bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
                struct: true,
                envelope: {
                    addresses: true
                },
                markSeen: true
            };
            imap.search(['UNSEEN', ['SINCE', '2022-09-01 20:17:08']], function (err, results) {
                if (err) throw err;

                const messageIds = mIDs = results;

                if (messageIds.length > 0) {
                    const fetch = imap.fetch(messageIds, fetchOptions);

                    fetch.on('message', function (msg) {
                        var email = {
                            senderName: '',
                            senderEmail: '',
                            receiverName: '',
                            receiverEmail: '',
                            date: '',
                            subject: '',
                            message: ''
                        };

                        let headerInfo = '';

                        msg.on('body', function (stream, info) {
                            if (info.which === 'TEXT') {
                                stream.on('data', function (chunk) {
                                    email.message += chunk.toString('utf8');
                                });
                            } else if (info.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)') {
                                stream.once('data', function (chunk) {
                                    headerInfo += chunk.toString('utf8');
                                });
                            }
                        });

                        msg.once('attributes', function (attrs) {
                            email.senderName = attrs.envelope.from[0].name;
                            email.senderEmail = `${attrs.envelope.from[0].mailbox}@${attrs.envelope.from[0].host}`;
                            email.receiverName = attrs.envelope.to[0].name;
                            email.receiverEmail = `${attrs.envelope.to[0].mailbox}@${attrs.envelope.to[0].host}`;
                            email.inReplyTo = attrs.envelope.inReplyTo;
                            email.messageId = attrs.envelope.messageId;

                            headerInfo = Imap.parseHeader(headerInfo);
                            email.date = headerInfo.date;
                            email.subject = headerInfo.subject ? headerInfo.subject[0] : '';
                        });

                        msg.once('end', function () {
                            emails.push(email);
                        });
                    });

                    fetch.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                    });

                    fetch.once('end', function () {
                        getTwo()
                        imap.end();
                    });
                } else {
                    console.log('No emails found.');
                    imap.end();
                }
            });
        });
    });

    imap.once('error', function (err) {
        console.log('IMAP error: ' + err);
    });

    imap.once('end', function () {
        console.log('Connection ended.');
    });
}

function getTwo() {
    var i = 0;
    const imapConfig = {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_HOST,
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    };

    const client = new imap(imapConfig);

    client.once('ready', () => {
        client.openBox('INBOX', true, (err, box) => {
            if (err) throw err;
            const f = client.seq.fetch(mIDs, { bodies: [''], markSeen: true });
            f.on('message', (msg, seqno) => {
                msg.on('body', async (stream, info) => {
                    const body = await simpleParser(stream);
                    emails[i].message = body.textAsHtml;
                    console.log(emails[i].message)
                    i++;
                    if (i == mIDs.length) {
                        var temp = [];
                        for (const i in emails) {
                            var params = {
                                fromName: emails[i].senderName,
                                fromEmail: emails[i].senderEmail,
                                toName: emails[i].receiverName,
                                toEmail: emails[i].receiverEmail,
                                subject: emails[i].subject,
                                message: emails[i].message,
                                inReplyTo: emails[i].inReplyTo,
                                messageId: emails[i].messageId,
                                mainId: emails[i].messageId,
                                category: 0
                            };
                            console.log(params)
                            if (emails[i].inReplyTo) {
                                var selected = await Email.findOne({ where: { messageId: emails[i].inReplyTo } });
                                params.mainId = selected.mainId
                            }
                            temp.push(params);
                        }
                        console.log(temp)

                        Email.bulkCreate(temp)
                            .then(() => {
                                console.log('Data inserted successfully');
                            })
                            .catch((error) => {
                                console.error('Error inserting data:', error);
                            });
                    }
                });
            });
            f.once('error', err => {
                console.log('Fetch error:', err);
            });
            f.once('end', () => {
                console.log('Fetch completed');
                client.end();
            });
        });
    });

    client.connect();

}

exports.receiveEmail = async (req, res, next) => {
    var category = req.body.category;
    var search = req.body.search;
    var email = req.body.email;
    if (!search || search == undefined) { search = ''; }
    if (category == 'all') {
        var mails;
        await db.sequelize.query(
            `SELECT e.* FROM emails e 
                JOIN ( 
                      SELECT mainId, MAX(createdAt) AS max_createdAt 
                      FROM emails 
                      WHERE category = 0 AND accept = '' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                      GROUP BY mainId 
                    ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
                limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where category = 0 AND accept = '' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%')  group by mainId`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                res.json({ data: mails, count: result.length > 0 ? result[0].cnt : 0 });
            });
    }
    else if (category == 'inbox') {
        var mails;
        await db.sequelize.query(
            `SELECT e.* FROM emails e 
            JOIN ( 
                  SELECT mainId, MAX(createdAt) AS max_createdAt 
                  FROM emails 
                  WHERE category = 0 AND accept = '${email}' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                  GROUP BY mainId 
                ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
            limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where category = 0 AND accept = '${req.body.email}' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') group by mainId`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                res.json({ data: mails, count: result.length > 0 ? result[0].cnt : 0 });
            });
    } else if (category == 'sent') {
        var mails;
        await db.sequelize.query(
            `SELECT e.* FROM emails e 
            JOIN ( 
                  SELECT mainId, MAX(createdAt) AS max_createdAt 
                  FROM emails 
                  WHERE category = 1 AND accept = '${email}' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                  GROUP BY mainId 
                ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
            limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where category = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') group by mainId `, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                res.json({ data: mails, count: result.length > 0 ? result[0].cnt : 0 });
            });
        // SELECT e.* FROM emails e
        // JOIN (
        //   SELECT mainId, MAX(createdAt) AS max_createdAt
        //   FROM emails
        //   WHERE category = 0
        //   GROUP BY mainId
        // ) subquery
        // ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt;
    }
    else if (category == 'important') {
        var mails;
        await db.sequelize.query(
            `SELECT e.* FROM emails e 
                JOIN ( 
                      SELECT mainId, MAX(createdAt) AS max_createdAt 
                      FROM emails 
                      WHERE isImportant = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                      GROUP BY mainId 
                    ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
                limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where isImportant = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') group by mainId  `, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                res.json({ data: mails, count: result.length > 0 ? result[0].cnt : 0 });
            });
    }
    else if (category == 'starred') {
        var mails;
        await db.sequelize.query(
            `SELECT e.* FROM emails e 
                    JOIN ( 
                          SELECT mainId, MAX(createdAt) AS max_createdAt 
                          FROM emails 
                          WHERE isStarred = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                          GROUP BY mainId 
                        ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
                    limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where isStarred = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') group by mainId `, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                res.json({ data: mails, count: result.length > 0 ? result[0].cnt : 0 });
            });

    }
    else {
        res.json({ data: [] });
    }

}

exports.detailEmail = async (req, res, next) => {
    await db.sequelize.query(
        `select * from emails where id = ${req.body.id}`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            res.json({ data: result });
        });
}


// Receive and save email by ID
exports.sendemailById = async (req, res, next) => {
    var selected = {}
    // await db.sequelize.query(
    //     `select * from emails where id = ${req.body.id}`, { type: db.Sequelize.QueryTypes.SELECT })
    //     .then((result) => {
    //         selected = result[0];
    //     });

    var selected = await Email.findOne({ where: { id: req.body.id } });
    var params = {
        fromName: "Admin",
        fromEmail: selected.toEmail,
        toName: selected.fromName,
        toEmail: selected.fromEmail,
        subject: selected.subject,
        message: req.body.message,
        category: '1',
        accept: req.body.email,
        parentID: req.body.id,
    };
    selected.update({ reply: new Date() });
    console.log('param', params)
    Email.create(params)
    res.send({ flag: "success" })
}

exports.updateImportant = async (req, res, next) => {
    const result = await Email.findOne({ where: { id: req.body.id } });
    result.update({ isImportant: req.body.value });
    res.send({ flag: "success" })
}

exports.getEmailById = async (req, res, next) => {
    const result = await Email.findOne({ where: { id: req.body.id } });
    res.send({ datA: result })
}

exports.updateStarred = async (req, res, next) => {
    const result = await Email.findOne({ where: { id: req.body.id } });
    result.update({ isStarred: req.body.value });
    res.send({ flag: "success" })
}

exports.getLabels = async (req, res, next) => {
    var labels = [
        { id: 'all', type: 'system', name: 'genera; inbox', unreadCount: 0 },
        { id: 'inbox', type: 'system', name: 'private inbox', unreadCount: 0 },
        { id: 'sent', type: 'system', name: 'sent', unreadCount: 0 },
        { id: 'important', type: 'system', name: 'important', unreadCount: 0 },
        { id: 'starred', type: 'system', name: 'starred', unreadCount: 0 },
        { id: 'accepted', type: 'system', name: 'starred', unreadCount: 0 },
        { id: 'replied', type: 'system', name: 'starred', unreadCount: 0 },
        { id: 'alluser', unreadCount: 0 },
    ];
    await db.sequelize.query(
        `SELECT COUNT(id) AS cnt, category FROM emails GROUP BY category`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            for (var i in result) {
                if (result[i].category == 0) {
                    labels[1].unreadCount = result[i].cnt;
                    console.log(result[i].cnt)
                }
                if (result[i].category == 1) {
                    labels[2].unreadCount = result[i].cnt;
                }
            }
        });
    await db.sequelize.query(
        `SELECT COUNT(cnt) AS cc FROM (SELECT COUNT(fromEmail) AS cnt FROM emails WHERE fromEmail != 'test@norrberg.net' GROUP BY fromEmail) AS ss`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            labels[7].unreadCount = result[0].cc
        });
    await db.sequelize.query(
        `SELECT COUNT(id) AS cnt FROM emails  WHERE accept != ''`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            labels[5].unreadCount = result[0].cnt
        });
    await db.sequelize.query(
        `SELECT COUNT(id) AS cnt FROM emails  WHERE reply != ''`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            labels[6].unreadCount = result[0].cnt
        });
    await db.sequelize.query(
        `SELECT COUNT(id) AS cnt FROM emails`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            labels[0].unreadCount = result[0].cnt
        });
    res.send({ val: labels })
}

exports.deleteEmailByID = async (req, res, next) => {
    await db.sequelize.query(`DELETE FROM emails WHERE id = '${req.body.id}' `)
    res.send({ flag: "success" });
}

exports.acceptEmailById = async (req, res, next) => {
    const result = await Email.findOne({ where: { id: req.body.id } });
    console.log('aaaaaa', result.accept)
    if (result.accept) {
        res.send({ flag: "accepted", data: result.accept })
    }
    else {
        result.update({ accept: req.body.staff });
        res.send({ flag: "success" })
    }
}

exports.rejectEmailById = async (req, res, next) => {
    const result = await Email.findOne({ where: { id: req.body.id } });
    result.update({ accept: '' });
    res.send({ flag: "success" })
}


// Esetting
exports.addemail = async (req, res, next) => {
    if (req.body.status === '1') {
        await db.sequelize.query(`UPDATE esettings SET status = 0`)
    }
    var params = req.body;
    Esetting.create(params)
    res.send({ flag: "success" })
}

exports.getemail = async function (req, res, next) {
    await db.sequelize.query(
        `select * from esettings`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            res.json({ data: result });
        });
}


exports.deletemail = async function (req, res, next) {
    await db.sequelize.query(`DELETE FROM esettings WHERE id = '${req.body.id}' `)
    res.send({ flag: "success" });
}

exports.getemailsByid = async function (req, res, next) {
    await db.sequelize.query(
        `select * from esettings where id = ${req.body.id}`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            res.json({ data: result });
        });
}

exports.updatemailById = async function (req, res, next) {
    var params = req.body;
    await db.sequelize.query(`UPDATE esettings SET status = 0`)

    const result = await Esetting.findOne({ where: { email: req.body.email } });
    console.log(params)
    result.update(params);
    res.send({ flag: "success" })
}
// End Esetting
exports.getRepliedEmailById = async (req, res, next) => {
    const main = await Email.findOne({ where: { id: req.body.id } });
    var result = await db.sequelize.query(`SELECT * FROM emails WHERE mainId = '${main.mainId}' `, { type: db.Sequelize.QueryTypes.SELECT })
    res.send({ result: result });
}


exports.mailAnalyse = async (req, res, next) => {
    var reply = await db.sequelize.query(`SELECT COUNT(id) AS cnt, DATE(createdAt) AS dd FROM emails 
    WHERE category = 0 AND reply != '' GROUP BY DATE(createdAt) ORDER BY DATE(createdAt) DESC LIMIT 10`, { type: db.Sequelize.QueryTypes.SELECT })

    var all = await db.sequelize.query(`SELECT COUNT(id) AS cnt, DATE(createdAt) AS dd FROM emails 
    WHERE category = 0 GROUP BY DATE(createdAt) ORDER BY DATE(createdAt) DESC LIMIT 10`, { type: db.Sequelize.QueryTypes.SELECT })
    res.send({ result: { reply: reply, all: all } });
}



