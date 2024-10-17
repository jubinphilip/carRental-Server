import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey =process.env.JWT_SECRET // Store this in an environment variable for security

export const createToken = (payload) => {
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
};
