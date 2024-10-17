import UserMutationService from "../Repo/mutation-helpers.js";
import { createToken } from "../../utils/createtoken.js";
import { uploadFile } from "../../utils/upload-file.js";
import { Booking } from "../graphql/typedefs/models/user-models.js";
import { Op } from "sequelize";
import SendOtp from "../../utils/send-otp.js";
import verifyOtp from "../../utils/verify-otp.js";
import { stat } from "fs";
class UserMutationController{
    constructor(){  
        this.userMutationService = new UserMutationService();
    }
    async registerUser(file, input) {
        try {
            const fileUrl = await uploadFile(file);
            const user = await this.userMutationService.registerUser(fileUrl, input); // Ensure to await this if it's a promise
            
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
    

    async loginUser(input)
    {
        try{
            const user=await this.userMutationService.loginUser(input)
            console.log(user)
            if(user.status!=false)
            {
                console.log(user.id,user.email,user.fileurl)
                const token = await createToken({ id: user.id, email: user.email });
                console.log(token)
                return{
                    id:user.id,
                    email:user.email,
                    fileurl:user.fileurl,
                    username:user.username,
                    token:token,
                    status:true,
                    message:"User Loginned"
                }
            }
            else
            {
                return{
                    id:null,
                    email:null,
                    fileurl:null,
                    username:null,
                    token:null,
                    status:false,
                    message:user.error
                }
            }
        }catch(error){
            console.log("Error in UserController:", error);
            throw new Error("Error in UserController");
        }
    }
    async bookCar(input)
    {
        const { startdate, enddate, carid, quantity } = input;
        try {
         
            const availability = await Booking.findAll({
                where: {
                    carid: carid,
                    payment_status: 'Completed',
                   
                    [Op.or]: [
                        {
                            startdate: {
                                [Op.lte]: enddate, 
                            },
                            enddate: {
                                [Op.gte]: startdate, 
                            },
                        },
                        {
                            startdate: {
                                [Op.gte]: startdate, 
                            },
                            enddate: {
                                [Op.lte]: enddate, 
                            },
                        }
                    ],
                },
            });
            console.log(availability.length)
            if (availability.length >=quantity) {
                console.log('Car is not available for the requested dates.');
                return{
                    id:1,
                    status:"Error"
                }
            } else {
                console.log('Car is available for the requested dates.');
                const user=await this.userMutationService.carBooking(input)
                if(user)
                {
                    return{
                        id:user.id,
                        status:"Success"
                    }
                }
            }
        } 
        catch(error)
    {
        console.log("Error generated",error)
    }
    }

    async editUserController(file,input)
    {
        try
        {
           let fileUrl=''
            if(file)
            {
            fileUrl=await uploadFile(file);
            }
            const user=this.userMutationService.editUserData(fileUrl,input)
            return user
        }catch (error) {
            console.log("Error in editUserController:", error);
            throw new Error("Error in editUserController");
          }
    }
    async editPasswordController(input)
    {
        try
        {
            const data=this.userMutationService.editUserPassword(input)
            return data
        }catch(error)
        {
            console.log("Error generated",error)
        }
    }
    async SendOtpController(phone, username, email)
    {
        console.log("Controller")
        console.log(phone,username,email)
        try
        {
            console.log("Otp Controller")
          //const data=  SendOtp(phone)
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
    async verifyOtpController(phone,otp)
    {
        try
        {
          const data=  verifyOtp(phone,otp)
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
    async upDateBoookingController(sign,id)
    {
        try
        {
            const data=this.userMutationService.updateBooking(sign,id)
        }catch(error)
        {
            console.log("Error Updating Payment",error)
        }
    }
    
}


export default UserMutationController