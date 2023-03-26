const nodemailer = require('nodemailer')

exports.sendEmail = async (req, res, next) => {
    var mailOptions = {
        from: process.env.MAIL_USER,
        to: req.body.receiver,
        subject: req.body.subject,
        html: req.body.message
    };
    console.log(mailOptions)

    const transporter = nodemailer.createTransport({
        //this is the authentication for sending email. this is change for git.
        name: "thehempcoop.org",
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true, // use TLS                
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    })

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({
                success: false,
                flag: "error",
            });
            return;
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.json({
        success: true,
        flag: "success",
    });
}


