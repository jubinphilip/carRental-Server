import bcrypt from 'bcrypt'
import { Admin,Manufacturer, Vehicles,RentVehicle} from '../graphql/typedef/models/admin-models.js'
import  {addVehicleToCollection}  from '../../utils/manage-typesense.js'
import { Booking } from '../../user/graphql/typedefs/models/user-models.js'
import { Sequelize } from 'sequelize'

class AdminMutationService{
    async addAdmin(input){
        try{
            const {username,password}=input
            const hashedPassword = await bcrypt.hash(password, 10)
            const admin = await Admin.create({username,password:hashedPassword})
            console.log(admin)
            return admin
        }catch(error)
        {
            console.log(error)
            throw new Error("error adding admin")
        }
    }
    async adminLogin(input) {
        try {
            const { username, password } = input;
            const admin = await Admin.findOne({ where: { username } });
            console.log(admin)
            if (!admin) {
                return { error: "Admin not found", status: false };
            }
            const isValidPassword = await bcrypt.compare(password, admin.password);
            if (!isValidPassword) {
                return { error: "Invalid password", status: false };
            }  
            return {
               admin
            };
        } catch (error) {
            console.log("Error logging in admin", error);
            throw new Error("Internal server error");
        }
    }
    async addManufacturer(input)
    {
        try{
            console.log(input)
            const{manufacturer,model,year}=input
            const data = await Manufacturer.create({manufacturer,model,year})
           // console.log(data)
            return data
        }catch(error)
        {
            console.log(error)
            throw new Error("error adding admin")
        }
    }
    async addExcelData(records)
    {
        try
        {
        for (const record of records) {

            await Manufacturer.create({
              manufacturer: record.manufacturer,
              model: record.model,
              year: record.year,
            });
          }
        }catch(error)
        {
            console.log(error)
        }
        };
    
        async addVehicle({ primaryImageUrl, secondaryImageUrls, manufacturer_id, type, transmission, fuel, seats, description }) {
            try {
                const newVehicle = await Vehicles.create({
                    fileurl:primaryImageUrl,
                    secondaryImageUrls, 
                    manufacturer_id,
                    type,
                    transmission,
                    fuel,
                    seats,
                    description,
                });
                return newVehicle;
            } catch (error) {
                console.log("Error occurred while inserting into database", error);
                throw new Error("Database insertion failed");
            }
        }
        
        async addRentVehicle(input) {
            const { vehicleid, price, quantity } = input;
            try {
                const isExisting= await RentVehicle.findOne({
                    where: { carid: vehicleid }  
                  });
                  if(isExisting)
                  {
                        await RentVehicle.update(
                            {
                                price,
                                quantity
                            },
                            {
                                where: { carid: vehicleid } 
                            }
                        )
                  }
                  else
                  {
                const newCar = await RentVehicle.create({
                    carid: vehicleid,
                    price,
                    quantity
                });
                console.log("Data Added");
        
                const id = newCar.id;
                
                try {
                    const rentRecords = await RentVehicle.findByPk(id, {
                        include: {
                            model: Vehicles,
                            include: {
                                model: Manufacturer,
                                attributes: ['id', 'manufacturer', 'model', 'year'],
                            },
                            attributes: ['id', 'type', 'seats', 'transmission', 'fileurl', 'secondaryImageUrls', 'fuel', 'description'],
                        },
                    });
        
                    if (rentRecords) {
                        console.log("Rent records found:", rentRecords);
                        
                        const vehicleData = {
                            id: String(rentRecords.id), 
                            carid:String(rentRecords.Vehicle?.id),
                            manufacturer: rentRecords.Vehicle?.Manufacturer?.manufacturer || '',
                            model: rentRecords.Vehicle?.Manufacturer?.model || '',
                            image:rentRecords.Vehicle?.fileurl || '', 
                            year: rentRecords.Vehicle?.Manufacturer?.year || '',
                            price: newCar.price, 
                            type: rentRecords.Vehicle?.type || '', 
                        };
                
                        console.log("TypeSense Data", vehicleData);
                        await addVehicleToCollection(vehicleData);
                    }
                    return newCar;
                } catch (error) {
                    console.log("Error finding rent records:", error);
                }
                }
            } catch (error) {
                console.log("Error creating rent vehicle:", error);
            }
        }
        
    async editVehicle(fileurl, input) {
        const { manufacturer_id, type, transmission, fuel, seats, description, id } = input;
    
        const updateData = {};
    
        if (fileurl !== null) updateData.fileurl = fileurl;
        if (manufacturer_id !== null) updateData.manufacturer_id = manufacturer_id;
        if (type !== null) updateData.type = type;
        if (transmission !== null) updateData.transmission = transmission;
        if (fuel !== null) updateData.fuel = fuel;
        if (seats !== null) updateData.seats = seats;
        if (description !== null) updateData.description = description;
    
        try {
            if (Object.keys(updateData).length > 0) {
                const [updatedRowsCount] = await Vehicles.update(updateData, {
                    where: { id }
                });
    
                if (updatedRowsCount > 0) {
                    console.log("Vehicle updated successfully.");
               
                    const updatedVehicle = await Vehicles.findByPk(id);
                    return updatedVehicle;
                } else {
                    console.log("No vehicle found with the provided ID.");
                    return null; 
                }
            } else {
                console.log("No fields to update. Incoming data is all null.");
                return null; 
            }
        } catch (error) {
            console.log("Error occurred while updating the database:", error);
            throw new Error("Failed to update vehicle");
        }
    }
    async deleteVehicle(id) {
        try {
            const deletedVehicle = await Vehicles.destroy({
              where: { id },
            })
            console.log(deletedVehicle)
            return deletedVehicle
        }catch (error) {
            console.log(error);
        }
    }
    async deleteRentVehicle(id)
    {
        try {
            const deletedVehicle = await RentVehicle.destroy({
              where: { id },
            })
            console.log(deletedVehicle)
            return deletedVehicle
        }catch (error) {
            console.log(error);
        }
    }
    async updateBooking(input)
    {
        const{id,status,carid}=input
        console.log(id,status,carid)
        if (status == 'returned') {
            try {
                await Booking.update(
                    { status: 'Returned' }, 
                    {
                        where: {
                            id: id 
                        }
                    }
                );
                console.log('Booking status updated to Returned');
                return{
                    status:true
                }
            } catch (error) {
                console.error('Error updating booking status:', error);
            }
        }
        else
        {
            try {
                await Booking.update(
                    { status: 'Not Returned' }, 
                    {
                        where: {
                            id: id 
                        }
                    }
                );
                try {
                    await RentVehicle.update(
                        { quantity: Sequelize.literal('quantity - 1') }, 
                        {
                            where: {
                                id: carid 
                            }
                        }
                    );
                    console.log('Quantity decreased by one for car ID:', carid);
                } catch (error) {
                    console.error('Error updating vehicle quantity:', error);
                }
                
                return{
                    status:true,
                }
            } catch (error) {
                console.error('Error updating booking status:', error);
            }
        }
    }
}
export default AdminMutationService