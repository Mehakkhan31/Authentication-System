import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./utils/db.js";
import cookieParser from "cookie-parser";

// import all routes
import userRoutes from "./routes/user.route.js"

dotenv.config();

// connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

//user routes
app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})