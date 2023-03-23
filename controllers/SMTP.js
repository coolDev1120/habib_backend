// const { SibApiV3Sdk } = require('@sendinblue/client');

// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// const apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = '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';


// exports.sendEmail = async function (req, res, next) {
//     const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//     sendSmtpEmail.sender = {
//         name: 'Sender Name',
//         email: 'astjin2@gmail.com'
//     };

//     sendSmtpEmail.to = [{ email: 'jameswadebaker@gmail.com' }];
//     sendSmtpEmail.subject = 'Email Subject';
//     sendSmtpEmail.textContent = 'Plain text content';
//     sendSmtpEmail.htmlContent = '<p>HTML content</p>';

//     const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//     apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
//         console.log('Email sent successfully');
//     }, function (error) {
//         console.error('Error sending email:', error);
//     });
// }

// const { SibApiV3Sdk } = require('@sendinblue/client');

// import * as sib from "sib-api-v3-sdk";

// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// const apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = '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';

// exports.sendEmail = async function (req, res, next) {
//     const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//     sendSmtpEmail.sender = {
//         name: 'Sender Name',
//         email: 'astjin2@gmail.com'
//     };

//     sendSmtpEmail.to = [{ email: 'jameswadebaker@gmail.com' }];
//     sendSmtpEmail.subject = 'Email Subject';
//     sendSmtpEmail.textContent = 'Plain text content';
//     sendSmtpEmail.htmlContent = '<p>HTML content</p>';

//     const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//     apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
//         console.log('Email sent successfully');
//         res.send('Email sent successfully'); // Send success response back to client
//     }, function (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error sending email'); // Send error response back to client
//     });
// }

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

exports.sendEmail = async function (req, res, next) {
    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = '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';

    // Uncomment below two lines to configure authorization using: partner-key
    // var partnerKey = defaultClient.authentications['partner-key'];
    // partnerKey.apiKey = 'YOUR API KEY';

    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    sendSmtpEmail = {
        sender: { email: 'astjin2@gmail.com' },
        to: [{
            email: 'jameswadebaker@gmail.com',
            name: 'John Doe'
        }],
        subject: "smail subject",
        params: {
            name: 'John',
            surname: 'Doe'
        },
        htmlContent: "Hello, is it me you are looking for?",
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + data);
    }, function (error) {
        console.error(error);
    });
}