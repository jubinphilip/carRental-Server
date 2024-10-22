import { Vehicles,RentVehicle,Manufacturer } from "../../admin/graphql/typedef/models/admin-models.js";
import {User,Booking, Review} from '../graphql/typedefs/models/user-models.js'

class UserQueryService{
  
  async getUser(id) {
    try {
       
        const data = await User.findByPk(id); 
        if (data) {
         // console.log(data)
            return data;
        } else {
            
            console.log(`User with ID ${id} not found.`);
            return null;
        }
    } catch (error) {
        console.error("Error generated:", error); 
        throw error;
    }
}
    async getCarInfo(id) {
        try {
          const rentRecords = await RentVehicle.findAll({
            where: { id }, 
            include: {
              model: Vehicles,
              include: Manufacturer,
            },
          });
      
          console.log('Rent Records:', JSON.stringify(rentRecords, null, 2));
          return rentRecords[0];
        } catch (error) {
          console.error('Error fetching rent records:', error);
          throw error; 
        }
      }

      //Function for retriving all booked date of a particular car
      async getBookingDates({ carId, quantity }) {
        console.log("Car ID:", carId, "Quantity:", quantity);
        try {
            const bookings = await Booking.findAll({
                where: {
                    carid: carId,
                    payment_status: 'Completed' 
                },
            });
    
           // console.log("Bookings fetched:", bookings);
    
            const bookingsByDate = {};
    
            bookings.forEach(booking => {
                const startDate = new Date(booking.startdate);
                const endDate = new Date(booking.enddate);
    
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    const date = d.toISOString().split('T')[0];
                    if (!bookingsByDate[date]) {
                        bookingsByDate[date] = 0;
                    }
                    bookingsByDate[date]++;
                }
            });
    
           // console.log("Bookings by date:", bookingsByDate);
    
            const availableCars = parseInt(quantity, 10);
            const bookedDates = Object.keys(bookingsByDate).filter(date => bookingsByDate[date] >= availableCars);
    
          //  console.log("Filtered booked dates:", bookedDates);
    
            return {
                id: carId,
                dates: bookedDates
            }
        } catch (error) {
            console.log("Error generated", error);
            return [];
        }
    }

    //Retrive bookings by the user
    async getUsersBookings(userId) {
      try {
          const records = await Booking.findAll({
              where: { 
                  userid: userId,                
              },
              include: [
                  {
                      model: User,
                      attributes: ['id', 'username', 'phone'],
                  },
                  {
                      model: RentVehicle,
                      include: [
                          {
                              model: Vehicles,
                              include: [
                                  {
                                      model: Manufacturer,
                                      attributes: ['id', 'manufacturer', 'model'],
                                  },
                              ],
                              attributes: ['id', 'type', 'seats', 'transmission', 'fuel','fileurl'],
                          },
                      ],
                      attributes: ['id', 'price'],
                  },
              ],
          });
       return records;  
      } catch (error) {
          console.error("Error fetching bookings:", error);
          throw error;  
      }
  }
  //getting all reviews with carid
  async getAllReviews(carid)
  {
   const data=await Review.findAll({
    where:{
        carid:carid
    },
    include:[
        {
            model:User,
            attributes:['id','username','createdAt']
        }
    ],
   })
   //console.log("Datas",data)
   if(data.length>0)
   {
    //getting the average rating and returning it
    const totalrating=data.reduce((sum,review)=>sum+review.rating,0)
    const averageRating=totalrating/data.length
    //console.log("Rating",averageRating)
    return{
        averageRating,
        reviews:data,
    }
   }
  }
}    

export default UserQueryService;