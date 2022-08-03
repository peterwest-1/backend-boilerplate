import { ContractorResolver } from "../resolvers/contractor";
import { ReviewResolver } from "../resolvers/review";
import { UserResolver } from "../resolvers/user";
import { buildSchema } from "type-graphql";

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver, ContractorResolver, ReviewResolver],
    validate: false,
  });
