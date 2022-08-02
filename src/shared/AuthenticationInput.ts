import { IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";
import { PasswordInput } from "./PasswordInput";

@InputType()
export class AuthenticationInput extends PasswordInput {
  @Field()
  @IsEmail()
  // @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;
}
