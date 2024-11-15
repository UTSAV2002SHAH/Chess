import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './src/db/connectDB.js'
import loginRoute from "./src/routes/loginRoute.js"
dotenv.config();


// app config
const app = express();
const port = 4000;
// console.log(process.env.MONGO_URL);
connectDB(process.env.MONGO_URL);

// middleware
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//initalizing toutes
app.use("/user", loginRoute);



app.listen(port, () => { console.log(`Server started on port ${port}`) });