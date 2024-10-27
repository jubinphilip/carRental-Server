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
import { graphqlUploadExpress } from 'graphql-upload'
app.use(express.json())

//creating  graphql server  using the resolver and typedefs
app.use(graphqlUploadExpress({maxFileSize:10000000,maxFiles:10}))
const server=new ApolloServer({
    typeDefs,
    resolvers
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