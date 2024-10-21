import adminResolver from "../admin/graphql/resolvers/admin-resolvers.js";
import userResolver from "../user/graphql/resolvers/user-resolvers.js";
//Resolver Which joins Queries and Mutations of user and admin  for creating the apollo server
const resolvers={
    Query:{
        ...adminResolver.Query,
        ...userResolver.Query,
    },
    Mutation:{
        ...adminResolver.Mutation,
        ...userResolver.Mutation,
    }
}
export default resolvers