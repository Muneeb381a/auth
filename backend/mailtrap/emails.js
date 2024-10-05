import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificatinToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject:"Verify you Email!",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificatinToken),
            category: "Email Verification"
        })

        console.log("Email sent succesfully", response)
    } catch (error) {
        console.error(`error occured while sending verification email`, error);
        
        throw new Error(`Error while sending verification Email ${error}`)
    }
}