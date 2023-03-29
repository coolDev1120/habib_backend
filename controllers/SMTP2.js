const Imap = require('imap');
const imap = require('imap');
const { simpleParser } = require('mailparser');
var mIDs = [];
var emails = [];
const db = require("../models");
const Email = db.email;


// setInterval(() => {
//     emailUpdate()
// }, 20000);

// async function emailUpdate() {
//     // Create a new IMAP connection object
//     var imap = new Imap({
//         user: process.env.MAIL_USER,
//         password: process.env.MAIL_PASSWORD,
//         host: process.env.MAIL_HOST,
//         port: 993,
//         tls: true,
//         tlsOptions: { rejectUnauthorized: false }
//     });

//     // Connect to the IMAP server
//     imap.connect();

//     imap.once('ready', function () {
//         imap.openBox('INBOX', function (err) {
//             if (err) throw err;

//             const fetchOptions = {
//                 bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
//                 struct: true,
//                 envelope: {
//                     addresses: true
//                 },
//                 markSeen: true
//             };

//             imap.search(['UNSEEN', ['SINCE', '2022-09-01 20:17:08']], function (err, results) {
//                 if (err) throw err;

//                 const messageIds = results;

//                 // Fetch the email headers and body
//                 if (messageIds.length > 0) {
//                     const fetch = imap.fetch(messageIds, fetchOptions);
//                     const emails = [];
//                     const now = new Date();

//                     fetch.on('message', function (msg) {
//                         const email = {
//                             senderName: '',
//                             senderEmail: '',
//                             receiverName: '',
//                             receiverEmail: '',
//                             date: '',
//                             subject: '',
//                             message: ''
//                         };

//                         let headerInfo = '';

//                         msg.on('body', function (stream, info) {
//                             if (info.which === 'TEXT') {
//                                 // Read the email body stream
//                                 stream.on('data', function (chunk) {
//                                     email.message += chunk.toString('utf8');
//                                 });
//                             } else if (info.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)') {
//                                 // Parse the email headers
//                                 stream.once('data', function (chunk) {
//                                     headerInfo += chunk.toString('utf8');
//                                 });
//                             }
//                         });

//                         msg.once('attributes', function (attrs) {
//                             // Get the email sender and receiver
//                             console.log(attrs.envelope)
//                             email.senderName = attrs.envelope.from[0].name;
//                             email.senderEmail = `${attrs.envelope.from[0].mailbox}@${attrs.envelope.from[0].host}`;
//                             email.receiverName = attrs.envelope.to[0].name;
//                             email.receiverEmail = `${attrs.envelope.to[0].mailbox}@${attrs.envelope.to[0].host}`;

//                             // Get the email date and subject
//                             headerInfo = Imap.parseHeader(headerInfo);
//                             email.date = headerInfo.date;
//                             email.subject = headerInfo.subject[0];
//                         });

//                         msg.once('end', function () {
//                             emails.push(email);
//                         });
//                     });

//                     fetch.once('error', function (err) {
//                         console.log('Fetch error: ' + err);
//                     });

//                     fetch.once('end', function () {
//                         // console.log(emails);
//                         var temp = [];
//                         for (const i in emails) {
//                             var params = {
//                                 fromName: emails[i].senderName,
//                                 fromEmail: emails[i].senderEmail,
//                                 toName: emails[i].receiverName,
//                                 toEmail: emails[i].receiverEmail,
//                                 subject: emails[i].subject,
//                                 message: emails[i].message,
//                                 category: 0
//                             };
//                             temp.push(params);
//                         }
//                         Email.bulkCreate(temp)
//                             .then(() => {
//                                 console.log('Data inserted successfully');
//                             })
//                             .catch((error) => {
//                                 console.error('Error inserting data:', error);
//                             });

//                         imap.end();
//                     });
//                 } else {
//                     console.log('No emails found.');
//                     imap.end();
//                 }
//             });
//         });
//     });

//     // When the connection encounters an error
//     imap.once('error', function (err) {
//         console.log('IMAP error: ' + err);
//     });

//     // When the connection is closed
//     imap.once('end', function () {
//         console.log('Connection ended.');
//     });
// }

// emailUpdate();
getOne()

setInterval(() => {
    getOne()
}, 20000);

function getOne() {
    var imap = new Imap({
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_HOST,
        port: 993,
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
                        const email = {
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

                            headerInfo = Imap.parseHeader(headerInfo);
                            email.date = headerInfo.date;
                            email.subject = headerInfo.subject[0];
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
                    i++;
                    if (i == mIDs.length) {
                        console.log(emails)
                        var temp = [];
                        for (const i in emails) {
                            var params = {
                                fromName: emails[i].senderName,
                                fromEmail: emails[i].senderEmail,
                                toName: emails[i].receiverName,
                                toEmail: emails[i].receiverEmail,
                                subject: emails[i].subject,
                                message: emails[i].message,
                                category: 0
                            };
                            temp.push(params);
                        }
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
    if (!search || search == undefined) { search = ''; }

    if (category == 'all' || category == 'inbox') {
        var mails;


        await db.sequelize.query(
            `select * from emails 
            where category = 0 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
            order by id asc limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where category = 0 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%')`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                res.json({ data: mails, count: result[0].cnt });
            });
    } else if (category == 'sent') {
        var mails;
        await db.sequelize.query(
            `select * from emails 
            where category = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
            order by id desc limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where category = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') `, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                res.json({ data: mails, count: result[0].cnt });
            });
    }
    else if (category == 'important') {
        var mails;
        await db.sequelize.query(
            `select * from emails 
            where isImportant = 1  AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
            order by id desc limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where isImportant = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') `, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                res.json({ data: mails, count: result[0].cnt });
            });
    }
    else if (category == 'starred') {
        var mails;
        await db.sequelize.query(
            `select * from emails 
            where isStarred = 1  AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') 
            limit ${(req.body.page - 1) * req.body.perpage}, ${req.body.perpage}`, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                mails = result;
            });
        await db.sequelize.query(
            `select count(id) as cnt from emails 
            where isStarred = 1 AND (subject like '%${search}%' or message like '%${search}%' or fromEmail like '%${search}%') `, { type: db.Sequelize.QueryTypes.SELECT })
            .then((result) => {
                res.json({ data: mails, count: result[0].cnt });
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
    await db.sequelize.query(
        `select * from emails where id = ${req.body.id}`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            selected = result[0];
        });

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
    console.log('param', params)
    Email.create(params)
    res.send({ flag: "success" })
}

exports.updateImportant = async (req, res, next) => {
    const result = await Email.findOne({ where: { id: req.body.id } });
    result.update({ isImportant: req.body.value });
    res.send({ flag: "success" })
}

exports.updateStarred = async (req, res, next) => {
    const result = await Email.findOne({ where: { id: req.body.id } });
    result.update({ isStarred: req.body.value });
    res.send({ flag: "success" })
}

exports.getLabels = async (req, res, next) => {
    var labels = [
        { id: 'all', type: 'system', name: 'all mail', unreadCount: 4 },
        { id: 'inbox', type: 'system', name: 'inbox', unreadCount: 1 },
        { id: 'sent', type: 'system', name: 'sent', unreadCount: 0 },
        { id: 'important', type: 'system', name: 'important', unreadCount: 1 },
        { id: 'starred', type: 'system', name: 'starred', unreadCount: 1 },
    ];
    await db.sequelize.query(
        `SELECT COUNT(id) AS ctn, category FROM emails GROUP BY category`, { type: db.Sequelize.QueryTypes.SELECT })
        .then((result) => {
            for (var i in result) {
                if (result[i].category == 0) {
                    labels[0].unreadCount = result[i].cnt;
                }
                if (result[i].category == 1) {
                    labels[0].unreadCount = result[i].cnt;
                }
            }
        });
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

exports.getRepliedEmailById = async (req, res, next) => {
    var result = await db.sequelize.query(`SELECT * FROM emails WHERE parentID = '${req.body.id}' `, { type: db.Sequelize.QueryTypes.SELECT })
    res.send({ result: result });
}



