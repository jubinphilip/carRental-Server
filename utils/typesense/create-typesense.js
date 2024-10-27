import typesenseClient from "../../config/typesense-config.js";

export const createCollection = async () => {
    //Schema for creating a collection in typesense
    const collectionSchema = {
        name: 'cars',
        fields: [
            { name: 'id', type: 'int32', indexed: true },
            { name: 'carid', type: 'string', indexed: true },
            { name: 'manufacturer', type: 'string', indexed: true },
            { name: 'model', type: 'string', indexed: true },
            { name:'image',type:'string',indexed:true},
            { name: 'year', type: 'string', indexed: true },
            { name: 'type', type: 'string', indexed: true },
            { name: 'price', type: 'string', indexed: true },
        ]
    };

    try {
        console.log('Creating collection...');
        //Function for creating Collection
        const response = await typesenseClient.collections().create(collectionSchema);
        console.log('Collection Created:', response);
    } catch (error) {
        console.error("Error creating collection:", error);
    }
};
