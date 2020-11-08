import "reflect-metadata";
import "dotenv-safe/config";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { authChecker } from "./middleware/auth-checker";
import { router } from "./routes";
import { AuthResolver } from "./schema/resolvers/auth";
import { UserResolver } from "./schema/resolvers/user";

// main
(async() => {
    // Database connection
    await createConnection();

    // App
    const app = express();
    app.use(cookieParser());

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

    // Routes
    app.get("/", (_, res) => res.send("auth-graphql"));
    app.use("/api", router);

    // Listen
    app.listen(process.env.PORT, () => {
        console.log(`Server started on http://localhost:${process.env.PORT}`);
    });


})().catch(err => {
    console.log(err);
})
