import UserMutationService from "../Repo/mutation-helpers.js";
import { createToken } from "../../utils/createtoken.js";
import { uploadFile } from "../../utils/upload-file.js";

import SendOtp from "../../utils/send-otp.js";
import { createPresignedUrl } from "../../utils/createMinioUrl.js";
import verifyOtp from "../../utils/verify-otp.js";
import { stat } from "fs";

class UserMutationController{
    constructor(){  
        this.userMutationService = new UserMutationService();
    }
    //Controller for registering a user
    async registerUser(file, input) {
        try {
            const userRole='user'
            const fileUrl = await uploadFile(file,userRole);//Passing the file along with userRole for getting fileurl if user is customer then his profile info is stored in minio privatebucket
            const user = await this.userMutationService.registerUser(fileUrl, input); 
            
            if (user.status!=false) {
                return {
                    statuscode:200,
                    status: true,
                    message: "User Registered Successfully",
                    data: user,
                };

            } 
        } catch (error) {
            console.log("Error in UserController:", error);
            return { 
                statuscode:500,
                status: false,
                message: "Internal Server Error",
                data: null,
            };
            throw new Error("Error in UserController: " + error.message); 
        }
    }
    //Function for logging in user
    async loginUser(input) {
        try {
            const user = await this.userMutationService.loginUser(input);
            console.log(user);
            
            if (user.status !== false) {
                //if  user is found  in db  a token is generated for user
                const token = await createToken({ id: user.id, email: user.email });
                const fileurl = await createPresignedUrl(user.fileurl);//the fileurl is passed to a function for getting presigned url as the userprofile  is stored in private bucket
                console.log(user.id, user.email, fileurl); 
                return {
                    statuscode:200,
                    id: user.id,
                    email: user.email,
                    fileurl: fileurl || null,  //the new genearted urlis send to client side
                    username: user.username,
                    token: token || null,  
                    status: true,
                    message: "User Logged in"
                };
            } 
            else
            {
                return {
                    statuscode:400,
                    id: null,
                    email: null,
                    fileurl: null,  
                    username:null,
                    status: false,
                    message: user.error
                };
            }
        } catch (error) {

            console.log("Error in UserController:", error);
            return {
                statuscode:500,
                id: null,
                email: null,
                fileurl: null,  
                username:null,
                status: false,
                message: "Internal server Error"
            };
            throw new Error("Error in UserController");
        }
    }
    //Function for booking a car
    async bookCar(input) {
        const { startdate, enddate, carid, quantity } = input;
        try {
            //Function for checking the availability of the car
            const availability = await this.userMutationService.checkCarAvailability(startdate, enddate, carid);//Checking the availability of car before booking the car 
            console.log(availability.length);
            //if not available then send response
            if (availability.length >= quantity) {
                console.log('Car is not available for the requested dates.');
                return {
                    id: 1,
                    status: false,
                    statuscode:400,
                    message:"Some Error has Occured"
                };
            } else {
                console.log('Car is available for the requested dates.');
                //Function for booking the car
                const user = await this.userMutationService.carBooking(input);
                if (user) {
                    return {
                        id: user.id,
                        status: true,
                        statuscode:200,
                        message:"Booking Success"
                    };
                }
            }
        } catch (error) {
            console.log("Error booking the car", error);
            return{
                id: null,
                status: false,
                statuscode:500,
                message:"Internal Server Error"
            }
        }
    }
    //Controller for editing the uerinformation
    async editUserController(file,input)//gets image and data as input
    {
        try
        {
           let fileUrl=''
            if(file)
            {
            const userRole='user'//Defines the userrole
            fileUrl=await uploadFile(file,userRole);//uploads the new image to miniobucket
            }
            const user=this.userMutationService.editUserData(fileUrl,input)
            if(user)
            {
                return{
                    statuscode:200,
                    status:true,
                    message:"Data Updated",
                }
            }
        }catch (error) {
            console.log("Error in editUserController:", error);
            return{
                statuscode:500,
                status:false,
                message:"Updation Failed Interal Server Error",
               
            }
          }
    }

    //Controller for  managing password change of a user
    async editPasswordController(input)
    {
        try
        {
            const data= await this.userMutationService.editUserPassword(input)
         if(data.success===true)
         {
            return{
                status:true,
                statuscode:200,
                message:"Password Updated Successfully",
            }
         }
         else
         {
            return{
                status:false,
                statuscode:400,
                message:"Password updation Failed"
            }
         }
        }catch(error)
        {
            console.log("Error generated",error)
            return{
                status:false,
                statuscode:500,
                message:"Password updation Failed Interal Server Error",
            }
        }
    }

    //Controller for managing otp service
    async SendOtpController(phone, username, email)
    {
        console.log("Controller")
        console.log(phone,username,email)
        try
        {
            console.log("Otp Controller")
          const data=  await SendOtp(phone)//the phonenumber is passed to sendotp function 
          console.log("Sending Otp",data)
         console.log(phone,username,email)
            if(data.success===true)
            {
                return{
                    statuscode:200,
                    status:true,
                    message:"Otp has Send"
                }
            }
                else
                {
                    return{
                        statuscode:422,
                        status:false,
                        message:"Error Sending Otp"
                    }
            }
            
        }catch(error)
        {
            console.log("Error sending otp")
            return{
                status:false,
                statuscode:500,
                message:'Internal Server Error'
            }
        }
    }

    //Controller for verifying the  otp 
    async verifyOtpController(phone,otp)//phone number and otp are retrivied from user
    {
        try
        {
          const data=  await verifyOtp(phone,otp)
          console.log("Verify",data)
          if(data.success===true)
          {
          return {
            status: true,
            message: "Otp verified successfully",
            statuscode:200,
          }
        }
        else
        {
            return{
                status:false,
                statuscode:422,
                message:"OTP Verification Failed",
                
            }
        }

        }catch(error)
        {
            console.log("Error sending otp")
            return{
                status:false,
                statuscode:500,
                message:'Internal Server Error',
                
            }
        }
    }

    //Updating the paymemnt status at database if payment is verified then sinature and booking id is passed
    async upDateBoookingController(sign,id)
    {
        try
        {
           await this.userMutationService.updateBooking(sign,id)
        }catch(error)
        {
            console.log("Error Updating Payment",error)
        }
    }

    //Mutation for adding a review
    async reviewController(input)
    {
        try{
            const data= await this.userMutationService.addReview(input)
            if(data.status===true)
            {
                return{
                    status:true,
                    statuscode:200,
                    message:data.message
                    }
            }
            else
            {
                return{
                    status:false,
                    statuscode:400,
                    message:data.message
                }
            }
        }catch(error)
        {
            console.log("Error geenarted in controller")
            return{
                status:false,
                statuscode:500,
                message:"Internal Server Error"
            }
        }
    }
  
}


export default UserMutationController