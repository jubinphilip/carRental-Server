import { gql } from "apollo-server-express";
const adminTypes = gql`
type Admin {
  statuscode:Int!
  token: String
  status: Boolean!
  message: String!
}

type Manufacturer{
  id:ID
  statuscode:String
  status:Boolean
  message:String
}
type DeleteResponse{
  statuscode:Int!
  status:Boolean!
  message:String!
}
type InsertResponse{
statuscode:Int!
status:Boolean!
message:String!
}

type AdminData {
  id: ID!
  username: String!
}

    

type Manufacturerdata{
id:ID!
manufacturer:String!
model:String
year:String
}

type Vehicle{
id:ID
status:String!
}

type UploadResponse {
    statuscode:Int!
    status: Boolean!
    message: String
  }

type CarsData {
  id: ID!
  fileurl: String!
  secondaryImageUrls: [String!]!
  Manufacturer:Manufacturerdata!
  type: String!
  transmission: String!
  description: String!
  fuel: String!
  seats: String!
}
type User{
id:ID
username:String!
phone:String!
}
type RentData {
  id: ID!
  Vehicle: CarsData!
  price: String!
  quantity:String!
}

type BookingsData{
  id:ID!
   startdate:String!
    amount:String!
    enddate:String!
    startlocation :String!
    droplocation:String!
    status:String
     createdAt:String!
    payment_status:String
    RentedVehicle:RentData!
    User:User!
  }
 type UpdateResponse{
    statuscode:Int!
    status:Boolean!
    message:String!
  }  
  `

  export default adminTypes