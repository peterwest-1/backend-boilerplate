import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Contractor extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Field(() => String, { nullable: true })
  @Column("varchar", { length: 255, nullable: true })
  name: string;

  @Field(() => [String], { nullable: true })
  @Column("simple-array")
  services: string[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
