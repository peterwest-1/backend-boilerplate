import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Contractor } from "../entity/Contractor";
import { User } from "../entity/User";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { RegisterContractorInput } from "../shared/RegisterContractorInput";
import { MyContext } from "../types";

@Resolver(Contractor)
export class ContractorResolver {
  @Query(() => Contractor, { nullable: true })
  review(@Arg("id", () => String) id: string): Promise<Contractor | null> {
    return Contractor.findOneBy({ id });
  }

  @Mutation(() => Contractor)
  @UseMiddleware(isAuthenticated)
  async registerContractor(
    @Arg("input") input: RegisterContractorInput,
    @Ctx() { req }: MyContext
  ): Promise<Contractor> {
    const contractor = await Contractor.create({
      ...input,
      userId: req.session.userId,
    }).save();

    const id = req.session.userId;
    const user = await User.findOneBy({ id });

    if (user) {
      user.contractorId = contractor.id;
      await user?.save();
    }

    return contractor;
  }
}
