import Redis from "ioredis";
import { APP_NAME } from "./constants";
const redis = new Redis(String(process.env.REDIS_URL));

redis.on("connect", () => console.log(`${APP_NAME} Server: Connected to Redis!`));
redis.on("error", (err: Error) => console.log("Redis Client Error", err));

export default redis;
