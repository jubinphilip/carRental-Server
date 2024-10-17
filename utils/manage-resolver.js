import adminResolver from "../admin/graphql/resolvers/admin-resolvers.js";
import userResolver from "../user/graphql/resolvers/user-resolvers.js";
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