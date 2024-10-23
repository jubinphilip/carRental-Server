import { gql } from 'apollo-server-express';

const userMutationtypes = gql`
  scalar Upload
  input AddUserInput {
    username: String!
    email: String!
    phone: String!
    city: String
    state: String
    country: String
    pincode: String!
    password: String!
  }

  input LoginUserInput{
  email:String!
  password:String!
  }

  scalar Date

input BookingInput {
  carid: ID!
  quantity:String!
  userid: ID!
  startdate: String!     
  enddate: String!          
  startlocation: String!
  droplocation: String!
  amount: Float!  
}
  input EditInput{
    userid:ID!
    username: String,
    email: String,
    phone: String,
    city: String,
    state: String,
    country: String,
    pincode: String    
  }
  input EditPassword{
  id:ID!
    currentPswd:String!
    newPswd:String!
  }
  input ReviewInput{
  carid:ID!
  userid:ID!
  rating:Int!
  review:String!
  }

  type Mutation {
    addUser(file:Upload!,input: AddUserInput!): RegisterResponse
    loginUser(input: LoginUserInput!): LoginResponse
    bookCar(input:BookingInput!):Booking!
    editUser(file:Upload,input: EditInput!):UserResponse!
    editUserPassword(input:EditPassword!):UserResponse!
    requestOtp(phone: String!,username:String!,email:String!): OTPResponse
    verifyOtp(phone: String!,otp:String!): OTPResponse
    createOrder(amount: Float!, currency: String!): Order
    verifyPayment(paymentId: String!, orderId: String!,razorpay_signature:String!, bookingId:String!): Verification!
    addReview(input:ReviewInput!):RatingResponse!
  }
`;




export default userMutationtypes;


