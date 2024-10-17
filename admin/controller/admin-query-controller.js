import AdminQueryService from "../Repo/query-helpers.js";
class AdminQueryController{
    constructor()
    {
        this.adminQueryService=new AdminQueryService()
    }
    async getManufacturers()
    {
      try{
        const data=await this .adminQueryService.getmanufacturersData()
        return data
      }catch(error)
      {
        console.log("Error occured at controller",error)
      }
    }
    async getCars()
    {
      try{
        const getVehicles=await this.adminQueryService.getCars()

        return getVehicles
      }catch(error)
      {
        console.log("Error generated",error)
      }
    }
    async getCar(id)
    {
        try{
          const getVehicle=await this.adminQueryService.handleGetCar(id)
          return getVehicle
        }catch(error)
        {
          console.log("Error",error)
        }
    }
    async rentVehicles()
    {
      try{
        const getRentedVehicles=await this.adminQueryService.getRentedVehicles()
        return getRentedVehicles
      }catch(error)
      {
        console.log("Error generated",error)
      }
    }
    async bookingController()
    {
      try
      {
        const bookingsdata=await this.adminQueryService.getAllBookings()
        return bookingsdata
      }
      catch(error)
      {
        console.log("Error",error)
      }
    }
}
export default AdminQueryController