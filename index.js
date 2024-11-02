import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import typeDefs from './utils/resolver/manage-typedef.js'
import resolvers from './utils/resolver/manage-resolver.js'
import sequelize from './config/db.js'
import clearBooking from './utils/clearBooking.js'
dotenv.config()
const app=express()
app.use(cors())
app.use(express.urlencoded({extended:true}))
import { verifyToken } from './middleware/verify-token.js'
import { graphqlUploadExpress } from 'graphql-upload'
app.use(express.json())

//creating  graphql server  using the resolver and typedefs
app.use(graphqlUploadExpress({maxFileSize:10000000,maxFiles:10}))

const getTokenFromHeader = (req) => {
   
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1]; // Extract the token
    }
    return null; // No token found
};

const context = async ({ req }) => {
    const token =await getTokenFromHeader(req); // Extract token from the request
    if (token) {
        const user = verifyToken(token); // Verify the token and get user data
        return { user }; // Attach user info to context
    }

    return {}; // No token provided
};

const server=new ApolloServer({
    typeDefs,
    resolvers,
    context
})

await server.start();
server.applyMiddleware({app})
//syncing the database
sequelize.sync().then(()=>{
    console.log('Database Synced')}).catch((err)=>{
        console.log(err)
    })

clearBooking()
//starting the server 
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})