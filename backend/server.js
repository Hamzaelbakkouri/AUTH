import { notFound, errorHandler } from './middleware/errormiddlware.js';
import userRoutes from './routes/userRoutes.js'
import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;
dotenv.config();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/users', userRoutes);
app.get('/', (req, res) => res.send('rah nadiiii'))
app.use(notFound)
app.use(errorHandler)

connectDB().then(() => app.listen(port, () => console.log(`server is running on port: ${port}`))).catch((err) => console.log(err))


