import { DataSource } from "typeorm";
import { __prod__ } from "./constants";
import { User } from "./entity/User";

export const TestDataSource = new DataSource({
  type: "postgres",
  url: process.env.TESTING_DATABASE_URL,
  synchronize: !__prod__,
  logging: !__prod__,
  entities: [User],
  migrations: [],
  subscribers: [],
});
