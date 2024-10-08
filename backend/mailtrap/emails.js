import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
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

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "412600ff-23fb-4ece-837a-7bebb7128fce",
            template_variables: {
                "company_info_name": "Welcome to Auth",
                "name": name
              }
        });
        console.log("Email sent Succesfully", response);
        
    } catch (error) {
        console.error(`Error while sending welcome email`, error)
        throw new Error(`Error sending welcome Email: ${error}`)
    }
}


export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}];

    try {
        const response = await  mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Password",
            html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })
    } catch (error) {
        console.error(`Error sending password reset email`, error)

        console.log(`Error sending password reset email: ${error}`);
        
    }
}