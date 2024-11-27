import jwt from "jsonwebtoken"
import UserModel from '../model/userModel.js'

export const verifyJWT = async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            console.log("Token not found in request");
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModel.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            console.log("Invalid access Token");
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error);
    }
}