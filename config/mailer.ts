import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS 
    }
});

transporter.verify().then(()=> {
    console.log('Mailer listo')
})
