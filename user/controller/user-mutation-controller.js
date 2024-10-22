import UserMutationService from "../Repo/mutation-helpers.js";
import { createToken } from "../../utils/createtoken.js";
import { uploadFile } from "../../utils/upload-file.js";

import SendOtp from "../../utils/send-otp.js";
import { createPresignedUrl } from "../../utils/createMinioUrl.js";
import verifyOtp from "../../utils/verify-otp.js";

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
                    status: true,
                    message: "User Registered Successfully",
                    data: user,
                };

            } else {
                return { 
                    status: false,
                    message: "Registration Failed",
                    data: null,
                };
            }
    
        } catch (error) {
            console.log("Error in UserController:", error);
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
                    status: "Error"
                };
            } else {
                console.log('Car is available for the requested dates.');
                //Function for booking the car
                const user = await this.userMutationService.carBooking(input);
                if (user) {
                    return {
                        id: user.id,
                        status: "Success"
                    };
                }
            }
        } catch (error) {
            console.log("Error booking the car", error);
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
            return user
        }catch (error) {
            console.log("Error in editUserController:", error);
            throw new Error("Error in editUserController");
          }
    }

    //Controller for  managing password change of a user
    async editPasswordController(input)
    {
        try
        {
            const data= await this.userMutationService.editUserPassword(input)
            return data
        }catch(error)
        {
            console.log("Error generated",error)
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
          const data=  SendOtp(phone)//the phonenumber is passed to sendotp function 
         console.log(phone,username,email)
          return data
        }catch(error)
        {
            console.log("Error sending otp")
            return{
                status:false,
                message:'Error Sending Otp'
            }
        }
    }

    //Controller for verifying the  otp 
    async verifyOtpController(phone,otp)//phone number and otp are retrivied from user
    {
        try
        {
          const data=  await verifyOtp(phone,otp)
          return {
            status: true,
            message: "Otp verified successfully",
            data: data
          }

        }catch(error)
        {
            console.log("Error sending otp")
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
    async reviewController(input)
    {
        try{
            return await this.userMutationService.addReview(input)
        }catch(error)
        {
            console.log("Error geenarted in controller")
        }
    }
    async getCarReviews(carid)
    {
        try
        {
            const data=await this.userMutationService.getReview(carid)
            if(data)
            {
                return{
                
                }
            }
        }catch(error)
        {
            console.log(error)
        }
    }
}


export default UserMutationController