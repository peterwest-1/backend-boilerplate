import { User } from "../entity/User";
import { removeUserSessions } from "./removeUserSessions";

export const forgotPasswordLockAccount = async (userId: string) => {
  //Prevents people from logging in if locked
  await User.update({ id: userId }, { forgotPasswordLocked: true });

  //Remove all active logins
  await removeUserSessions(userId);
};
