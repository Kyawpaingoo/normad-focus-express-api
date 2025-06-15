import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import prisma from './prisma';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

const port = process.env.HTTP_PORT;
async function main()
{
    try {
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
