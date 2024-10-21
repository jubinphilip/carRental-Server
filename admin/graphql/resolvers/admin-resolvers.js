import adminQueryResolver from "./queries/admin-queries.js";
import adminMutationResolver from "./mutations/admin-mutations.js";
//creating the resolver using the Queries and mutations
const adminResolver = {
    Query: {
      ...adminQueryResolver.Query,
    },
    Mutation: {
      ...adminMutationResolver.Mutation,
    },
  };
  
  export default adminResolver;