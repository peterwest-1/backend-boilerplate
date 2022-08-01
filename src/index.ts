import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ContractorResolver } from "./resolvers/contractor";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import { ReviewResolver } from "./resolvers/review";
require("dotenv").config();

const main = async () => {
  const connection = await AppDataSource.initialize();

  await connection.runMigrations();

  const app = express();

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ContractorResolver, UserResolver, ReviewResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
    }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app });
};

main();
