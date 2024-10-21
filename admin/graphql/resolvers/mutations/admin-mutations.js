import AdminMutationController from '../../../controller/admin-mutation-controller.js';
const adminMutationController=new AdminMutationController()
import { Loginschema } from '../../../../user/requests/user-loginrequest.js';
import { carSchema } from '../../../requests/manufacturer-request.js';
import { GraphQLUpload } from 'graphql-upload';
const adminMutationResolver = {
  Upload: GraphQLUpload,//GraphQLUploadFor handling imageupload
  Mutation: {   
  //mutaion for adding admin
    addAdmin: async (_, { input }) => {
      try {
        return await adminMutationController.addAdmin(input);
      } catch (error) {
        console.log("Error adding admin:", error);
        throw new Error("Error adding admin");
      }
    },
//mutation for logging in admin
adminLogin: async (_, { input }) => {
  try {
    const { username, password } = input;
    const email = username;

   
    const { value, error } = Loginschema.validate({ email, password });
    // Handle validation error
    if (error) {
      console.log(error);
      return {
        id: null,
        email: null,
        status: false,
        message: error.details[0].message,  
      };
    }


    return await adminMutationController.adminLogin(value);
    
  } catch (error) {
    console.log("Error In Login", error);
    throw new Error("Login Error");
  }
},


//mutation for adding a Manufacturer
    addManufacturer:async(_,{input})=>{
      try{
          console.log(input)
          const{value,error}=carSchema.validate(input)
          if(error){
            console.log(error)
            return{
              id:null,
              status:false,
              message:error.details[0].message
            }
          }
          return await adminMutationController.addManufacturer(value);
      }
      catch(error)
      {
        console.log(error)
      }
    },
//Mutation for adding a new vehicle
    addVehicle: async (_, { primaryFile, secondaryFiles, input }) => {
      try {
        const vehicle = await adminMutationController.addVehicleController(primaryFile, secondaryFiles, input);
    
        if (vehicle) {
          console.log("Vehicle Added", vehicle);
          return vehicle; 
        }
      } catch (error) {
        console.error("Error adding vehicle:", error);
        throw new Error("Failed to add vehicle");
      }
    },
    
  //Mutation for deleting  a car
  deleteVehicle:async(_,{id})=>{
  
    try{
      const deletedVehicle=await adminMutationController.deleteCar(id)
      return deletedVehicle
    }catch(error)
    {
      console.error("Error deleting vehicle:", error);
    }
  },

  //Mutation for deleting a rented vehicle
  deleteRentVehicles:async(_,{id})=>
  {
    try{
      const deletedVehicle=await adminMutationController.deleteRentCar(id)
      return deletedVehicle
    }catch(error)
    {
      console.error("Error deleting vehicle:", error);
    }
  },
  //Mutation for editing a vehicle information
  editVehicle:async(_,{file,input})=>
  {
    try{
        
      const Vehicle=await adminMutationController.editVehicleController(file,input)
      return Vehicle
    }catch(error)
    {
      console.error("Error adding vehicle:", error);
    }
  },

  //Mutation for adding vehicle to rent
  addRent:async(_,{input})=>
    {
      try{
          console.log("Function Called")
        const Vehicle=await adminMutationController.rentVehicle(input)
        return Vehicle
      }catch(error)
      {
        console.error("Error adding vehicle:", error);
      }
    },

//mutation for adding data from an excel sheet to database
uploadExcel: async (parent, { file }) => {
  try
  {
      return await adminMutationController.addExcelData(file)
  }catch(error)
  {
    console.log("error reading data")
  }
},
//Mutation for dealing with the  return of vehicle
updateReturnVehicle:async(_,{input})=>
    {
      try
      {
        return await adminMutationController.updateBookingController(input)
      }catch(error)
      {
        console.log(error)
      }
    }
  }
  
};

export default adminMutationResolver;
