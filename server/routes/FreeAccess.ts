import { Router, Request, Response } from "express";
import User from "../models/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'

dotenv.config();

const { SECRET } = process.env

const router = Router()

interface Contacts {
    name : string;
    phone : string;
}

interface userInterface {
   _id : string;
   name: string;
   email: string;
   password: string;
   contacts? : Contacts[]
}

router.post('/register', async (req: Request,res: Response): Promise<any | void> => {
    try {
        const {name, email, password} = req.body;
     const oldUser: userInterface | null = await User.findOne({email : email});

     if(oldUser) return res.status(409).send('User already registered');

     await User.create({name,email,password});
     res.status(201).send('User registered')
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});

router.post('/login', async (req: Request,res: Response):Promise<any | void> => {
    try {
        const {email, password} = req.body;

        const usuario: userInterface | null = await User.findOne({email});
        if(!usuario) return res.status(403).send('User not registered');
        
        const isValid:boolean = await bcrypt.compare(password, usuario.password)
        if(isValid) {
            const token:string = jwt.sign({email: email, id: usuario._id, name: usuario.name}, "" + SECRET, {expiresIn : '24h'});
            return res.status(200).json(token)
        } else {
            return res.status(401).send('Password not valid')
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router