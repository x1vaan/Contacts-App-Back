import express, { NextFunction, Request, Response } from 'express'
import mongoose from "mongoose";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import FreeAcess from './routes/FreeAccess'
import AuthRoutes from './routes/AuthRoutes'
import cors from 'cors'

const app = express();

dotenv.config()

const { MONGO_URI, SECRET } = process.env;

mongoose.connect(MONGO_URI)
.then(()=> console.log('Database connected'))
.catch((error) => console.log(error))

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors({origin: '*'}))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });
  
app.use('/', FreeAcess);

interface Ireq{
  email: string;
  id: string;
  name: string;
}

declare module 'express' {
  interface Request {
    user?: Ireq
  }
}

app.use((req : Request, res : Response, next : NextFunction) => {
  const header = req.headers['authorization'];
  const token: string | undefined = header && header.split(' ')[1]
   jwt.verify(token as string, '' + SECRET, (err, decoded: any)=> {
    if(err) {
       return res.status(403).json({message : err.message })
    }
    req.user = decoded
    next()
   })
});


app.use('/auth', AuthRoutes);
 
export default app