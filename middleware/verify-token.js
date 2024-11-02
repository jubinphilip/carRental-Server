import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { AuthenticationError } from 'apollo-server-express'; // Import AuthenticationError for error handling

// Function to verify the token
export const verifyToken = (token) => {
    if (!token) {
        throw new AuthenticationError('No token provided');
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        return decoded; // Return decoded user data
    } catch (err) {
        console.error('Token verification failed:', err.message);
        throw new AuthenticationError('Invalid token');
    }
};
