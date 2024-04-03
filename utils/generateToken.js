import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
    if (process.env.ACCESS_TOKEN_SECRET) {
        const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15d"
        })
        return token
    }
    return ""
}