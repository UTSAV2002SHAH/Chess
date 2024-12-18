import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import connectDB from './src/db/connectDB.js'
import loginRoute from "./src/routes/loginRoute.js"

dotenv.config();

// app config
const app = express();
const port = 4000;

// database Connection
connectDB(process.env.MONGO_URL);

// middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
};
app.use(cors(corsOptions));

// app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"))


//initalizing toutes
app.use("/user", loginRoute);

app.listen(port, () => { console.log(`Server started on port ${port}`) });