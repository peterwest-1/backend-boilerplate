import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Column("text")
  password: string;

  @Field(() => Boolean, { description: "True if user has activated/confirmed their account" })
  @Column("bool", { default: false })
  confirmed: boolean;

  @Field(() => Boolean, { description: "Locked out due to Forgot Password" })
  @Column("bool", { default: false })
  forgotPasswordLocked: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
