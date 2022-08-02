import { confirmAccountPrefix, TOKEN_EXPIRY } from "../constants";
import { v4 } from "uuid";
import { redis } from "../redis";

export const createConfirmationLink = async (url: string, userId: string) => {
  const token = v4();
  await redis.set(`${confirmAccountPrefix}${token}`, userId, "EX", TOKEN_EXPIRY);
  return `${url}/confirm/${token}`;
};
