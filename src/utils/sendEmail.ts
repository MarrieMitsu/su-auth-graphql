// Packages
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface SendEmailProps {
    to: string;
    subject: string;
    html: string;
}

// sendEmail
export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {

    // Create ethereal mail dummy account
    // let testAccount = await nodemailer.createTestAccount();
    // let user = "eumxurudk2sx632c@ethereal.email";
    // let pass = "QczEU5gcNwJ7GvhBQ1";

    // Default using mailhog
    let mailConfig: SMTPTransport.Options = {
        host: "localhost",
        port: 1025,
        secure: false,
        // auth: {
        //     user: process.env.NODEMAILER_EMAIL,
        //     pass: process.env.NODEMAILER_PASSWORD
        // }
    }

    // Transporter
    let transporter = nodemailer.createTransport(mailConfig);

    // Send email
    transporter.sendMail({
        from: "graphqlauth@mail.com",
        to,
        subject,
        html,
    }, (err, info) => {
        console.log(process.env.NODE_ENV);
        if (err) {
            console.log("[Mail Error]: ", err);
        } else {
            console.log("[Mail Info]: ", info);
            console.log("[Message sent]: ", info.messageId);
            console.log("[Preview URL]: ", nodemailer.getTestMessageUrl(info));
        }
    });

    
}