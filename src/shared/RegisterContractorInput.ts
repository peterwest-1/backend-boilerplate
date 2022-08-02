import { Field, InputType, Int } from "type-graphql";

@InputType()
export class RegisterContractorInput {
  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  contactNumber?: number;

  @Field({ nullable: true })
  website?: string;
}
