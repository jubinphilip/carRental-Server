import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const serviceSid = process.env.SERVICE_SID;
const client = new twilio(accountSid, authToken);
//Function for verifying otp inserted by the user
const verifyOtp = async (phone, otp) => {
    let formattedPhone = phone;

    if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+917025889751`;
    }

    try {
        //using twilio v2 service for verifying otp
        const verificationCheck = await client.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: formattedPhone, code: otp });

        if (verificationCheck.status === 'approved') {
            console.log("Success")
            return { state: true, message: 'OTP verified successfully' };
        
        }
        return { success: false, message: 'Invalid OTP' };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        console.log("error")
        return { success: false, message: 'Error occurred during OTP verification' };
    }
};

export default verifyOtp;
