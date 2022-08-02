import { v4 } from "uuid";
import { changePasswordPrefix, TOKEN_EXPIRY } from "../constants";
import { redis } from "../redis";

export const createChangePasswordLink = async (url: string, userId: string) => {
  const token = v4();
  await redis.set(`${changePasswordPrefix}${token}`, userId, "EX", TOKEN_EXPIRY);
  return `${url}/forgot-password/${token}`;
};
