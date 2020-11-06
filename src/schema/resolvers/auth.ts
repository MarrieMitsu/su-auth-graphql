import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { User } from "../../entities/User";
import { hashCredential, verifyCredential } from "../../utils/credentials";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "../../utils/jwt";
import { MContext } from "../../utils/types";
import { LoginInput } from "../types/loginInput";
import { RegisterInput } from "../types/registerInput";
import { UserResponse } from "../types/userResponse";

@Resolver()
export class AuthResolver {

    // Register
    @Mutation(() => UserResponse)
    async register(
        @Arg("input") input: RegisterInput,
        @Ctx() { res }: MContext
    ): Promise<UserResponse> {

        const inputCheck = await User.findOne({
            where: [
                { username: input.username },
                { email: input.email }
            ]
        });

        if (inputCheck) {
            return {
                errors: [
                    {
                        field: "uniqueField",
                        message: "Username or Email already taken"
                    }
                ]
            }
        }

        const user = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                name: input.name,
                username: input.username,
                email: input.email,
                password: await hashCredential(input.password),
            })
            .returning("*")
            .execute();

        sendRefreshToken(res, createRefreshToken(user.raw[0]));

        return {
            user: user.raw[0],
            accessToken: createAccessToken(user.raw[0])
        }
    }

    // Login
    @Mutation(() => UserResponse)
    async login(
        @Arg("input") input: LoginInput,
        @Ctx() { res }: MContext
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
                        field: "uniqueField",
                        message: "Username or Email doesn't exist"
                    }
                ]
            }
        }

        const valid = await verifyCredential(user.password, input.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Wrong password"
                    }
                ]
            }
        }

        sendRefreshToken(res, createRefreshToken(user));

        return {
            user,
            accessToken: createAccessToken(user)
        }
    }

    // Logout
    @Mutation(() => Boolean)
    logout(
        @Ctx() { res }: MContext
    ): boolean {
        sendRefreshToken(res, "");
        return true;
    }

}