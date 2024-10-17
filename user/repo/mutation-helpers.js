
import bcrypt from 'bcrypt'
import {Booking, User} from '../graphql/typedefs/models/user-models.js';
import {  Op } from 'sequelize';
import sequelize from '../../config/db.js';
import { RentVehicle } from '../../admin/graphql/typedef/models/admin-models.js';

class UserMutationService{
    async registerUser(fileurl,input) {
        const{username,email,phone,city,state,country,pincode,password}=input
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({
            fileurl,
              username,
              email,
              phone,
              city,
              state,
              country,
              pincode,
              password: hashedPassword
            });
      
            return user; 
          } catch (error) {
            console.error('Error adding user:', error);
            return ({status:false})
          }
    }

    async loginUser(input){
        try{
            const {email,password}=input
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return { error: "User not found", status: false };
              
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { error: "Invalid password", status: false };
            }
            return user
        }catch{
            console.error('Error logging in user:', error);
        }
    }

    async carBooking(input) {
        const { carid, userid, startdate, enddate,quantity, startlocation, droplocation, amount } = input;
    
        const transaction = await sequelize.transaction();
        try {
            const car = await RentVehicle.findOne({
                where: { id: carid },
                transaction,
            });
    
            if (!car) {
                throw new Error("Car not found");
            }
            const existingBookings = await Booking.findAll({
                where: {
                    carid,
                    [Op.or]: [
                        {
                            startdate: {
                                [Op.lte]: enddate, 
                            },
                            enddate: {
                                [Op.gte]: startdate, 
                            },
                        },
                    ],
                },
                transaction,
            });
    
            if (existingBookings.length > quantity) {
                throw new Error("Car is already booked for the selected dates");
            }
    
            const booking = await Booking.create({
                carid,
                userid,
                startdate,
                enddate,
                payment_status:"pending",
                startlocation,
                droplocation,
                amount,
            }, { transaction });
    
        
            await transaction.commit();
    
            return booking;
    
        } catch (error) {
           
            await transaction.rollback();
            console.error("Error generated:", error.message);
            throw new Error("Booking failed: " + error.message);
        }
    }
    
    async editUserData(fileurl, input) {
        const { userid, username, email, phone, city, state, country, pincode } = input;
    
        
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (city) updateData.city = city;
        if (state) updateData.state = state;
        if (country) updateData.country = country;
        if (pincode) updateData.pincode = pincode;
        if (fileurl) updateData.fileurl = fileurl;
    
        try {
            const user = await User.update(updateData, {
                where: { id: userid },
                returning: true,
            });
    
            return user;
        } catch (error) {
            console.log("Error generated", error);
            throw new Error("Failed to update user data"); 
        }
    }
  
    async editUserPassword(input) {
        const { id, currentPswd, newPswd } = input;
        try {
            // Find the user by ID
            const user = await User.findByPk(id);
            
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            const isMatch = await bcrypt.compare(currentPswd, user.password);
            
            if (!isMatch) {
                return { success: false, message: 'Current password is incorrect' };
            }
            const hashedNewPassword = await bcrypt.hash(newPswd, 10);
            user.password = hashedNewPassword;
            await user.save();
    
            return { success: true, message: 'Password updated successfully' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'An error occurred while updating the password' };
        }
    }

    async updateBooking(sign, id) {
        try {
            const updatedBooking = await Booking.update(
                {
                    payment_status: 'Completed',
                    razorpay_signature: sign 
                },
                {
                    where: {
                        id: id
                    }
                }
            );
            if (updatedBooking[0] === 0) {
                console.log('No booking found with the provided ID.');
                return { success: false, message: 'No booking found.' };
            }
            console.log('Booking updated successfully:', updatedBooking);
            return { success: true, message: 'Booking updated successfully.' };
        } catch (error) {
            console.error('Error updating booking:', error);
            throw new Error('Error updating booking');
        }
    }
    
    
}
export default UserMutationService