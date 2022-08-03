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
import { confirmEmail } from "./routes/confirmEmail";
import { MyContext } from "./types";
import { createSchema } from "./utilities/createSchema";
require("dotenv").config();

const RedisStore = require("connect-redis")(session);

const main = async () => {
  const connection = await AppDataSource.initialize();

  await connection.runMigrations();

  const app = express();
  const redis = new Redis(process.env.REDIS_URL);
  redis.on("connect", () => console.log("CONTRACTOR Server: Connected to Redis!"));
  redis.on("error", (err: Error) => console.log("Redis Client Error", err));

  app.set("trust proxy", 1);

  const usingApollo = true;

  const apolloCors = { origin: true, credentials: true };
  app.use(cors(usingApollo ? apolloCors : { origin: "http://localhost:3000", credentials: true }));

  // const defaultCookie = {
  //   maxAge: COOKIE_LENGTH, // 1 year
  //   httpOnly: true,
  //   sameSite: "lax",
  //   secure: __prod__, // cookie only works in https
  // };
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
        maxAge: COOKIE_LENGTH, // 1 year
        httpOnly: true,
        sameSite: usingApollo ? "none" : "lax",
        secure: usingApollo ? true : __prod__, // cookie only works in https
      },
    })
  );

  app.get("/confirm/:id", confirmEmail);

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      url: req.protocol + "://" + req.get("host"),
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: ["https://studio.apollographql.com"],
      credentials: true,
    },
  });

  app.listen(process.env.PORT, () => {
    console.log(`CONTRACTOR Server: Started on localhost:${process.env.PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
