import "reflect-metadata";
import { DataSource } from "typeorm";
import { __prod__ } from "./constants";
import { Contractor } from "./entity/Contractor";
import { Review } from "./entity/Review";
import { User } from "./entity/User";
require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: process.env.DB_PASSWORD,
  database: "contractor",
  synchronize: !__prod__,
  logging: !__prod__,
  entities: [User, Contractor, Review],
  migrations: [],
  subscribers: [],
});
