import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { User } from "../../entities/User";
import { hashCredential } from "../../utils/credentials";
import { MContext } from "../../utils/types";

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
        @Arg("id", () => Int) id: number,
        @Arg("name") name: string
    ): Promise<User | null> {
        const user = await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({ name })
            .where("id = :id", { id })
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
    @Mutation(() => Boolean, { nullable: true })
    @Authorized()
    async deleteUser(
        @Arg("id",() => Int) id: number
    ): Promise<boolean> {
        await User.delete(id);
        return true;
    }

}