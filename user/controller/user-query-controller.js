import { createPresignedUrl } from "../../utils/createMinioUrl.js"
import UserQueryService from "../repo/query-helpers.js"
class UserQueryController{
    constructor()
    {
        this.userQueryService=new UserQueryService()
    }
    //Controller Function for retriving userdata
    async getUserdata(id)
        {
            try {
                const userdata=await this.userQueryService.getUser(id)
                if(userdata)
                {
                    console.log(userdata.fileurl)
                    userdata.fileurl=await createPresignedUrl(userdata.fileurl)
                    console.log(userdata)
                    return userdata
                }
            } catch (error) {
                console.log(error)
            }
        
        }
        //Controller for displaying the user carinformation
   async carInfoController(id)
   {
    try{
        const carinfo=this.userQueryService.getCarInfo(id)
        if(carinfo)
        {
        return carinfo
        }
        else
        {
            console.log("No data found")
        }
    }catch(error)
    {
        console.log("Error generated",error)
    }
   }
   async  getBookingsController(carId,quantity)
   {
    try{
        const bookinginfo=await this.userQueryService.getBookingDates(carId,quantity)
        return bookinginfo
    }catch(error)
    {
        console.log(error)
    }
   }
   // Controller Function for dispalying the user his bookings
   async getUserBookings(id)
   {
    try{
        const userdata=await this.userQueryService.getUsersBookings(id)
        console.log(userdata)
        return userdata
    }
    catch(error)
    {
        console.log("Error in Controller",error)
    }
   }

   //Controller Function for Retrieving Reviews and ratings by the user
   async getCarReviews(carid)
   {
    try{
        const reviewData=await this.userQueryService.getAllReviews(carid)
        return reviewData
    }catch(error)
    {
        console.log(error)
    }
   }
}
export default UserQueryController