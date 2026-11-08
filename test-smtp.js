const nodemailer = require('nodemailer');

async function test() {
    const transporter = nodemailer.createTransport({
        host: 'mail.hermas.id',
        port: 465,
        secure: true,
        auth: {
            user: 'hello@hermas.id',
            pass: '6wuHnaMCg75go&LK',
        },
    });

    try {
        await transporter.verify();
        console.log('SMTP Config works!');
    } catch (e) {
        console.error('SMTP Config failed:', e);
    }
}
test();
