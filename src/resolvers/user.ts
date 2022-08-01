import argon2 from "argon2";
import { IsEmail, MinLength } from "class-validator";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { User } from "../entity/User";
import { DUPLICATE_EMAIL } from "../shared/Errors";
import { MyContext } from "../types";
import { validateRegister } from "../validators/register";

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@InputType()
export class PasswordInput {
  @Field()
  @MinLength(8)
  password: string;
}

@InputType()
export class AuthenticationInput extends PasswordInput {
  @Field()
  @IsEmail()
  // @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(@Arg("input") input: AuthenticationInput, @Ctx() context: MyContext): Promise<UserResponse> {
    const errors = await validateRegister(input);
    if (errors) {
      return { errors };
    }

    const hash = await argon2.hash(input.password);
    let user;
    try {
      user = await User.create({
        email: input.email,
        password: hash,
      }).save();
    } catch (error) {
      if (error.code == "23505" || error.detail.includes("already exists")) {
        return {
          errors: DUPLICATE_EMAIL,
        };
      }
    }
    // await sendEmail(input.email, await createConfirmationLink(context.url, user?.id as string));

    return { user };
  }
}
