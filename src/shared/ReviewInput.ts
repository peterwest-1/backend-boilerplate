import { MaxLength, Length, Min, Max } from "class-validator";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class ReviewInput {
  @Field(() => String, { nullable: true })
  @MaxLength(30)
  title: string;

  @Field(() => String, { nullable: true })
  @Length(30, 255)
  text: string;

  @Field(() => Int, { nullable: true })
  @Min(0)
  @Max(5)
  rating: number;
}
