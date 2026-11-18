import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim() : '';
        const message = typeof body.message === 'string' ? body.message.trim() : '';
        const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : '';

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }

        const secretKey = process.env.TURNSTILE_SECRET_KEY;
        if (!secretKey) {
            console.error('Missing TURNSTILE_SECRET_KEY in environment');
            return NextResponse.json(
                { success: false, message: 'Server security configuration error.' },
                { status: 500 }
            );
        }

        if (!turnstileToken) {
            return NextResponse.json(
                { success: false, message: 'Please complete the Turnstile verification.' },
                { status: 400 }
            );
        }

        // Verify Cloudflare Turnstile token
        const verifyBody = new URLSearchParams();
        verifyBody.append('secret', secretKey);
        verifyBody.append('response', turnstileToken);

        const remoteIp =
            request.headers.get('cf-connecting-ip') ||
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
        if (remoteIp) {
            verifyBody.append('remoteip', remoteIp);
        }

        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: verifyBody.toString(),
        });

        const verifyResult = (await verifyResponse.json()) as {
            success: boolean;
            'error-codes'?: string[];
        };

        if (!verifyResult.success) {
            console.error('Turnstile verification failed:', verifyResult['error-codes']);
            return NextResponse.json(
                { success: false, message: 'Turnstile verification failed. Please retry.' },
                { status: 400 }
            );
        }

        // Konfigurasi transporter SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeMessageHtml = escapeHtml(message).replace(/\n/g, '<br/>');

        // Email untuk Admin (hello@hermas.id)
        const adminMailOptions = {
            from: `"${name.replace(/"/g, '')}" <${process.env.SMTP_USER}>`,
            replyTo: email,
            to: process.env.SMTP_USER,
            subject: `New Consultation Request from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `<p><strong>Name:</strong> ${safeName}</p>
             <p><strong>Email:</strong> ${safeEmail}</p>
             <p><strong>Message:</strong><br/>${safeMessageHtml}</p>`,
        };

        // Email Auto-reply untuk pengisi form
        const userMailOptions = {
            from: `"Hermas Bintang" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Thank you for your message!`,
            text: `Hi ${name},\n\nThank you for reaching out. I have received your message and will get back to you as soon as possible.\n\nYour message:\n${message}\n\nBest regards,\nHermas Bintang`,
            html: `<p>Hi ${safeName},</p>
             <p>Thank you for reaching out. I have received your message and will get back to you as soon as possible.</p>
             <p><strong>Your message:</strong><br/>${safeMessageHtml}</p>
             <br/>
             <p>Best regards,<br/>Hermas Bintang</p>`,
        };

        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        return NextResponse.json({ success: true, message: 'Message sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 });
    }
}
