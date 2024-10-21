import userTypeDefs from "../user/graphql/typedefs/user-typedef.js";
import adminTypeDefs from "../admin/graphql/typedef/admin-typedef.js";
//Resolver Which joins Typedefs of user and admin  for creating the apollo server
const typeDefs=[
    adminTypeDefs,
    userTypeDefs
];
export default typeDefs