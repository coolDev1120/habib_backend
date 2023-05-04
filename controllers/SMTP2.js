const Imap = require('imap');
const imap = require('imap');
const { simpleParser } = require('mailparser');
var mIDs = [];
var emails = [];
const db = require("../models");
const { param } = require('../router');
const Email = db.email;
const Esetting = db.esetting;
const Email_teams = db.email_teams;

basefunction()

setInterval(() => {
    mIDs = []
    emails = []
    basefunction()
}, 20000);

// deleteMail()

function deleteMail() {
    const { inspect } = require('util');

    const imap = new Imap({
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_HOST,
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function () {
        openInbox(function (err, box) {
            if (err) throw err;
            imap.search(['ALL'], function (err, results) {
                if (err) throw err;
                const f = imap.seq.fetch(results, { bodies: '' });
                f.on('message', function (msg, seqno) {
                    console.log('Deleting message %d', seqno);
                    const setFlags = imap.seq.setFlags(seqno, '\\Deleted');
                });
                f.on('end', function () {
                    imap.expunge(function (err) {
                        if (err) throw err;
                        console.log('All messages deleted!');
                        imap.end();
                    });
                });
            });
        });
    });

    imap.once('error', function (err) {
        console.error(err);
    });

    imap.once('end', function () {
        console.log('Connection ended');
    });

    imap.connect();

}

function revieceFile() {
    const Imap = require('imap');
    const simpleParser = require('mailparser').simpleParser;

    const imap = new Imap({
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_HOST,
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', () => {
        openInbox((err, box) => {
            if (err) throw err;
            imap.search(['ALL'], (err, results) => {
                if (err) throw err;
                const f = imap.fetch(results, { bodies: '' });
                f.on('message', (msg, seqno) => {
                    msg.on('body', (stream, info) => {
                        simpleParser(stream, (err, parsed) => {
                            if (err) throw err;
                            if (parsed.attachments.length > 0) {
                                // Handle attachments
                                parsed.attachments.forEach((attachment) => {
                                    console.log(`Received attachment: ${attachment.filename}`);
                                });
                            }
                        });
                    });
                });
                f.once('error', (err) => {
                    console.log(`Fetch error: ${err}`);
                });
                f.once('end', () => {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });
    });

    imap.once('error', (err) => {
        console.log(`IMAP error: ${err}`);
    });

    imap.once('end', () => {
        console.log('IMAP connection ended.');
    });

    imap.connect();

}

async function basefunction() {
    const serverInfo =
        await db.sequelize.query(`SELECT * FROM esettings a WHERE a.status = 1`, { type: db.Sequelize.QueryTypes.SELECT })

    for (var i in serverInfo) {
        if (i > 0) {
            setTimeout(async () => {
                await getOne(serverInfo[i])
            }, 5000);
        }
        else (
            await getOne(serverInfo[i])
        )
    }
}

async function getOne(serverInfo) {
    // const serverInfo = await Esetting.findOne({ where: { status: '1' } });
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
                            email.senderName = attrs.envelope.from ? attrs.envelope.from[0].name : '';
                            email.senderEmail = `${attrs.envelope.from[0].mailbox}@${attrs.envelope.from[0].host}`;
                            email.receiverName = attrs.envelope.to ? attrs.envelope.to[0].name : '';
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
                        getTwo(serverInfo)
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

function getTwo(serverInfo) {
    var i = 0;
    const imapConfig = {
        user: serverInfo.email,
        password: serverInfo.password,
        host: serverInfo.host,
        port: serverInfo.imap,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    };

    console.log(imapConfig)

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
                                hostname: serverInfo.email,
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

exports.getservice = async (req, res, next) => {
    var mails = [];
    var search = req.body.search;
    var total = ''
    // if (mails % pageInfo.perpage > 0) {
    //     countPage = Math.floor(mails / pageInfo.perpage) + 1;
    // } else {
    //     countPage = Math.floor(mails / pageInfo.perpage)
    // }

    await db.sequelize.query(
        `SELECT e.* FROM emails e 
            JOIN ( 
                  SELECT mainId, MAX(createdAt) AS max_createdAt 
                  FROM emails 
                  WHERE category = 0  AND (fromName like '%${search}%' or accept like '%${search}%' or fromEmail like '%${search}%') 
                  GROUP BY mainId 
                ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
            limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            mails = result;
        });
    await db.sequelize.query(
        `select count(id) as cnt from (select * from emails 
            where category = 0 AND (fromName like '%${search}%' or accept like '%${search}%' or fromEmail like '%${search}%')  group by mainId) as mm`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            // res.json({ data: mails, count: result.length > 0 ? result[0].cnt : 0 });
            total = result.length > 0 ? result[0].cnt : 0;
        });
    res.send({ data: mails, total: total })

}

exports.receiveEmail = async (req, res, next) => {
    var serverInfo =
        await db.sequelize.query(`SELECT b.* FROM users a, esettings b, email_teams c 
                WHERE a.email = '${req.body.email}' AND a.team = c.id AND c.email = b.id`, { type: db.Sequelize.QueryTypes.SELECT })
    serverInfo = serverInfo[0].email;


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
                      WHERE hostname = '${serverInfo}' AND  category = 0 AND accept = '' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                      GROUP BY mainId 
                    ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
                limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where hostname = '${serverInfo}' AND  category = 0 AND accept = '' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%')  group by mainId`, { type: db.Sequelize.QueryTypes.SELECT })
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
                  WHERE hostname = '${serverInfo}' AND  category = 0 AND accept = '${email}' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                  GROUP BY mainId 
                ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
            limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where hostname = '${serverInfo}' AND  category = 0 AND accept = '${req.body.email}' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') group by mainId`, { type: db.Sequelize.QueryTypes.SELECT })
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
                  WHERE hostname = '${serverInfo}' AND  category = 1 AND accept = '${email}' AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                  GROUP BY mainId 
                ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
            limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where hostname = '${serverInfo}' AND  category = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') group by mainId `, { type: db.Sequelize.QueryTypes.SELECT })
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
                      WHERE hostname = '${serverInfo}' AND  isImportant = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                      GROUP BY mainId 
                    ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
                limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where hostname = '${serverInfo}' AND  isImportant = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') group by mainId  `, { type: db.Sequelize.QueryTypes.SELECT })
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
                          WHERE hostname = '${serverInfo}' AND  isStarred = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
                          GROUP BY mainId 
                        ) subquery ON e.mainId = subquery.mainId AND e.createdAt = subquery.max_createdAt 
                    limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where hostname = '${serverInfo}' AND  isStarred = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') group by mainId `, { type: db.Sequelize.QueryTypes.SELECT })
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
    // if (result.accept) {
    //     res.send({ flag: "accepted", data: result.accept })
    // }
    // else {
    result.update({ accept: req.body.staff, acceptDate: new Date() });
    res.send({ flag: "success" })
    // }
}

exports.rejectEmailById = async (req, res, next) => {
    const result = await Email.findOne({ where: { id: req.body.id } });
    result.update({ accept: '', acceptDate: '' });
    res.send({ flag: "success" })
}

// Email Teama
exports.addemailTeam = async (req, res, next) => {
    var params = req.body;
    Email_teams.create(params)
    res.send({ flag: "success" })
}

exports.getemailTeam = async function (req, res, next) {
    const result = await Email_teams.findAll();
    res.send({ result: result })
}

exports.getemailTeamByid = async function (req, res, next) {
    const result = await Email_teams.findOne({ where: { id: req.body.id } });
    res.send({ result: result })
}

exports.updatemailTeamById = async function (req, res, next) {
    var params = req.body;
    const result = await Email_teams.findOne({ where: { id: req.body.id } });
    console.log(params)
    result.update(params);
    res.send({ flag: "success" })
}

exports.deletemailTeam = async function (req, res, next) {
    await db.sequelize.query(`DELETE FROM email_teams WHERE id = '${req.body.id}' `)
    res.send({ flag: "success" });
}

exports.getEmailTeams = async function (req, res, next) {
    const result = await Email_teams.findAll();
    res.send({ result: result })
}

// Esetting
exports.changeEsettingById = async (req, res, next) => {
    // if (req.body.val === '1') {
    //     await db.sequelize.query(`UPDATE esettings SET status = 0`)
    // }
    const result = await Esetting.findOne({ where: { id: req.body.id } });
    result.update({ status: req.body.val });
    res.send({ flag: "success" })
}

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
    // var params = req.body;
    // await db.sequelize.query(`UPDATE esettings SET status = 0`)

    const result = await Esetting.findOne({ where: { email: req.body.email } });
    console.log(params)
    result.update(params);
    res.send({ flag: "success" })
}

exports.getHostings = async (req, res, next) => {
    const result = await Esetting.findAll();
    res.send({ result: result });
}

// End Esetting
exports.getRepliedEmailById = async (req, res, next) => {
    const main = await Email.findOne({ where: { id: req.body.id } });
    var result;
    var flag;
    if (main.accept) {
        flag = true
        result = await db.sequelize.query(`SELECT a.*, b.username FROM emails a, users b WHERE a.accept = b.email AND a.mainId = '${main.mainId}' `, { type: db.Sequelize.QueryTypes.SELECT })
    } else {
        flag = false
        result = await db.sequelize.query(`SELECT * FROM emails WHERE mainId = '${main.mainId}' `, { type: db.Sequelize.QueryTypes.SELECT })
    }
    res.send({ result: result, flag: flag });
}

exports.mailAnalyse = async (req, res, next) => {
    var reply = await db.sequelize.query(`SELECT COUNT(id) AS cnt, DATE(createdAt) AS dd FROM emails 
    WHERE category = 0 AND reply != '' GROUP BY DATE(createdAt) ORDER BY DATE(createdAt) DESC LIMIT 10`, { type: db.Sequelize.QueryTypes.SELECT })

    var all = await db.sequelize.query(`SELECT COUNT(id) AS cnt, DATE(createdAt) AS dd FROM emails 
    WHERE category = 0 GROUP BY DATE(createdAt) ORDER BY DATE(createdAt) DESC LIMIT 10`, { type: db.Sequelize.QueryTypes.SELECT })
    res.send({ result: { reply: reply, all: all } });
}



