import adminQueryResolver from "./queries/admin-queries.js";
import adminMutationResolver from "./mutations/admin-mutations.js";
const adminResolver = {
    Query: {
      ...adminQueryResolver.Query,
    },
    Mutation: {
      ...adminMutationResolver.Mutation,
    },
  };
  
  export default adminResolver;