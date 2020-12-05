import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./fieldError";

@ObjectType()
export class DeleteUserResponse {

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field()
    delete: boolean;

}