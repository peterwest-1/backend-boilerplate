import argon2 from "argon2";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { changePasswordPrefix } from "../constants";
import { User } from "../entity/User";
import { ChangePasswordInput } from "../shared/ChangePasswordInput";
import { ACCOUNT_ERROR } from "../shared/Errors/account";
import { PASSWORD_ERROR } from "../shared/Errors/password";
import { TOKEN_ERROR } from "../shared/Errors/token";
import { UserResponse } from "../shared/UserResponse";
import { MyContext } from "../types";

@Resolver(User)
export class ChangePasswordResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (password.length <= 2) {
      return {
        errors: [PASSWORD_ERROR.LENGTH],
      };
    }
    const key = changePasswordPrefix + token;
    const userId = await redis.get(key);

    if (!userId) {
      //Potentially handle token manipulation, probs not worth though
      return {
        errors: [ACCOUNT_ERROR.TOKEN_ISSUE],
      };
    }

    const user = await User.findOneBy({ id: userId });

    if (!user) {
      return {
        errors: [TOKEN_ERROR.INVALID_EXPIRED],
      };
    }

    if (user.forgotPasswordLocked) {
      await User.update({ id: userId }, { forgotPasswordLocked: false });
    }

    await User.update({ id: userId }, { password: await argon2.hash(password) });
    await redis.del(key);

    req.session.userId = user.id;

    return { user };
  }
}
