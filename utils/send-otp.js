import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const serviceSid = process.env.SERVICE_SID;

const client = new twilio(accountSid, authToken);

const SendOtp = async (phone) => {
    let formattedPhone = phone;

    if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+917025889751`;
    }

    try {
        const response = await client.verify.v2.services(serviceSid)
            .verifications
            .create({ to: formattedPhone, channel: 'sms' });

        if (response.status === 'pending') {
            return { success: true, message: 'OTP sent successfully' };
        }
        return { success: false, message: 'Failed to send OTP' };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, message: 'Error occurred while sending OTP' };
    }
};

export default SendOtp;
