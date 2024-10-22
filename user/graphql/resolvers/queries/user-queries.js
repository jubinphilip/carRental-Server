import UserQueryController from "../../../controller/user-query-controller.js";
const userQuerycontroller=new UserQueryController()
const userQueryResolver = {
  Query: {
    //Query for retriving the user profile
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

    //Query for retrieving Car information
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

    //Query for retriving booked dates of a  
    bookedDates:async(_,carId,quantity)=>
    {
      try
      {
        //passing the quantity and carid to the controller
        const data=await userQuerycontroller.getBookingsController(carId,quantity)
        return data
      }catch(error)
      {
        console.log("error",error)
      }

    },
    //Query for viewing a user his bookings
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
    },
    async getCarReviews(_,args)
    {
      const {carId}=args
        try
        {
        const data= await userQuerycontroller.getCarReviews(carId)
        console.log(JSON.stringify(data, null, 2));
        return data
        }catch(error)
        {
          console.log("Error generated")
        }
    }
  },
};

export default userQueryResolver;
