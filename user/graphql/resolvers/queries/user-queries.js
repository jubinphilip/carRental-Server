import UserQueryController from "../../../controller/user-query-controller.js";
const userQuerycontroller=new UserQueryController()
const userQueryResolver = {
  Query: {
    getUser:async(_,{id})=>
    {
      try
      {
          const data=await userQuerycontroller.getUserdata(id)
          return data
      }catch(error)
      {
        console.log("Error generated",error)
      }
    },
    getCarInfo:async(_,{id})=>
    {
      try
      {
        const data= await userQuerycontroller.carInfoController(id)
        return data
      }catch(error)
      {
        console.log("Error",error)
      }
    },
    bookedDates:async(_,carId,quantity)=>
    {
      try
      {
        const data=await userQuerycontroller.getBookingsController(carId,quantity)
        return data
      }catch(error)
      {
        console.log("error",error)
      }

    },
    getUserBookings:async(_,args)=>
    {
    const{id}=args
    try
    {
      return await userQuerycontroller.getUserBookings(id)
    }catch(error)
    {
      console.log("Error generated",error)
    }
    }
  },
};

export default userQueryResolver;
