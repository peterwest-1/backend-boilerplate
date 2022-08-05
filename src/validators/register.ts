import { User } from "../entity/User";
import { AuthenticationInput } from "../shared/AuthenticationInput";
import { EMAIL_ERROR } from "../shared/Errors/email";
import { PASSWORD_ERROR } from "../shared/Errors/password";

export const validateRegister = async (options: AuthenticationInput) => {
  await User.find({ where: { email: options.email } }).then((user) => {
    if (user) {
      return [EMAIL_ERROR.DUPLICATE];
    }
    return true;
  });

  if (!options.email.includes("@")) {
    return [EMAIL_ERROR.INVALID];
  }

  if (options.password.length <= 2) {
    return [PASSWORD_ERROR.LENGTH];
  }

  return null;
};
