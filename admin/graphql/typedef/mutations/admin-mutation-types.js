import { gql } from 'apollo-server-express';
 //The mutation of admins and its input types
const adminMutationtypes = gql`
scalar Upload
input AddManufacturer{
  manufacturer:String!
  model:String!
  year:String!
}
input AdminInput {
  username: String!
  password: String!
}
input Vehicledata{
    id: ID
    description:String!
    fuel:String!
    manufacturer_id:ID!
    seats:String!
    transmission:String!
    type:String!
}
    input Rentdata{
    vehicleid:ID!
    price:String!
    quantity:String!
  }
input updateBooking{
  id:ID!
  status:String!
  carid:ID!
}


type Mutation {
  addAdmin(input: AdminInput!): AdminData!  
  adminLogin(input: AdminInput!): Admin
  addManufacturer(input: AddManufacturer!): Manufacturer!
  addVehicle(primaryFile: Upload!, secondaryFiles: [Upload!]!, input: Vehicledata!): InsertResponse!
  deleteManufacturer(id:ID!):DeleteResponse!
  deleteVehicle(id:ID!):  DeleteResponse!
  deleteRentVehicles(id:ID!): DeleteResponse!
  editVehicle(file:Upload,input: Vehicledata!): InsertResponse!
  addRent(input:Rentdata!): InsertResponse!
  uploadExcel(file: Upload!): UploadResponse!
  updateReturnVehicle(input:updateBooking!):UpdateResponse!

}`
export default adminMutationtypes

