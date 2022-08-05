import Redis from "ioredis";
const redis = new Redis(String(process.env.REDIS_URL));

redis.on("connect", () => console.log("CONTRACTOR Server: Connected to Redis!"));
redis.on("error", (err: Error) => console.log("Redis Client Error", err));

export default redis;
