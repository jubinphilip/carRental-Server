import Typesense from 'typesense';
import dotenv from 'dotenv';
dotenv.config();

const typesenseClient = new Typesense.Client({
    nodes: [
        {
            host: process.env.TYPESENSE_HOST,  
            port: 443,
            protocol: 'https',
        },
    ],
    apiKey: process.env.TYPESENSE_API_KEY,  
    connectionTimeoutSeconds: 3,  
});

export default typesenseClient;
