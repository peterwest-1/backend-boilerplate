import { AuthenticationInput } from "../shared/AuthenticationInput";
import { DUPLICATE_EMAIL, INVALID_EMAIL } from "../shared/EmailErrors";
import { PASSWORD_LENGTH } from "../shared/PasswordErrors";
import { User } from "../entity/User";

export const validateRegister = async (options: AuthenticationInput) => {
  await User.find({ where: { email: options.email } }).then((user) => {
    if (user) {
      return [DUPLICATE_EMAIL];
    }
    return true;
  });

  if (!options.email.includes("@")) {
    return [INVALID_EMAIL];
  }

  if (options.password.length <= 2) {
    return [PASSWORD_LENGTH];
  }

  return null;
};
