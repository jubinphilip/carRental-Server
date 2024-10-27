import cron from 'node-cron'
import { BookingCart } from '../user/graphql/typedefs/models/user-models.js'
import { Op } from 'sequelize';
//Function for clearing the failed bookings after every one minute
const clearBooking=async()=>{
cron.schedule('*/1 * * * *',async()=>
{
    try{
        const now=new Date()
        //if the booking is done before one minute and payment is not yet updated then the booking will gets cleared automatically
        const cutoffDate = new Date(now - 60 * 1000);
        await BookingCart.destroy({
            where: {
              createdAt: {
                [Op.lt]: cutoffDate,
              },
            },
          });
          console.log('Cleanup job executed, old failed bookings removed.');
} catch (error) {
    console.error('Error during cleanup job:', error);
}
})
}
export  default clearBooking