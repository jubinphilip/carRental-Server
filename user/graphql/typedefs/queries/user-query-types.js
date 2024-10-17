import { gql } from 'apollo-server-express';

const userQueryTypes = gql`
  type Query {
    getUser(id: ID!): User!
    getCarInfo(id:ID!):Carinfo!
     bookedDates(carId: ID!, quantity:String!):Bookings!
      getUserBookings(id:ID!):[UserBookingsData]!
}
`;

export default userQueryTypes;


