import { AuthChecker } from "type-graphql";
import { verifyToken } from "../utils/jwt";
import { MContext } from "../utils/types";

export const authChecker: AuthChecker<MContext> = (
    { context },
    val
) => {
    const authorization = context.req.headers['authorization'];

    if (authorization) {
        const token = authorization.split(" ")[1];
        if (verifyToken(token) && val.length === 0) {
            context.payload = verifyToken(token);
            return true;
        } else {
            return false;
        }
    }

    return false;

}