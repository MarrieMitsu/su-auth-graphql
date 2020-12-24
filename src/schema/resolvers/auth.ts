import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { User } from "../../entities/User";
import { hashCredential, verifyCredential } from "../../utils/credentials";
import { createAccessToken, createForgotPasswordToken, createRefreshToken, sendRefreshToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendEmail";
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

        const usernameCheck = await User.findOne({
            where: {username: input.username}
        });

        if (usernameCheck) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Username already taken"
                    }
                ]
            }
        }

        const emailCheck = await User.findOne({
            where: { email: input.email }
        });

        if (emailCheck) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "Email already taken"
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
                        field: "usernameOrEmail",
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

    // Forgot password
    @Mutation(() => UserResponse)
    async forgotPassword(
        @Arg("email") email: string
    ): Promise<UserResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "Email not found"
                    }
                ],
                status: false,
            }
        }

        const token = createForgotPasswordToken(user);

        sendEmail({
            to: email,
            subject: "Reset your GA password",
            html: `<a href="${process.env.CORS_ORIGIN}/reset-password?signature=${token}">Reset password</a>`
        });

        return {
            status: true,
        }
    }

    // Reset password
    @Mutation(() => UserResponse)
    async resetPassword(
        @Arg("newPassword") _newPassword: string
    ): Promise<UserResponse> {
        return {
            update: true
        }
    }

}