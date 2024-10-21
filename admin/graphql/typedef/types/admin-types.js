import { gql } from "apollo-server-express";
const adminTypes = gql`
type Admin {
  token: String
  status: Boolean!
  message: String!
  data: AdminData
}

type AdminData {
  id: ID!
  username: String!
}

    
type Manufacturer{
id:ID
status:Boolean!
message:String!
}

type Manufacturerdata{
id:ID!
manufacturer:String!
model:String!
year:String!
}

type Vehicle{
id:ID
status:String!
}
type DeleteResponse{
  status:String!
  message:String!
}
type UploadResponse {
    status: String
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
    RentedVehicle:RentData!
    User:User!
  }
 type UpdateResponse{
    status:Boolean!
    message:String!
  }  
  `

  export default adminTypes