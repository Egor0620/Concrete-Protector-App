/**
 * Created by tbbates on 1/20/15.
 */
'use strict';
module.exports = function () {
    var nodemailer = require('nodemailer'),
    Mailgun = require('mailgun-js'),
    smtpTransport = require('nodemailer-smtp-transport');

    function sendHtmlEmailViaMailGun(app, from, to, subject, body) {
        //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
        var mailgun = new Mailgun({apiKey: app.config.mailgun.api_key, domain: app.config.mailgun.domain});

        var data = {
            //Specify email data
            from: from,
            //The email to contact
            to: to,
            //Subject and text data
            subject: subject,
            html: body
        };

        //Invokes the method to send emails given the above data with the helper library
        mailgun.messages().send(data, function (err, body) {
            //If there is an error, render the error page
            if (err) {
                //res.render('error', { error : err});
                console.log("got an error: ", err);
            }
            //Else we can greet    and leave
            else {
                //Here "submitted.jade" is the view file for this landing page
                //We pass the variable "email" from the url parameter in an object rendered by Jade
                //res.render('submitted', { email : body });
                console.log(body);
            }
        });
    }


    function sendHtmlEmail(app, from, to, subject, body) {
        var transport = nodemailer.createTransport(smtpTransport({
            host: app.config.smtp.server,
            port: app.config.smtp.port,
            auth: {
                user: app.config.smtp.username,
                pass: app.config.smtp.password
            },
            secure:false,
            debug:true,
            tls: {rejectUnauthorized: false}

        }));
        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: body
        };

        transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + response.message);
            }
        });

    }


    function sendTextEmail(app, from, to, subject, text) {
        var transport = nodemailer.createTransport(smtpTransport({
            host: app.config.smtp.server,
            port: app.config.smtp.port,
            auth: {
                user: app.config.smtp.username,
                pass: app.config.smtp.password
            },
            secure:false,
            debug:true,
            tls: {rejectUnauthorized: false}
        }));

        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: text
        };

        transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + response.message);
            }
        });

        
    }

    return {
        sendHtmlEmailViaMailGun: sendHtmlEmailViaMailGun,
        SendHtmlEmail: sendHtmlEmail,
        SendTextEmail: sendTextEmail
    };
};