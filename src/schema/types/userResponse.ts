import { ObjectType, Field } from "type-graphql";
import { FieldError } from "./fieldError";
import { User } from "../../entities/User";

@ObjectType()
export class UserResponse {

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field({ nullable: true })
    delete?: boolean;

    @Field({ nullable: true })
    update?: boolean;

    @Field({ nullable: true })
    status?: boolean;
    
    @Field(() => User, { nullable: true })
    user?: User;

    @Field({ nullable: true })
    accessToken?: string;

}