import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
    @Field()
    @IsNotEmpty()
    unique: string;

    @Field()
    @IsNotEmpty()
    password: string;
}