import AdminMutationController from '../../../controller/admin-mutation-controller.js';
const adminMutationController=new AdminMutationController()
import { Loginschema } from '../../../../user/requests/user-loginrequest.js';
import { carSchema, modelSchema, vehicleSchema } from '../../../requests/manufacturer-request.js';
import { GraphQLUpload } from 'graphql-upload';
const adminMutationResolver = {
  Upload: GraphQLUpload,//GraphQLUploadFor handling imageupload
  Mutation: {   
  //mutaion for adding admin
    addAdmin: async (_, { input }) => {
      try {
        return await adminMutationController.addAdmin(input);
      } catch (error) {
      //  console.log("Error adding admin:", error);
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
     // console.log(error);
      return {
        statuscode:422,
        status: false,
        message: error.details[0].message,  
      };
    }
    return await adminMutationController.adminLogin(value);
    
  } catch (error) {
  //  console.log("Error In Login", error);
    throw new Error("Login Error");
  }
},


//mutation for adding a Manufacturer
    addManufacturer:async(_,{input},context)=>{
      console.log(input)
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to add a manufacturer');
    }
      try{
         // console.log(input)
          const{value,error}=carSchema.validate(input)
          if(error){
           // console.log(error)
            return{
              id:null,
              statuscode:422,
              status:false,
              message:error.details[0].message
            }
          }
          return await adminMutationController.addManufacturer(value);
      }
      catch(error)
      {
        //console.log(error)
        throw new Error(error)

      }
    },
    addModel:async(_,{input},context)=>
    {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to add a manufacturer');
    }
      try
      {
      const{model,year}=input
      const validate={
        model:model,
        year:year
      }
      const{value,error}=modelSchema.validate(validate)
      if(error)
      {
        return{
          id:null,
          statuscode:422,
          status:false,
          message:error.details[0].message
        }
      }
      else
      {
        const data={
          id:input.id,
          model:value.model,
          year:value.year
        }
        return await adminMutationController.addModelController(data)
      }
      }
      catch(error)
      {
        throw new Error(error)
      }
    },
//Mutation for adding a new vehicle
    addVehicle: async (_, { primaryFile, secondaryFiles, input },context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to add a manufacturer');
    }
      try {
     //   console.log(primaryFile,secondaryFiles,input)
        const{value,error}=await vehicleSchema.validate(input)
        if(error)
        {
       //   console.log(error)
          return{
            statuscode:422,
            status:false,
            message:error.details[0].message
          }
        }
        else
        {
         // console.log(value)
        const vehicle = await adminMutationController.addVehicleController(primaryFile, secondaryFiles, value);
          return vehicle; 
        }
      } catch (error) {
      //  console.error("Error adding vehicle:", error);
        throw new Error("Failed to add vehicle");
      }
    },
  //Mutation for deleting a manufacturer
    deleteManufacturer:async(_,{id},context)=>
    {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to add a manufacturer');
      }
      try
      {
      const data=await adminMutationController.deleteManufacturer(id)
      return data
      }catch(error)
      {
      //  console.log(error)
      throw new Error("Error deleting Manufacturer")
      }
    },
  //Mutation for deleting  a car
  deleteVehicle:async(_,{id},context)=>{
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to add a manufacturer');
  }
    try{
      const deletedVehicle=await adminMutationController.deleteCar(id)
      return deletedVehicle
    }catch(error)
    {
      //console.error("Error deleting vehicle:", error);
      throw new Error("Error deleting vehicle")
    }
  },

  //Mutation for deleting a rented vehicle
  deleteRentVehicles:async(_,{id},context)=>
  {
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to add a manufacturer');
  }
    try{
      const deletedVehicle=await adminMutationController.deleteRentCar(id)
      return deletedVehicle
    }catch(error)
    {
      //console.error("Error deleting vehicle:", error);
      throw new Error("Error deleting vehicle")
    }
  },
  //Mutation for editing a vehicle information
  editVehicle:async(_,{file,input},context)=>
  {
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to add a manufacturer');
  }
    try{
        
      const Vehicle=await adminMutationController.editVehicleController(file,input)
      return Vehicle
    }catch(error)
    {
      //console.error("Error adding vehicle:", error);
      throw new Error("Error editing vehicle")
    }
  },

  //Mutation for adding vehicle to rent
  addRent:async(_,{input},context)=>
    {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to add a manufacturer');
    }
      try{
        const Vehicle=await adminMutationController.rentVehicle(input)
        return Vehicle
      }catch(error)
      {
      //  console.error("Error adding vehicle:", error);
      throw new Error("Error adding vehicle to rent")
      }
    },

//mutation for adding data from an excel sheet to database
uploadExcel: async (parent, { file },context) => {
  if (!context.user) {
    throw new AuthenticationError('You must be logged in to add a manufacturer');
}
  try
  {
      return await adminMutationController.addExcelData(file)
  }catch(error)
  {
   // console.log("error reading data")
    throw new Error("Error uplaoding Excel")
  }
},
//Mutation for dealing with the  return of vehicle
updateReturnVehicle:async(_,{input},context)=>
    {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to add a manufacturer');
    }
      try
      {
        return await adminMutationController.updateBookingController(input)
      }catch(error)
      {
       // console.log(error)
       throw new Error("Error updating return vehicle")
      }
    }
  }
  
};

export default adminMutationResolver;
