import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors, { CorsOptions } from 'cors';
import prisma from './prisma';
import authRouter from './router/authRouter';
import expenseRouter from './router/expenseRouter';
import taskRouter from './router/taskRouter';
import meetingScheduleRouter from './router/meetingScheduleRouter';
import countryLogRouter from './router/countryLogRouter';

dotenv.config();
const app = express();

const allowedOrigin = process.env.ALLOWED_ORIGIN;

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded(
    { extended: true }
));

app.use(cookieParser());
app.use(fileUpload());

const port = process.env.HTTP_PORT;
async function main()
{
    try {
        app.use('/api/auth', authRouter);
        app.use('/api/expense', expenseRouter);
        app.use('/api/task', taskRouter);
        app.use('/api/meeting-schedule',  meetingScheduleRouter);
        app.use('/api/country-log', countryLogRouter);
        app.listen(port,()=> {
            console.log(`Server is running on port ${port}`);
        });
        await prisma.$connect();
        console.log('Connected to the database successfully');
    }
    catch(error)
    {
        console.error('Error starting the server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();
