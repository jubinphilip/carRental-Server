
import { mergeTypeDefs } from "@graphql-tools/merge";
import userMutationtypes from "./mutations/user-mutations-types.js";
import userTypes from "./types/user-types.js";
import userQueryTypes from "./queries/user-query-types.js";


const userTypeDefs=mergeTypeDefs([userTypes,userMutationtypes,userQueryTypes])

export default userTypeDefs