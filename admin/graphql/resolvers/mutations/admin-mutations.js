import AdminMutationController from '../../../controller/admin-mutation-controller.js';
const adminMutationController=new AdminMutationController()
import { GraphQLUpload } from 'graphql-upload';
const adminMutationResolver = {
  Upload: GraphQLUpload,
  Mutation: {   
  
    addAdmin: async (_, { input }) => {
      try {
        return await adminMutationController.addAdmin(input);
      } catch (error) {
        console.log("Error adding admin:", error);
        throw new Error("Error adding admin");
      }
    },

    adminLogin:async(_,{input})=>{
      try{
        console.log(input)
        return await adminMutationController.adminLogin(input);
      }catch(error)
      {
        console.log("Error In Login", error);
        throw new Error("Login Error");
      }
    },

    addManufacturer:async(_,{input})=>{
      try{
          console.log(input)
          return await adminMutationController.addManufacturer(input);
      }
      catch(error)
      {
        console.log(error)
      }
    },

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
    
  
  deleteVehicle:async(_,{id})=>{
  
    try{
      const deletedVehicle=await adminMutationController.deleteCar(id)
      return deletedVehicle
    }catch(error)
    {
      console.error("Error deleting vehicle:", error);
    }
  },
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
    uploadExcel: async (parent, { file }) => {
      try
      {
          return await adminMutationController.addExcelData(file)
      }catch(error)
      {
        console.log("error reading data")
      }
    },
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
