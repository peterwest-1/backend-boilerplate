import { Request, Response } from "express";
import { confirmAccountPrefix } from "../constants";
import { User } from "../entity/User";
import { redis } from "../redis";

export const confirmEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = await redis.get(`${confirmAccountPrefix}${id}`);
  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    await redis.del(`${confirmAccountPrefix}${id}`);
    res.send("Thank you for confirming your account");
  } else {
    res.send("Error confirming your account");
  }
};
