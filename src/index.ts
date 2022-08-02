import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_LENGTH, COOKIE_NAME, __prod__ } from "./constants";
import { AppDataSource } from "./data-source";
import { ContractorResolver } from "./resolvers/contractor";
import { ReviewResolver } from "./resolvers/review";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
require("dotenv").config();

const RedisStore = require("connect-redis")(session);

const main = async () => {
  const connection = await AppDataSource.initialize();

  // await connection.runMigrations();

  const app = express();
  const redis = new Redis(process.env.REDIS_URL);
  redis.on("connect", () => console.log("Connected to Redis!"));
  redis.on("error", (err: Error) => console.log("Redis Client Error", err));

  app.set("proxy", !__prod__);

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // cookie only works in https
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ContractorResolver, UserResolver, ReviewResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server started on localhost:${process.env.PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
