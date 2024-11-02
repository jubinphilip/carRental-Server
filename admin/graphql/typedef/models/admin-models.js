import { DataTypes } from "sequelize";
import sequelize from "../../../../config/db.js";

// Admin Model
const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
}, {
    timestamps: true,
});

// Manufacturer Model
const Manufacturer = sequelize.define('Manufacturer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true,
    }
});

// Vehicles Model
const Vehicles = sequelize.define('Vehicles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  manufacturer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Manufacturer, 
      key: 'id', 
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transmission: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fuel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seats: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileurl: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  secondaryImageUrls: {
    type: DataTypes.JSON, 
    allowNull: true,
  },
});


//Rented Vehicled Model
const RentVehicle=sequelize.define('RentedVehicles',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  carid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vehicles, 
      key: 'id', 
    },
  },
  quantity:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  price:{
  type:DataTypes.STRING,
  allowNull:false
  }
})


Manufacturer.hasMany(Vehicles, {
  foreignKey: 'manufacturer_id',
  onDelete: 'CASCADE', 
});


Vehicles.belongsTo(Manufacturer, {
  foreignKey: 'manufacturer_id',
  onDelete: 'CASCADE', 
});

RentVehicle.belongsTo(Vehicles,{
foreignKey:'carid',
onDelete:'CASCADE'
})  

export { Admin, Manufacturer, Vehicles,RentVehicle };
