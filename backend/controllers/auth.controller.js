import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js"
import { generateTokenandSetCookie } from "../utils/generateTokenandSetCookie.js";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto"


export const signup =async (req, res) => {
    const {email, password, name} = req.body

    try {
        if(!email || !password || !name){
            throw new Error("All fields are required")
        }

        const userAlreadyExists = await User.findOne({email});

        if(userAlreadyExists){
            return res.status(400).json({success: false, message: "User already exists"})
        }

        const hashedPassword = await bcryptjs.hash(password, 10);


        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save();

        // jwt

        generateTokenandSetCookie(res, user._id);

       await sendVerificationEmail(user.email, verificationToken)

        res.status(201).json({
            success: true, 
            message: "User created Succesfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

        

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
};

export const verifyEmail = async(req, res) => {
    const {code} = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })
        if(!user) {
            return res.status(400).json({success: false, message: "Invalid verification code"})
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name)
        res.status(200).json({success: true, message: "Email Veriifed Succesfully", user: {...user._doc, password: undefined}})
    } catch (error) {
        console.error("error occured i verifying Email", error)
        res.status(500).json({success: false, message: "Server Error"})
    }
}

export const login =async (req, res) => {
    const {email, password} = req.body
    try {
        const user= await User.findOne({email})
        if(!user) {
            res.status(400).json({ success: false, message: "Invalid credentials"})
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if(!isPasswordValid) {
            res.status(400).json({ success: false, message: "Password is not correct"})
        }
        generateTokenandSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "User Logged in succesfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.error("Error occured while logging in", error)
        res.status(404).json({success: false, message: "Error while logging the user"})
    }
}
export const logout =async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({success: true, message: "Logged out succesfully"})
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({success: false, message: "User not found"})
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({success: true, message: "Password reset link sent to your email"})
    } catch (error) {
        console.error(`Error occured while sending reset email`, error)
        console.log(`Error occured while sending reset email: ${error}`);
        res.status(400).json({success: false, message: error.message})
        
    }
}