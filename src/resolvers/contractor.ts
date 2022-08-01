import { Contractor } from "../entity/Contractor";
import { Arg, Int, Query, Resolver } from "type-graphql";

@Resolver()
export class ContractorResolver {
  @Query(() => Contractor, { nullable: true })
  review(@Arg("id", () => Int) id: number): Promise<Contractor | null> {
    return Contractor.findOne({ where: { id } });
  }
}
