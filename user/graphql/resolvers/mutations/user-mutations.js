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
  Upload: GraphQLUpload,
  Mutation: {
    
    addUser: async (_, {file,input }) => {

      console.log(input,"jbhd")

    const{city,country,state,pincode,password}=input
      try
      {
        console.log(input,"error")
        const{error,value}=UserDetailsSchema.validate({city,country,state,pincode,password})
        
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
      return await userMutationController.registerUser(file,input)
        }
      }catch(error){
        console.log(error);
      }
    },

    loginUser: async (_, { input }) => {
      const{email,password}=input
      try {
        const {value,error}=Loginschema.validate({email,password})
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
        return await userMutationController.loginUser(input)
        }
      } catch (error) {
          console.error('Login error:', error);
          throw new Error('Login Failed');
      }
  },
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
  requestOtp: async (_, args) => {
    const { phone, username, email } = args;
  
    try {
     
      const value = await userSchema.validateAsync(
        { phone, username, email },
        { abortEarly: false } 
      );
      const checkEmailExists = await validationhelpers.checkEmail(email);
      const checkPhoneExists = await validationhelpers.checkPhone(phone);
  
      if (!checkEmailExists && !checkPhoneExists) {
        const data = await userMutationController.SendOtpController(phone, username, email);
        return data;
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
  
  
  verifyOtp:async(_,{phone,otp})=>
    {
      try
      {
       const data=userMutationController.verifyOtpController(phone,otp)
       return data
      }catch(error)
      {
        console.log("Error generated",error)
      }
    },
  

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

  verifyPayment :async(_,{paymentId,orderId,razorpay_signature,bookingId})=>
  {
    try
    {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
      console.log(generatedSignature)
      if (generatedSignature === razorpay_signature) {
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
  }
  } 

};

export default userMutationResolver;
