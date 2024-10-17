import { Admin } from "../../typedef/models/admin-models.js";
import { ApolloError } from "apollo-server-errors";
import AdminQueryController from "../../../controller/admin-query-controller.js";
const adminQueryController=new AdminQueryController()
const adminQueryResolver = {
  Query: {
    getAdmin: async (parent, args, context, info) => {
      const { id } = args;
      try {
        const admin = await Admin.findByPk(id); // Fetch single admin by primary key
        if (!admin) {
          throw new ApolloError('Admin not found', 'NOT_FOUND');
        }
        return admin;
      } catch (error) {
        console.error("Error Fetching Admin:", error);
        throw new ApolloError('Error fetching admin', 'INTERNAL_SERVER_ERROR');
      }
    },
    getManufacturers:async()=>{
      try
      {
        const data= await  adminQueryController.getManufacturers()
      //  console.log(data)
        return data
      }catch(error)
      {
        console.log(error,'Error Occured')
      }
  },
  getCarsData:async()=>{
    const cars=adminQueryController.getCars()
    return cars
  },
  getCarData:async(_,{id})=>{
    console.log("Function Called")
    const cars=adminQueryController.getCar(id)
    return cars
  },
  rentVehicles:async(_,args)=>{
    const {dateRange}=args
    try
    {
    const data=await adminQueryController.rentVehicles(dateRange)
    return data
    }catch(error)
    {
      console.log("Error")
    }
  },
  getBookings:async()=>
  {
   const data=adminQueryController.bookingController()
   return data
  }
}
};

export default adminQueryResolver;
