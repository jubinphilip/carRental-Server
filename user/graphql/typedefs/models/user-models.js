import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../../config/db.js";
import { RentVehicle, Vehicles } from "../../../../admin/graphql/typedef/models/admin-models.js";

//Model for storing user information
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, 
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    city: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileurl:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    timestamps: true, 
});

//Model for storing Booking
const Booking = sequelize.define('Bookings', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    carid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: RentVehicle,
        key: 'id',
      },
    },
    startdate: {
      type: DataTypes.STRING,
    },
    enddate: {
      type: DataTypes.STRING,
    },
    startlocation: {
      type: DataTypes.STRING
    },
    droplocation: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.FLOAT
    },
    payment_status: {
      type: DataTypes.STRING
    },
    razorpay_signature: {
      type: DataTypes.STRING, 
    },
    status:{
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  });

//Model for storing review
  const Review=sequelize.define('Reviews',{
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    userid:{
      type: DataTypes.INTEGER,
      references:{
        model:User,
        key:'id'
        }
        },
    carid:{
      type:DataTypes.INTEGER,
      references:{
        model:RentVehicle,
        key:'id'
      }
    },
    rating:{
      type:DataTypes.INTEGER,
      },
      review:{
        type:DataTypes.STRING
      }
      
  })
  
  //Setting Relations
User.hasMany(Booking, { foreignKey: 'userid' });
Booking.belongsTo(User, { foreignKey: 'userid' });

RentVehicle.hasMany(Booking, { foreignKey: 'carid' });
Booking.belongsTo(RentVehicle, { foreignKey: 'carid' });

User.hasMany(Review, {
  foreignKey: 'userid', 
  onDelete: 'CASCADE', 
});

RentVehicle.hasMany(Review, {
  foreignKey: 'carid', 
  onDelete: 'CASCADE', 
});

Review.belongsTo(User, {
  foreignKey: 'userid', 
});

Review.belongsTo(RentVehicle, {
  foreignKey: 'carid', 
});


export {User,Booking,Review}
