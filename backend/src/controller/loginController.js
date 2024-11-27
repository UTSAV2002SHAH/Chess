import UserModel from '../model/userModel.js'
import validator from 'validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const JWT_KEY = process.env.JWT_SECRET;

export const handleUserSignup = async (req, res) => {
    console.log(req.body);
    console.log("signup api hit succesfull");

    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        //Email and Password xValidations
        // Validate email format using regex
        const isValid = validator.isEmail(email);

        if (!isValid) {
            console.log("email not valid");
            return res.status(400).json({
                success: false,
                message: "Invalid email format. Please enter a valid email.",
            });
        }

        // Check if the email is unique
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            console.log("Email already exists");
            return res.status(400).json({
                success: false,
                message: "Email already exists. Please login.",
            });
        }

        // Validate password length and alphanumeric characters
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            console.log("Password must be of 8 character and alphanumeric");
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and contain both letters and numbers.",
            });
        }

        const userData = {
            name,
            email,
            password,
        }
        const user = new UserModel(userData);
        await user.save();

        res.json({ success: true, message: "User Created" });
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
}

export const handleUserLogin = async (req, res) => {
    //email
    //req body 
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    console.log("Login api hit succesfull");

    try {
        //find user&check
        const existingUser = await UserModel.findOne({ email }); // $or: [{username}, {email}]
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        //password check
        const ispasswordValid = await existingUser.isPasswordCorrect(password)
        if (existingUser && ispasswordValid) {

            // const token = jwt.sign(
            //     { userId: existingUser._id, name: existingUser.name, isGuest: true },
            //     JWT_KEY);

            //access and refresh token
            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id);
            console.log(accessToken);
            console.log(refreshToken);

            const loggedInUser = await UserModel.findById(existingUser._id).select("-password -refreshToken -createdAt -updatedAt")
            const options = {
                httpOnly: true,
                secure: true
            }

            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(
                    {
                        user: loggedInUser,
                        accessToken,
                        refreshToken,
                        success: true
                    },
                )


            // const user = {
            //     id: existingUser._id,
            //     name: existingUser.name,
            //     token: token,
            //     isGuest: true,
            // };

            // console.log("Login successfull");
            // res.json({
            //     success: true,
            //     message: "Logged in successfully",
            //     user: user
            // });
        }
        else {
            console.log("Email or Password is incorrect");
            res.status(400).json({ success: false, message: "Email or Password is incorrect" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "internal Issue tyr after sometime" });
    }
}

export const handleUserLogout = async (req, res) => {
    // remove cookies
    // reset refresh token

    try {
        console.log(req.user);
        await UserModel.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: "" } },
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ success: true, message: "User Logged Out successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}

export const refresh = async (req, res) => {

    // Check for refreshToken in cookies
    const inComingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!inComingRefreshToken) {
        return res.status(401).json({ success: false, message: "Unauthorised request" })
    }

    try {
        // Decode the token to extract `_id`
        let decodedtoken
        try {
            decodedtoken = jwt.verify(inComingRefreshToken, process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
        }

        // Find the user in the database based on `_id`
        const user = await UserModel.findById(decodedtoken?._id)
        if (!user) {
            return res.status(401).send({ success: false, message: "Invalid token" })
        }

        //  Verify if the refresh token matches the one stored in the database
        if (inComingRefreshToken !== user?.refreshToken) {
            return res.status(401).send({ success: false, message: "Refresh token is expired login Again" })
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        // Generate a new access token (and optionally a new refresh token)
        const { accessToken, refreshToken: newrefreshToken } = await generateAccessAndRefreshToken(user._id)


        // User Data
        const userData = {
            "id": user._id,
            "name": user.name,
            "token": accessToken,
            "isGuest": true
        }
        console.log(userData);

        //Send Response with the new tokens and user data
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                {
                    success: true,
                    user: userData,
                    accessToken: accessToken,
                    refreshToken: newrefreshToken,
                    message: ""
                }
            )
    } catch (error) {
        console.log(error);
    }
}

const generateAccessAndRefreshToken = async (userId) => {
    try {

        const user = await UserModel.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }); // we have to save the user doc seperetly

        return { accessToken, refreshToken }

    } catch (error) {
        console.log(error);
    }
}