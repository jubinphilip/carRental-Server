import UserMutationController from "../../../controller/user-mutation-controller.js";
import { GraphQLUpload } from 'graphql-upload';
import crypto from 'crypto'
import dotenv from 'dotenv'
import Razorpay from "razorpay";
import { userSchema,UserDetailsSchema } from "../../../requests/user-request.js";
import { Loginschema } from "../../../requests/user-loginrequest.js";
import ValidationHelpers from '../../../repo/validation-helpers.js'

dotenv.config()
const userMutationController=new UserMutationController()
const validationhelpers=new ValidationHelpers()

const userMutationResolver = {
  Upload: GraphQLUpload,//Graphql upload is user for dealing with image upload
  Mutation: {
    //Mutation for adding a new user to the database
    addUser: async (_, {file,input }) => {

    const{city,country,state,pincode,password}=input//destructuring the input
      try
      {
        console.log(input,"error")
        const{error,value}=UserDetailsSchema.validate({city,country,state,pincode,password})//Passing the information for validation using joi 
        //if any validation error occured function will return with the error message
        if(error)
        {
        console.log(error)  
          return {
            id:null,
            email:null,
            status: false,
            message:error.details[0].message,

          };
        }
        else
        {
          //if no  error passing the validated value returned  to controller
          value.username=input.username
          value.phone=input.phone
          value.email=input.email
      return await userMutationController.registerUser(file,value)
      
        }
      }catch(error){
        console.log(error);
      }
    },

    //Mutation for user login
    loginUser: async (_, { input }) => {
      const{email,password}=input
      try {
        const {value,error}=Loginschema.validate({email,password})//Passing data for validation
        //if error occurs return the value
        if(error)
        {
          console.log(error)
          return{
            id:null,
            email:null,
            fileurl:null,
            username:null,
            token:null,
            status:false,
            message:error.details[0].message
          }
        }
        else
        {
          //if no error value is passed to controller
        return await userMutationController.loginUser(value)
        }
      } catch (error) {
          console.error('Login error:', error);
          throw new Error('Login Failed');
      }
  },

    //Mutation for Booking  a car
    bookCar:async(_,{input})=>
    {
       console.log(input)
        try
        {
        const data=await userMutationController.bookCar(input)
        return data
        }
        catch(error)
        {
          console.log(error)
        }
    },

    //Mutation for editing the user information
    editUser:async(_,{file,input})=>
    {
      console.log("Function Called",file,input)
      try
      {
        const data=await userMutationController.editUserController(file,input)
        return data
      }catch(error)
      {
        console.log("Error generated")
      }
    },
  //Mutation for editing the user password
    editUserPassword:async(_,{input})=>
    {
      try
      { 
        const data=await userMutationController.editPasswordController(input)
      return data
      }catch(error)
      {
        console.log("Error generated",error)
      }
    },
  //Mutation for requesting otp for user registration
  requestOtp: async (_, args) => {
    const { phone, username, email } = args;
  
    try {
     
      const value = await userSchema.validateAsync({ phone, username, email },{ abortEarly: false }  );//Before generating otp the data is validated
      const checkEmailExists = await validationhelpers.checkEmail(email);//Validating whether the user is already registered or not
      const checkPhoneExists = await validationhelpers.checkPhone(phone);//Validating whether the phonenumber  is already in use
  
      if (!checkEmailExists && !checkPhoneExists) {
        const data = await userMutationController.SendOtpController(value.phone, value.username, value.email);//if both dont exist data is passed to controller
        return data;
        //if any exist status with appropriate data is retrned
      } else if (checkEmailExists) {
        return {
          status: false,
          data: null,
          message: "Email Already Exists",
        };
      } else if (checkPhoneExists) {
        return {
          status: false,
          data: null,
          message: "Phone Already Exists",
        };
      }
    } catch (error) {
      if (error.isJoi) {
        return {
          status: false,
          message: error.details.map(err => err.message).join(', '),
        };
      }
  
      return {
        status: false,
        message: 'An error occurred during processing.',
      };
    }
  },
  
  //Mutation for verifying otp
  verifyOtp:async(_,{phone,otp})=>
    {
      try
      {
        //passing the phone number and otp to controller
       const data= await userMutationController.verifyOtpController(phone,otp)
       return data
      }catch(error)
      {
        console.log("Error generated",error)
      }
    },
  
//Mutation for creating a razorpay Order
 createOrder : async (_,{ amount, currency }) => {
  console.log("Create Order Function Invoked");
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,  
  });

  const options = {
    amount: amount * 100, 
    currency,
    receipt: `receipt_order_${Math.random()}`, 
  };

  try {
    console.log("Razorpay Orders object:", razorpay.orders);

    const order = await razorpay.orders.create(options);
    console.log("Order created successfully:", order);
    //Afer generating order the order id is returned
    return {
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Error creating Razorpay order");
  }
},

//Mutation for verifying the payment done by the user
  verifyPayment :async(_,{paymentId,orderId,razorpay_signature,bookingId})=>
  {
    try
    {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
      console.log(generatedSignature)
      if (generatedSignature === razorpay_signature) {
        //after verification the booking id and razorpay_signature is passed to controller razorpay_signature is stored in db along with booking for further verification
        userMutationController.upDateBoookingController(razorpay_signature,bookingId)
    return {
      signature: generatedSignature,
    }
    }
  }
    catch(error)
    {
      console.log(error)
    }
  },
  //Mutation for adding rating for a car
  addReview:async(_,{input})=>
  {
    try{
      const review = await userMutationController.reviewController(input)
      return review
    }catch(error)
    {
      console.log(error)
    }
  }
  } 

};

export default userMutationResolver;
