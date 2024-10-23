import { createToken } from "../../utils/createtoken.js";
import AdminMutationService from "../Repo/mutation-helpers.js";
import { uploadFile } from "../../utils/upload-file.js";
import { parseExcel } from "../../utils/parse-excel.js";
import { createCollection } from "../../utils/create-typesense.js";
import { deleteCarByCarId, deleteCarFromTypesense } from "../../utils/manage-typesense.js";
class AdminMutationController {
    constructor() {
     this.adminMutations=new AdminMutationService()
    }

    //Controller for adding a new Admin
    async addAdmin(input) {  
        try {
          const newAdmin = await this.adminMutations.addAdmin(input);
          return newAdmin;
        } catch (error) {
          console.log("Error in AdminController:", error);
          throw new Error("Error in AdminController");
        }
      }
  //Function for Admin Login
      async adminLogin(value){
          try{
              const admin = await this.adminMutations.adminLogin(value);
              console.log(admin)
              let logindata;
              if(admin.status!=false)
              {
                 logindata=await createToken(admin)//creating token for admin after login
                 return {
                  statuscode:200,
                  token: logindata,
                  status: true,
                  message: "Login successful",
                };
              }
              if(admin.status===false)
                {
                  return {
                    statuscode:401,
                    token: null,
                    status: false,
                    message: admin.error,
                  };
                }
            
          
          }catch(error)
          {
              console.log("Error in AdminController:", error);
              return{
                statuscode:500,
                    token: null,
                    status: false,
                    message: "Internal Server Error",
              }
          }
      }
      //
      async addManufacturer(input){
        try{
          const newManufacturer = await this.adminMutations.addManufacturer(input);
          console.log(newManufacturer)
          if(newManufacturer)
          {
            return{
              statuscode:200,
              id : newManufacturer.id,
              status:true,
              message:"Manufactured Added"
            }
          }
        }
        catch(error)
        {
          console.log("error in manufacturer conroller",error)
          return{
            statuscode:500, 
            status:false,
            id:null,
            message:"Internal Server Error"

          }
        }
      }
      //Function for adding exce data to manufacturers model
      
      async addExcelData(file) {
        try {
          console.log("File Structure", file);
          const stream = file.file.createReadStream();
          const chunks = [];
      
          // Read the file in chunks
          stream.on('data', (chunk) => chunks.push(chunk));
      
          return new Promise((resolve, reject) => {
            stream.on('end', async () => {
              const buffer = Buffer.concat(chunks);
              try {
                const records = await parseExcel(buffer); // Retrieve records from the Excel file
                const data = await this.adminMutations.addExcelData(records); // Pass the records to the database
      
                if (data.status === true) {
                  resolve({
                    status: true,
                    message: "Excel data Uploaded",
                    statusCode: 200, // Success
                  });
                } else {
                  reject({
                    status: false,
                    message: "Excel data Upload Failed",
                    statusCode: 400, // Bad Request or similar
                  });
                }
              } catch (error) {
                console.error("Error while parsing and inserting records:", error);
                reject({
                  status: 'Error',
                  message: 'Failed to process Excel file: ' + error.message,
                  statusCode: 500, // Internal Server Error
                });
              }
            });
      
            stream.on('error', (error) => {
              console.error("Stream error:", error);
              reject({
                status: 'Error',
                message: 'Stream error: ' + error.message,
                statusCode: 500, // Stream error is considered a server error
              });
            });
          });
        } catch (error) {
          console.error("Error in addExcelData:", error);
          throw {
            message: "Failed to add Excel data: " + error.message,
            statusCode: 500, // Internal Server Error
          };
        }
      }
      
      
      async addVehicleController(primaryFile, secondaryFiles, input) {
        try {
            // Upload the primary image
            const primaryFileUrl = await uploadFile(primaryFile);
            console.log("Primary Image URL:", primaryFileUrl);//minio returns image urls as response this urls are passed to database for storing
    
            // Upload secondary images
            const secondaryFileUrls = await Promise.all(
                secondaryFiles.map(file => uploadFile(file))//Function for adding files to minio
            );
            console.log("Secondary Images URLs:", secondaryFileUrls);
    
            // Call the function to add vehicle to the database
            const newVehicle = await this.adminMutations.addVehicle({
                ...input,
                primaryImageUrl: primaryFileUrl,
                secondaryImageUrls: secondaryFileUrls,
            });
    
            if (newVehicle) {
                console.log("Data inserted:", newVehicle);
                return {
                  statuscode:200,
                    status:true,
                    message:"New Vehicle Added"
                };
            }
            else
            {
              return{
                statuscode:400,
                status:false,
                message:"Vehicle Addition Failed"
              }
            }
        } catch (error) {
            console.log("Error occurred at controller:", error);
            return{
              statuscode:400,
                status:false,
                message:"Internal Server Error"
            }
    

        }
    }
    
      
    async deleteCar(id)
    {
      try{
        const deleteVehicle=await this.adminMutations.deleteVehicle(id)
       deleteCarByCarId(id)//passsing the carid to typesnse function for deleting it from typesense here carid is passsed
       if(deleteVehicle) 
      {
       return{
          statuscode:200,
          message:"Vehicle Deleted Successfully",
          status:true
        }
      }
      else
      {
        return{
          statuscode:204,
          message:"Vehicle Not Found ",
          status:false
        }
      }
    
      }catch(error)
      {
        console.log("Error generated",error)
        return{
          statuscode:500,
          message:"Internal Server Error",
          status:false
        }
      }
    }

    async deleteRentCar(id)
    {
      try
      {
        const deleteVehicle=await this.adminMutations.deleteRentVehicle(id)
       deleteCarFromTypesense(id)//passsing the carid to typesnse function for deleting it from typesense here rentedcarid is passsed
        if(deleteVehicle.status!=false)
        {
          return {
            statuscode:200,
            status:true,
            message:"Car Removed From Rented Vehicles List"
          }
        }
        else{
          return {
            statuscode:204,
            status:false,
            message:"Action Failed "
          }
        }
      }catch(error)
      {
        console.log("Error generated",error)
        return{
          statuscode:500,
          message:"Internal Server Error",
          status:false
        }
      }
    }
    async deleteManufacturer(id)
    {
      try
      {
        const data= await this.adminMutations.deleteManufacturer(id)
        if(data)
        {
          return{
            statuscode:200,
            status:true,
            message:"Manufacturer Removed Successfully"
          }
        }
        else
        {
          return{
            statuscode:200,
            status:false,
            message:"Manufacturer Not Removed"
          }
        } 
      }catch(error)
      {
        return{
          statuscode:500,
          status:false,
          message:"Internal Server Error"
        }
      }
    }
    async editVehicleController(file,input)
    {
      try
      {
        let fileUrl=''
        if(file)
        {
         fileUrl=await uploadFile(file)//adding new file to minio
        }
        const newVehicle=await this.adminMutations.editVehicle(fileUrl,input)
        if(newVehicle)
        {
          console.log("Data inserted")
          return{
            status:true,
            message:"Vehicle Details Edited"
          }
        }
        else
        {
          return{
            status:false,
            message:"Edit Failed"
          }
        }

      }catch(error)
      {
        console.log("Error Occured at controller",error)
      }
    }
    async rentVehicle(input)
    {
      try
      {
       // console.log("createcolllection")
        await createCollection()
        const rentedVehicle=await this.adminMutations.addRentVehicle(input)
        if(rentedVehicle)
       {
        return{
        statuscode:200, 
         status:true,
         message:"Car Added"
        }
       }
       else
       {
        return{
          statuscode:400,
          status:false,
          message:"Car Not Added"
        }
       }
      }catch(error)
      {
        console.log("Error in controller",error)
        return{
          statuscode:500,
          status:false,
          message:"Action Failed"
        }
      }
    }
    //Controller for controlling booking update whether the car is returned or  not
    async updateBookingController(input)
    {
      try
      {
        const updateBooking=await this.adminMutations.updateBooking(input)
        if(updateBooking.status!=false)
        {
          return{
            status:true,
            statuscode:200,
            message:"Status Updated Successfully"
          }
        }
        else
        {
          return{
            status:false,
            statuscode:400,
            message:"Status Not Updated"
          }
        }
      }catch(error)
      {
        return{
          status:false,
          statuscode:500,
          message:"Internal Server Error"
        }
      }
    }
}
export default AdminMutationController