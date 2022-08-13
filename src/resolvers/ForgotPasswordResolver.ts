import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../entity/User";
import { createChangePasswordLink } from "../utilities/createChangePasswordLink";
import { forgotPasswordLockAccount } from "../utilities/forgotPasswordLockAccount";
import { generateResetMailOptions } from "../utilities/generateMailOptions";
import { sendEmail } from "../utilities/sendMail";

@Resolver(User)
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      //Email Not Found
      //Forgot password should not say whether or not a email exists on the database
      //Security reasons, prevents
      // "If the email exists, we'll send it to that email"
      return true;
    }
    const changePassLink = await createChangePasswordLink("http://localhost:3000", user.id);

    const changePassMailOptions = generateResetMailOptions(email, changePassLink);
    await sendEmail(changePassMailOptions);
    return true;
  }
}
