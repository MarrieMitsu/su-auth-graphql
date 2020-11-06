import "reflect-metadata";
import "dotenv-safe/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { UserResolver } from "./schema/resolvers/user";
import { authChecker } from "./middleware/auth-checker";
import { AuthResolver } from "./schema/resolvers/auth";

// main
(async() => {
    // Database connection
    await createConnection();

    // App
    const app = express();

    // Apollo server
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [AuthResolver, UserResolver],
            authChecker: authChecker,
            authMode: "null"
        }),
        context: ({req, res}) => ({ req, res }),
    })
    
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    // Test get request
    app.get("/", (_, res) => res.send("auth-graphql"));

    // Listen
    app.listen(process.env.PORT, () => {
        console.log(`Server started on http://localhost:${process.env.PORT}`);
    });


})().catch(err => {
    console.log(err);
})
