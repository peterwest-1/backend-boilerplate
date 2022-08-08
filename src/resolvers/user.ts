import argon2 from "argon2";
import redis from "../redis";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { changePasswordPrefix, COOKIE_NAME, redisSessionPrefix, userSessionIDPrefix } from "../constants";
import { User } from "../entity/User";
import { AuthenticationInput } from "../shared/AuthenticationInput";
import { ChangePasswordInput } from "../shared/ChangePasswordInput";
import { ACCOUNT_ERROR } from "../shared/Errors/account";
import { EMAIL_ERROR } from "../shared/Errors/email";
import { PASSWORD_ERROR } from "../shared/Errors/password";
import { TOKEN_ERROR } from "../shared/Errors/token";
import { UserResponse } from "../shared/UserResponse";
import { MyContext } from "../types";
import { createChangePasswordLink } from "../utilities/createChangePasswordLink";
import { createConfirmationLink } from "../utilities/createConfirmationLink";
import { sendEmail } from "../utilities/sendMail";
import { validateRegister } from "../validators/register";
import { removeUserSessions } from "../utilities/removeUserSessions";
import { forgotPasswordLockAccount } from "../utilities/forgotPasswordLockAccount";

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOneBy({ id: req.session.userId });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input") { email, password }: AuthenticationInput,
    @Ctx() { req, url }: MyContext
  ): Promise<UserResponse> {
    const errors = await validateRegister({ email, password });
    if (errors) return { errors };

    const hash = await argon2.hash(password);
    let user;
    try {
      user = await User.create({
        email: email,
        password: hash,
      }).save();
      const confirmUserLink = await createConfirmationLink(url, user.id);
      await sendEmail(email, `<a href="${confirmUserLink}">Confirm Account</a>`);
    } catch (error) {
      if (error.code == "23505" || error.detail.includes("already exists")) return { errors: [EMAIL_ERROR.DUPLICATE] };
    }

    req.session.userId = user?.id;
    if (user) {
      redis.lpush(user.id, req.sessionID);
    }

    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("input") { email, password }: AuthenticationInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) return { errors: [EMAIL_ERROR.DOESNT_EXIST] };

    if (user.forgotPasswordLocked) {
      return { errors: [ACCOUNT_ERROR.FORGOT_PASSWORD_LOCKED] };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) return { errors: [PASSWORD_ERROR.DOESNT_MATCH] };
    // if (!user.confirmed) return { errors: [ACCOUNT_NOT_VERIFIED] };

    req.session.userId = user.id;
    redis.lpush(`${userSessionIDPrefix}${user.id}`, req.sessionID);

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve, reject) =>
      req.session.destroy((err: Error) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          reject(false);
          return;
        }
        resolve(true);
      })
    );
  }

  //Needs to be tested
  @Mutation(() => Boolean)
  async logoutAll(@Ctx() { req }: MyContext) {
    const { userId } = req.session;
    if (userId) {
      await removeUserSessions(userId);
      return true;
    }

    return false;
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      //Email Not Found
      //Forgot password should not say whether or not a email exists on the database
      //Security reasons, prevents
      // "If the email exists, we'll send it to that emai"
      return true;
    }

    await forgotPasswordLockAccount(user.id);
    const changePassLink = await createChangePasswordLink("http://localhost:3000", user.id);
    await sendEmail(email, `<a href="${changePassLink}">Change Password</a>`);
    return true;
  }

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

    await User.update({ id: userId }, { password: await argon2.hash(password) });
    await redis.del(key);

    req.session.userId = user.id;

    return { user };
  }
}
