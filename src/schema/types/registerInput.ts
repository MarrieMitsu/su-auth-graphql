import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterInput {

    @Field()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @Field()
    @IsNotEmpty()
    @MaxLength(20)
    username: string;

    @Field()
    @IsNotEmpty()
    @MaxLength(50)
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    password: string;

}