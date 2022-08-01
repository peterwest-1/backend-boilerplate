import { IsInt, Min, Max } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Field(() => Number, { description: "Rating out of five" })
  @Column()
  @IsInt()
  @Min(0)
  @Max(5)
  rating: number;

  @Field(() => ID, { description: "The contractor being reviewed ID" })
  @Column("uuid")
  revieweeID: number;

  @Field(() => ID, { description: "The person reviewing ID" })
  @Column("uuid")
  reviewerID: number;

  @Field(() => String, { description: "Review title" })
  @Column("text")
  title: string;

  @Field(() => String, { description: "Review text" })
  @Column("text")
  text: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
