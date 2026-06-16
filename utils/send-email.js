import { EMAIL_ADDRESS } from "../config/env.js";
import { emailTemplates } from "./email-template.js";
import dayjs from "dayjs";
import transporter from "../config/nodemailer.js";

 export const sendReminderEmail = async ({ to, type, subscription }) => {
    if(!to || !type){
        throw new Error("Missing required parameters");
    }
    

    const template = emailTemplates.find((t) => t.label===type);

    if(!template) throw new Error('Invalid E-mail type');

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM DD, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod
    }

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);


    const mailOptions = {
        from: EMAIL_ADDRESS,
        to: to,
        subject: subject,
        html: message
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to} (ID: ${info.messageId})`);
    } catch (error) {
        console.log('Error in sending mail', error);
        throw error;
    }
}