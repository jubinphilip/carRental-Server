import AdminQueryService from "../Repo/query-helpers.js";
class AdminQueryController{
  //Creating the constructor
    constructor()
    {
        this.adminQueryService=new AdminQueryService()
    }

    //Controller for getting manufacturers
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

    //Controller for getting cars
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
    //Controller for getting car by id
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
    //Controller  for getting rentedvehicles
    async rentVehicles(dateRange)
    {
      try{
        const getRentedVehicles=await this.adminQueryService.getRentedVehicles(dateRange)
        return getRentedVehicles
      }catch(error)
      {
        console.log("Error generated",error)
      }
    }
    //Function for retrieving all bookings
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