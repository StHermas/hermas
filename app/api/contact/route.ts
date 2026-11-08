import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        // Konfigurasi transporter SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true, // Gunakan true untuk port 465 (SSL)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email untuk Admin (hello@hermas.id)
        const adminMailOptions = {
            from: `"${name}" <${process.env.SMTP_USER}>`,
            replyTo: email,
            to: process.env.SMTP_USER,
            subject: `New Consultation Request from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`,
        };

        // Email Auto-reply untuk pengisi form
        const userMailOptions = {
            from: `"Hermas Bintang" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Thank you for your message!`,
            text: `Hi ${name},\n\nThank you for reaching out. I have received your message and will get back to you as soon as possible.\n\nYour message:\n${message}\n\nBest regards,\nHermas Bintang`,
            html: `<p>Hi ${name},</p>
             <p>Thank you for reaching out. I have received your message and will get back to you as soon as possible.</p>
             <p><strong>Your message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
             <br/>
             <p>Best regards,<br/>Hermas Bintang</p>`,
        };

        // Eksekusi pengiriman email
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        return NextResponse.json({ success: true, message: 'Message sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 });
    }
}