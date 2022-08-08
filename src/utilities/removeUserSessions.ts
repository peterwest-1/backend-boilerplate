import { userSessionIDPrefix, redisSessionPrefix } from "../constants";
import redis from "../redis";

export const removeUserSessions = async (userId: string) => {
  const sessionIDs = await redis.lrange(`${userSessionIDPrefix}${userId}`, 0, -1);

  const promises = [];
  for (let i = 0; i < sessionIDs.length; i++) {
    promises.push(redis.del(`${redisSessionPrefix}${sessionIDs[i]}`));
  }
  await Promise.all(promises);
};
