import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { User } from "../../entities/User";
import { hashCredential, verifyCredential } from "../../utils/credentials";
import { MContext } from "../../utils/types";
import { ChangePasswordInput } from "../types/changePasswordInput";
import { DeleteUserInput } from "../types/deleteUserInput";
import { UserResponse } from "../types/userResponse";

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
    @Mutation(() => UserResponse, { nullable: true })
    @Authorized()
    async updateUser(
        @Ctx() { payload }: MContext,
        @Arg("name") name: string
    ): Promise<UserResponse> {
        const user = await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({ name })
            .where("id = :id", { id: payload?.id })
            .returning("*")
            .execute();

        if (!user) {
            return {
                errors: [
                    {
                        field: "fullname",
                        message: "Something wrong with the server!"
                    }
                ],
                update: false,
            };
        }
        
        return {
            update: true,
            user: user.raw[0],
        };
    }

    // Change password
    @Mutation(() => UserResponse, { nullable: true })
    @Authorized()
    async changeUserPassword(
        @Ctx() { payload }: MContext,
        @Arg("input") input: ChangePasswordInput,
    ): Promise<UserResponse> {
        const user = await User.findOne(payload?.id);

        const valid = await verifyCredential(user?.password!, input.oldPassword);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "oldPassword",
                        message: "Wrong password"
                    }
                ],
                delete: false
            }
        }
        
        const result = await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({ password: await hashCredential(input.newPassword) })
            .where("id = :id", { id: payload?.id })
            .execute();

        if (!result) {
            return {
                update: false,
            };
        }

        return {
            update: true,
        };
    }

    // Delete user
    @Mutation(() => UserResponse, { nullable: true })
    @Authorized()
    async deleteUser(
        @Ctx() { payload }: MContext,
        @Arg("input") input: DeleteUserInput
    ): Promise<UserResponse> {
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

        const result = await User.delete(payload?.id!);
        if (!result) {
            return {
                delete: false
            }
        }

        return {
            delete: true,
        };
    }

}