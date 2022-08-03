import { ReviewInput } from "../shared/ReviewInput";
import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Review } from "../entity/Review";

@Resolver(Review)
export class ReviewResolver {
  @Query(() => [Review])
  reviews(): Promise<Review[]> {
    return Review.find();
  }

  @Query(() => Review, { nullable: true })
  review(@Arg("id", () => String) id: string): Promise<Review | null> {
    return Review.findOneBy({ id });
  }

  @Mutation(() => Review)
  async createReview(@Arg("input") input: ReviewInput, @Ctx() _: MyContext): Promise<Review> {
    const review = Review.create({
      ...input,
      // creatorId: req.session.userId,
    });

    return await review.save();
  }

  @Mutation(() => Review, { nullable: true })
  async updateReview(
    @Arg("id", () => String) id: string,
    @Arg("input") input: ReviewInput,
    @Ctx() _: MyContext
  ): Promise<Review | null> {
    const review = await Review.findOneBy({ id });
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
  async deleteReview(@Arg("id", () => String) id: string, @Ctx() _: MyContext): Promise<boolean> {
    try {
      await Review.delete({ id });
    } catch (error) {
      return false;
    }

    return true;
  }
}
