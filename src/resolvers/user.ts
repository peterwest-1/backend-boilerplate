import argon2 from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { COOKIE_NAME } from "../constants";
import { User } from "../entity/User";
import { AuthenticationInput } from "../shared/AuthenticationInput";
import { DUPLICATE_EMAIL, EMAIL_DOESNT_EXIST } from "../shared/EmailErrors";
import { PASSWORD_DOESNT_MATCH } from "../shared/PasswordErrors";
import { UserResponse } from "../shared/UserResponse";
import { MyContext } from "../types";
import { validateRegister } from "../validators/register";

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOneBy({ id: req.session.userId });
  }

  @Query(() => Boolean)
  async contractor(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return false;
    }
    const user = await User.findOneBy({ id: req.session.userId });

    if (user) {
      return user.contractorId ? true : false;
    }

    return false;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input") { email, password }: AuthenticationInput,
    @Ctx() { req }: MyContext
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
    } catch (error) {
      if (error.code == "23505" || error.detail.includes("already exists")) return { errors: [DUPLICATE_EMAIL] };
    }
    // await sendEmail(input.email, await createConfirmationLink(context.url, user?.id as string));

    req.session.userId = user?.id;

    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("input") { email, password }: AuthenticationInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) return { errors: [EMAIL_DOESNT_EXIST] };

    const valid = await argon2.verify(user.password, password);

    if (!valid) return { errors: [PASSWORD_DOESNT_MATCH] };
    // if (!user.confirmed) return { errors: [ACCOUNT_NOT_VERIFIED] };

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve, reject) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          reject(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
