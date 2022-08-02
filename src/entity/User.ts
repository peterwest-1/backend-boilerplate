import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Contractor } from "./Contractor";
import { Review } from "./Review";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { length: 255, unique: true, nullable: true })
  username?: string;

  @Column("text")
  password: string;

  @Field(() => Boolean, { description: "True if user has activated/confirmed their account" })
  @Column("bool", { default: false })
  confirmed: boolean;

  @Field({ nullable: true })
  @Column("uuid", { nullable: true })
  contractorId: string;

  @OneToOne(() => Contractor, (contractor) => contractor.user)
  @JoinColumn()
  contractor: Contractor;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
