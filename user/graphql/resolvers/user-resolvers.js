import userQueryResolver from './queries/user-queries.js';
import userMutationResolver from './mutations/user-mutations.js';

const userResolver = {
  Query: {
    ...userQueryResolver.Query,
  },
  Mutation: {
    ...userMutationResolver.Mutation,
  },
};

export default userResolver;
