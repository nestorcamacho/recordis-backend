const config = require("../config/config.js");

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: config.mailer.service,
    auth: {
        user: config.mailer.user,
        pass: config.mailer.pass
    }
});

module.exports = {
    sendTemplateMail: ({to, template, templateValues}) => {
        let mailOptions = {
            from: '"Recordis 💛" <contact@recordis.com>',
            to,
            subject: "Bienvenido a recordis!! Sólo queda validar tu email 💌",
            text: "Para poder empezar a utilizar la aplicación necesitarás validar tu email en la siguiente dirección. Copia y pega el enlace en la barra de direcciones: {{validateEmailToken}}",
            html: "Para poder empezar a utilizar la aplicación necesitarás validar tu email en la siguiente dirección. <a href='{{validateEmailToken}}'>validateEmailToken</a>"
        };

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         return console.log(error);
        //     }
        //     console.log('Message %s sent: %s', info.messageId, info.response);
        // });
    }
};