// Packages
import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// User Entity
@ObjectType()
@Entity("users")
export class User extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column("text")
    name!: string;

    @Field()
    @Column()
    username!: string;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Column("text")
    password!: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    profileImage: string;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}