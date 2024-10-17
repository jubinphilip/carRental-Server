import { Booking,User } from '../../user/graphql/typedefs/models/user-models.js';
import { Manufacturer, Vehicles,RentVehicle} from '../graphql/typedef/models/admin-models.js'

class AdminQueryService{
  
    async getmanufacturersData()
    {
        try
        {
       const data= await Manufacturer.findAll()
       return data
        }
        catch(error)
        {
            console.log("error ",error)
        }
    }
    async getCars() {
        try {
            const data = await Vehicles.findAll({
                include: {
                    model: Manufacturer,  
                    attributes: ['id', 'manufacturer', 'model', 'year'],
                },
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    }
    async handleGetCar(id)
    {
        try {
            const vehicle = await Vehicles.findOne({
              where: { id: id }, 
              include: {
                model: Manufacturer,  
                attributes: ['id', 'manufacturer', 'model', 'year'],
            },
            });
            //console.log(vehicle)
            if (!vehicle) {
              throw new Error('Vehicle not found');
            }
            return vehicle
          } catch (error) {
            throw new Error(error.message);
          }
        }
        async getRentedVehicles() {
          try {
              const rentRecords = await RentVehicle.findAll({
                  include: {
                      model: Vehicles,
                      include: {
                          model: Manufacturer,
                          attributes: ['id', 'manufacturer', 'model', 'year'],
                      },
                      attributes: ['id', 'type', 'seats', 'transmission', 'fileurl', 'secondaryImageUrls', 'fuel', 'description'],
                  },
              });
              console.log('Rent Records:', JSON.stringify(rentRecords, null, 2));
              return rentRecords;
          } catch (error) {
              console.error('Error fetching rent records:', error);
              throw error; 
          }
      }
      
      async getAllBookings() {
        try {
            const records = await Booking.findAll({
                where: {
                    payment_status: 'Completed' 
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
                                attributes: ['id', 'type', 'seats', 'transmission', 'fuel'],
                            },
                        ],
                        attributes: ['id', 'price'],
                    },
                ],
            });
            console.log(JSON.stringify(records, null, 2)); 
            return records;
        } catch (error) {
            console.error('Error fetching booking records:', error);
        }
    }
  }    
export default AdminQueryService;