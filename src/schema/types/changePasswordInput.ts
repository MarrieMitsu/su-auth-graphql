import { IsNotEmpty } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class ChangePasswordInput {

    @Field()
    @IsNotEmpty()
    oldPassword: string;

    @Field()
    @IsNotEmpty()
    newPassword: string;

}