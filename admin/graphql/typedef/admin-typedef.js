
import { mergeTypeDefs } from "@graphql-tools/merge";
import adminMutationtypes from "./mutations/admin-mutation-types.js";
import adminTypes from "./types/admin-types.js";
import adminQuerytypes from "./queries/admin-query-type.js";
//creating typedef using all admin muation and query types
const admintypeDefs=mergeTypeDefs([adminTypes,adminQuerytypes,adminMutationtypes])

export default admintypeDefs