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
                  token: logindata,
                  status: true,
                  message: "Login successful",
                  data: {
                    id: admin.admin.dataValues.id,
                    username: admin.admin.dataValues.username
                  }
                };
              }
              if(admin.status===false)
                {
                  return {
                    token: null,
                    status: false,
                    message: admin.error,
                    data:null
                  };
                }
            
          
          }catch(error)
          {
              console.log("Error in AdminController:", error);
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
              id : newManufacturer.id,
              status:true,
              message:"Manufactured Added"
            }
          }
        }
        catch(error)
        {
          console.log("error in manufacturer conroller",error)
        }
      }
      //Function for adding exce data to manufacturers model
      async addExcelData(file) {
        try {
          console.log("File Structure",file)
          const stream = file.file.createReadStream()
          const chunks = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          return new Promise((resolve, reject) => {
            stream.on('end', async () => {
              const buffer = Buffer.concat(chunks);
              try {
              
                const records = await parseExcel(buffer);//Passed the excel file to   a function for retrieving records
      

                await this.adminMutations.addExcelData(records);//passing the record to database 
      
                resolve({
                  status: 'Success',
                  message: 'Excel file processed successfully.',
                });
              } catch (error) {
                console.error("Error while parsing and inserting records:", error);
                reject({
                  status: 'Error',
                  message: 'Failed to process Excel file: ' + error.message,
                });
              }
            });
      
            stream.on('error', (error) => {
              console.error("Stream error:", error);
              reject({
                status: 'Error',
                message: 'Stream error: ' + error.message,
              });
            });
          });
        } catch (error) {
          console.error("Error in addExcelData:", error);
          throw new Error("Failed to add Excel data: " + error.message); // Rethrow the error for higher-level handling
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
                    id: newVehicle.id,
                    status: "Success",
                };
            }
        } catch (error) {
            console.log("Error occurred at controller:", error);
            throw new Error("Failed to add vehicle");
        }
    }
    
      
    async deleteCar(id)
    {
      try{
        const deleteVehicle=await this.adminMutations.deleteVehicle(id)
       deleteCarByCarId(id)//passsing the carid to typesnse function for deleting it from typesense here carid is passsed
        return{
          id:deleteVehicle,
          status:"Success"
        }
    
      }catch(error)
      {
        console.log("Error generated",error)
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
            status:true,
            message:"Car Removed From Rented Vehicles List"
          }
        }
      }catch(error)
      {
        console.log("Error generated",error)
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
            id:newVehicle.id,
            status:"Success"
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
        console.log("createcolllection")
        await createCollection()
        const rentedVehicle=await this.adminMutations.addRentVehicle(input)
        if(rentedVehicle)
       {
        return{
          id : rentedVehicle.id,
          status:"Success"
        }
       }
      }catch(error)
      {
        console.log("Error in controller",error)
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
            message:"Status Updated Successfully"
          }
        }
        else
        {
          return{
            status:false,
            message:"Status Not Updated"
          }
        }
      }catch(error)
      {
        console.log(error)
      }
    }
}
export default AdminMutationController