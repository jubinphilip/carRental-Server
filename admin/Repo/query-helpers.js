import { Booking,User } from '../../user/graphql/typedefs/models/user-models.js';
import { Manufacturer, Vehicles,RentVehicle} from '../graphql/typedef/models/admin-models.js'
import { Op,fn,col,Sequelize} from 'sequelize';
class AdminQueryService{
  //Function for getting all manufacturers
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
    //Function for getting cars
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
    //Function for getting a single car
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
    //Function for getting all rented vehicles  for both admin and user
        async getRentedVehicles(dateRange) {//date range is optional when a user logins he sometimes passes a daterange 
            if(dateRange)
            {
                //if date range is present deal with it
            const [date1, date2] = dateRange;
            const convertedstartDate = new Date(date1);
            const convertedendDate = new Date(date2);
            convertedstartDate.setDate(convertedstartDate.getDate() + 1);//ond day is added with incoming date so that it deals with the conflicts of GMT
            convertedendDate.setDate(convertedendDate.getDate() + 1);
            //converts date to startdate and enddate
            if (convertedendDate && convertedstartDate) {
                const startDate = new Date(convertedstartDate).toISOString().split('T')[0];
                const endDate = new Date(convertedendDate).toISOString().split('T')[0];
                console.log("Start Date:", startDate, "End Date:", endDate);
        //Finds all bookings
                try {
                    const bookings = await Booking.findAll({
                        where: {
                            payment_status: 'Completed',
                            [Op.or]: [
                                {
                                    startdate: {
                                        [Op.lt]: endDate,
                                    },
                                    enddate: {
                                        [Op.gt]: startDate,
                                    },
                                },
                                {
                                    startdate: {
                                        [Op.gte]: startDate,
                                    },
                                    enddate: {
                                        [Op.lte]: endDate,
                                    },
                                },
                            ],
                        },
                        attributes: [
                            'carid',
                            [fn('COUNT', col('id')), 'count'], 
                        ],
                        group: ['carid'],
                    });
  //Finds  all rentedvehicles
                    const rentdata = await RentVehicle.findAll();
                    //console.log("Vehicles", rentdata);
        
                    const bookingsMap = {};
                    bookings.forEach(booking => {
                        bookingsMap[booking.dataValues.carid] = booking.dataValues.count;
                    });
        
                    console.log("Maap",bookingsMap)

                    const availableVehicles = rentdata.filter(vehicle => {
                        const id = String(vehicle.dataValues.id); 
                        const bookingCount = parseInt(bookingsMap[id] || '0'); 
                        console.log(id, vehicle.dataValues.quantity, bookingCount, "bookingsCount");
                        return bookingCount < vehicle.dataValues.quantity; 
                    });
                    
                    const availableCarIds = availableVehicles.map(vehicle => vehicle.dataValues.id);

                    console.log("Available Vehicles", availableVehicles);
                    console.log("Available Car IDs", availableCarIds);
//Returning available cars for that daterange
                    const rentRecords=await RentVehicle.findAll({
                        where:{
                            id:availableCarIds,
                            quantity: {
                                [Sequelize.Op.gt]: 0  
                              }
                        },
                        include: {
                            model: Vehicles,
                            include: {
                                model: Manufacturer,
                                attributes: ['id', 'manufacturer', 'model', 'year'],
                            },
                            attributes: ['id', 'type', 'seats', 'transmission', 'fileurl', 'secondaryImageUrls', 'fuel', 'description'],
                        },
                    })
                    return rentRecords;
                } catch (error) {
                    console.log("Error:", error);
                }
            }
            }
            else
            {
//if daterange is not given
try {
    const rentRecords = await RentVehicle.findAll({
      where: {
        quantity: {
          [Sequelize.Op.gt]: 0  
        }
      },
      include: {
        model: Vehicles,
        attributes: ['id', 'type', 'seats', 'transmission', 'fileurl', 'secondaryImageUrls', 'fuel', 'description'],
        include: {
          model: Manufacturer,
          attributes: ['id', 'manufacturer', 'model', 'year'],
        }
      }
    });
  
    // console.log('Rent Records:', JSON.stringify(rentRecords, null, 2));
    return rentRecords;
  } catch (error) {
              console.error('Error fetching rent records:', error);
              throw error; 
          }
      }
    }
     //Function for returning all bookings 
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