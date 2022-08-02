import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Contractor extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column("uuid")
  userId: string;

  @OneToOne(() => User, (user) => user.contractor)
  user: User;

  @Field(() => String)
  @Column("varchar", { length: 255 })
  name: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true }) //update to more explicit
  contactNumber?: number;

  @Field(() => String)
  @Column("varchar", { length: 255, nullable: true })
  website?: string;

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  services: string[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
