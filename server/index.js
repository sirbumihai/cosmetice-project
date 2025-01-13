import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import dotenv from 'dotenv';

dotenv.config();

const app = express()
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use(express.json())
app.use('/auth', authRouter)
app.get('/', (req, res) => {
    console.log("req.body")
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is Running")
})