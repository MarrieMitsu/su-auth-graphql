import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteUserInput {

    @Field()
    @IsNotEmpty()
    unique: string;

    @Field()
    @IsNotEmpty()
    verify: string;

    @Field()
    @IsNotEmpty()
    password: string;

}