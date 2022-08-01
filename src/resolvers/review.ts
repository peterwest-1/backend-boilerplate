import { Min, Max, MaxLength, Length } from "class-validator";

import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Review } from "../entity/Review";

@InputType()
class ReviewInput {
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

@Resolver()
export class ReviewResolver {
  @Query(() => [Review])
  reviews(): Promise<Review[]> {
    return Review.find();
  }

  @Query(() => Review, { nullable: true })
  review(@Arg("id", () => Int) id: number): Promise<Review | null> {
    return Review.findOne({ where: { id } });
  }

  @Mutation(() => Review)
  async createReview(@Arg("input") input: ReviewInput, @Ctx() { req }: MyContext): Promise<Review> {
    const review = Review.create({
      ...input,
      // creatorId: req.session.userId,
    });

    return await review.save();
  }

  @Mutation(() => Review, { nullable: true })
  async updateReview(
    @Arg("id", () => Int) id: number,
    @Arg("input") input: ReviewInput,
    @Ctx() { req }: MyContext
  ): Promise<Review | null> {
    const review = await Review.findOne({ where: { id } });
    if (!review) {
      return null;
    }

    const title = input.title;
    const text = input.text;
    const rating = input.rating;

    if (typeof title !== "undefined") review.title = title;
    if (typeof text !== "undefined") review.text = text;
    if (typeof rating !== "undefined") review.rating = rating;

    return await review.save();
  }

  @Mutation(() => Boolean)
  async deleteReview(@Arg("id", () => Int) id: number, @Ctx() { req }: MyContext): Promise<boolean> {
    try {
      await Review.delete({ id });
    } catch (error) {
      return false;
    }

    return true;
  }
}
