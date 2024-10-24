import { gql } from "apollo-server-express"
const userTypes=gql`

  type RegisterResponse
  {
  statuscode:Int
  status:Boolean!
  message:String!
  data:User
  }
type OTPResponse {
  statuscode:Int
  status: Boolean
  message: String
}
type User {
    id: ID
    username: String!
    email: String
    phone: String!
    city: String
    state: String
    country: String
    pincode: String
    fileurl:String!
    status:Boolean!
    message:String!
  }

type LoginResponse {
  id: ID
  statuscode:Int
  status:String
  message:String
  email: String
  token: String  
  username:String
  fileurl:String
}
  type UserResponse
{
    id: ID
    statuscode:Int
    status: Boolean!
    message: String!
}
type Manufacturerdata{
id:ID!
manufacturer:String!
model:String!
year:String!
}

type CarsData {
  id: ID!
  fileurl: String!
  Manufacturer:Manufacturerdata!
  type: String!
  transmission: String!
  description: String!
  fuel: String!
  seats: String!
}

type Carinfo {
  id: ID!
  Vehicle: CarsData!
  price: String!
  quantity:String!
}

type Booking{
id:ID!
status:String!
}


type Bookings {
  id: ID!
  dates: [String!]! 
}
 type Order {
    id: String!
    currency: String!
    amount: Int!
  }
  type Verification {
    signature: String!
  }

type Manufacturerdata{
id:ID!
manufacturer:String!
model:String!
year:String!
}



type CarsData {
  id: ID!
  fileurl: String!
  Manufacturer:Manufacturerdata!
  type: String!
  transmission: String!
  description: String!
  fuel: String!

}
type RentData {
  id: ID!
  Vehicle: CarsData!
  price: String!
  quantity:String!
}

type UserBookingsData{
    id:ID!
    startdate:String!
    amount:String!
    enddate:String!
    startlocation :String!
    droplocation:String!
    payment_status:String!
    createdAt:String!
    RentedVehicle:RentData!
  }
  type RatingResponse{
    status:String!
    message:String!
  }


type UserReview {
  id: ID
  username: String
  createdAt: String
}
type Review {
  id: ID                             
  rating: Float          
  review: String              
  User: UserReview           
}
  
type Reviews {
  averageRating: Float  
  reviews: [Review]      
}`

export default userTypes
