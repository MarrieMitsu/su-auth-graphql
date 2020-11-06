import argon2 from "argon2"

// Hash credential
export const hashCredential = async (credential: string): Promise<string> => {
    return await argon2.hash(credential);
}

// Verify credential
export const verifyCredential = async (
    hashedCrendential: string, 
    credential: string
): Promise<boolean> => {
    return await argon2.verify(hashedCrendential, credential);
}