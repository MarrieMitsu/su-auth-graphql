import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import { createConnection } from "typeorm";

// main
(async() => {
    // Database connection
    await createConnection();

    // App
    const app = express();

    // Test get request
    app.get("/", (_, res) => res.send("auth-graphql"));

    // Listen
    app.listen(process.env.PORT, () => {
        console.log(`Server started on http://localhost:${process.env.PORT}`);
    });


})().catch(err => {
    console.log(err);
})
