import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: number;

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

  @Field(() => ID, { nullable: true, description: "Whether user is a contractor" })
  @Column("uuid", { nullable: true })
  contractorId?: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
