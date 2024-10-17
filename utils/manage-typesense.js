import typesenseClient from "../config/typesense-config.js";

export const addVehicleToCollection = async (vehicleData) => {
    try {
        const response = await typesenseClient.collections('cars').documents().create(vehicleData);
        console.log('Vehicle added to collection', response);
    } catch (error) {
        console.error("Error adding vehicle:", error);
    }
};


export const deleteCarFromTypesense=async(carid)=>
{
    try {
        const result = await typesenseClient
            .collections('cars') 
            .documents(carid)
            .delete();
        console.log(`Deleted car from Typesense: ${carid}`, result);
    } catch (error) {
        console.error(`Error deleting car from Typesense: ${carid}`, error);
    }
}



export const deleteCarByCarId = async (carid) => {
    try {
        const searchResults = await typesenseClient.collections('cars').documents().search({
            q: carid.toString(), 
            query_by: 'carid', 
            per_page: 1 
        });
        if (searchResults.hits.length > 0) {
            const carDocument = searchResults.hits[0].document;
            const documentId = carDocument.id; 
            const result = await typesenseClient
                .collections('cars')
                .documents(documentId)
                .delete();

            console.log(`Deleted car with carid ${carid} from Typesense:`, result);
        } else {
            console.warn(`No car found with carid ${carid}`);
        }
    } catch (error) {
        console.error(`Error deleting car with carid ${carid}:`, error);
    }
};

