import UserQueryService from "../Repo/query-helpers.js"
class UserQueryController{
    constructor()
    {
        this.userQueryService=new UserQueryService()
    }
    async getUserdata(id)
        {
            try {
                const userdata=this.userQueryService.getUser(id)
                if(userdata)
                {
                    return userdata
                }
            } catch (error) {
                console.log(error)
            }
        
        }
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
}
export default UserQueryController