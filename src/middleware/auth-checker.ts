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
        const verify = verifyToken(token, "access");
        if (verify && val.length === 0) {
            context.payload = verify;
            return true;
        } else {
            return false;
        }
    }

    return false;

}