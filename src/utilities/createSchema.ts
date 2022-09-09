import { UserResolver } from "../resolvers/user/user";
import { buildSchema } from "type-graphql";
import { ChangePasswordResolver } from "../resolvers/user/ChangePasswordResolver";
import { ForgotPasswordResolver } from "../resolvers/user/ForgotPasswordResolver";

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver, ChangePasswordResolver, ForgotPasswordResolver],
    validate: false,
  });
