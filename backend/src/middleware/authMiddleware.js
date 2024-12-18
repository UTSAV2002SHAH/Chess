import jwt from "jsonwebtoken"
import UserModel from '../model/userModel.js'

export const verifyJWT = async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            console.log("Token not found in request");
            return res.status(401).json({ success: false, message: "Token not found" });
        }
        console.log(token);


        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            console.log("Invalid access Token");
            return res.status(401).json({ success: false, message: "Invalid access token" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}