import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { User } from "../../entities/User";
import { hashCredential, verifyCredential } from "../../utils/credentials";
import { MContext } from "../../utils/types";
import { DeleteUserInput } from "../types/deleteUserInput";
import { DeleteUserResponse } from "../types/deleteUserResponse";

@Resolver()
export class UserResolver {
    // Get all users
    @Query(() => [User], { nullable: true })
    async users(): Promise<User[] | null> {
        return await User.find();
    }

    // Me 
    @Query(() => User, { nullable: true })
    @Authorized()
    async me(
        @Ctx() { payload }: MContext
    ): Promise<User | null> { 
        const user = await User.findOne(payload?.id);

        if (!user) {
            return null;
        }
        
        return user;
    }

    // Update
    @Mutation(() => User, { nullable: true })
    @Authorized()
    async updateUser(
        @Ctx() { payload }: MContext,
        @Arg("name") name: string
    ): Promise<User | null> {
        const user = await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({ name })
            .where("id = :id", { id: payload?.id })
            .returning("*")
            .execute();

        if (!user) {
            return null;
        }
        
        return user.raw[0];
    }

    // Change password
    @Mutation(() => Boolean, { nullable: true })
    @Authorized()
    async changePassword(
        @Arg("id", () => Int) id: number,
        @Arg("password") password: string
    ): Promise<boolean> {
        await User.update(id, {
            password: await hashCredential(password),
        });
        
        return true;
    }

    // Delete user
    @Mutation(() => DeleteUserResponse, { nullable: true })
    @Authorized()
    async deleteUser(
        @Ctx() { payload }: MContext,
        @Arg("input") input: DeleteUserInput
    ): Promise<DeleteUserResponse> {
        const user = await User.findOne({
            where: [
                { username: input.unique },
                { email: input.unique }
            ]
        });

        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "Username or Email doesn't exist"
                    }
                ],
                delete: false,
            }
        }

        if (user.id !== payload?.id) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "user not match with current user"
                    }
                ],
                delete: false,
            }
        }

        if (input.verify !== "delete-account") {
            return {
                errors: [
                    {
                        field: "verify",
                        message: "Input not match"
                    }
                ],
                delete: false,
            }
        }

        const valid = await verifyCredential(user.password, input.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "confirmPassword",
                        message: "Wrong password"
                    }
                ],
                delete: false,
            }
        }

        await User.delete(payload?.id!);
        return {
            delete: true,
        };
    }

}