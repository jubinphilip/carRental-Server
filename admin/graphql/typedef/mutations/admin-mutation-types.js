import { gql } from 'apollo-server-express';
 
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
  addAdmin(input: AdminInput!): Admin!  
  adminLogin(input: AdminInput!): Admin
  addManufacturer(input: AddManufacturer!): Manufacturer!
  addVehicle(primaryFile: Upload!, secondaryFiles: [Upload!]!, input: Vehicledata!): Vehicle!
  deleteVehicle(id:ID!):  DeleteResponse!
  deleteRentVehicles(id:ID!): DeleteResponse!
  editVehicle(file:Upload!,input: Vehicledata!): Vehicle!
  addRent(input:Rentdata!):Vehicle!
  uploadExcel(file: Upload!): UploadResponse!
  updateReturnVehicle(input:updateBooking!):UpdateResponse!
}`
export default adminMutationtypes

