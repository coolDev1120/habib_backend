const Imap = require('imap');

exports.receiveEmail = async (req, res, next) => {
    // Create a new IMAP connection object
    var imap = new Imap({
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_HOST,
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    // Connect to the IMAP server
    imap.connect();

    // When the connection is ready
    imap.once('ready', function () {
        // Select the INBOX folder
        imap.openBox('INBOX', function (err) {
            if (err) throw err;

            // Search for emails received after a specific date

            const fetchOptions = {
                bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
                struct: true,
                envelope: {
                    addresses: true
                }
            };
            imap.search(['ALL', ['SINCE', 'June 15, 2018']], function (err, results) {
                if (err) throw err;

                const messageIds = results;

                // Fetch the email headers and body
                if (messageIds.length > 0) {
                    const fetch = imap.fetch(messageIds, fetchOptions);
                    const emails = [];

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
                                // Read the email body stream
                                stream.on('data', function (chunk) {
                                    email.message += chunk.toString('utf8');
                                });
                            } else if (info.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)') {
                                // Parse the email headers
                                stream.once('data', function (chunk) {
                                    headerInfo += chunk.toString('utf8');
                                });
                            }
                        });

                        msg.once('attributes', function (attrs) {
                            // Get the email sender and receiver
                            console.log(attrs.envelope)
                            email.senderName = attrs.envelope.from[0].name;
                            email.senderEmail = `${attrs.envelope.from[0].mailbox}@${attrs.envelope.from[0].host}`;
                            email.receiverName = attrs.envelope.to[0].name;
                            email.receiverEmail = `${attrs.envelope.to[0].mailbox}@${attrs.envelope.to[0].host}`;

                            // Get the email date and subject
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
                        console.log(emails);
                        console.log(emails.length)
                        imap.end();
                    });
                } else {
                    console.log('No emails found.');
                    imap.end();
                }
            });
        });
    });

    // When the connection encounters an error
    imap.once('error', function (err) {
        console.log('IMAP error: ' + err);
    });

    // When the connection is closed
    imap.once('end', function () {
        console.log('Connection ended.');
    });
}