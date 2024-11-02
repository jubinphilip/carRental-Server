import { gql } from 'apollo-server-express';

const adminQuerytypes = gql`
  type Query {
    getAdmin(id: ID!): Admin
    getManufacturers: [Manufacturerdata]
    getCarsData:[CarsData]!
    getCarData(id:ID!):CarsData!
    rentVehicles(dateRange:[String]):[RentData]
    getBookings:[BookingsData]!
  }`
  export default adminQuerytypes