import UserModel from '../model/userModel.js'
import validator from 'validator';

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
        const user = UserModel(userData);
        await user.save();

        res.json({ success: true, message: "User Created" });
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
}

export const handleUserLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login api hit succesfull");

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser && existingUser.password === password) {
            console.log("Login successfull");
            res.json({ success: true, message: "Logged in successfully" });
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

export const fetchUserData = async (req, res) => {
    pass;
}