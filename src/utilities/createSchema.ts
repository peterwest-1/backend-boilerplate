import { UserResolver } from "../resolvers/user";
import { buildSchema } from "type-graphql";
import { ChangePasswordResolver } from "../resolvers/ChangePasswordResolver";
import { ForgotPasswordResolver } from "../resolvers/ForgotPasswordResolver";

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver, ChangePasswordResolver, ForgotPasswordResolver],
    validate: false,
  });
