import userQueryResolver from './queries/user-queries.js';
import userMutationResolver from './mutations/user-mutations.js';
//Craeting a resolver using users queries and mutations
const userResolver = {
  Query: {
    ...userQueryResolver.Query,
  },
  Mutation: {
    ...userMutationResolver.Mutation,
  },
};

export default userResolver;
