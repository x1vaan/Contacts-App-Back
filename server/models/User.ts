import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcrypt';

interface Contacts {
    name : string;
    phone : string;
    _id: string;
}

interface Iuser extends Document{
    name: string;
    email: string;
    password: string;
    contacts?: Contacts[];
}

const userSchema = new Schema<Iuser>({
    name : {
        type : String
    },
    email: {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true,
        unique : true
    },
    contacts : [{
        name: String,
        phone:{
            type: String
        }
    }]
})

userSchema.pre('save', async function(next) {
    try {
     const hash = await bcrypt.hash(this.password, 10);
     this.password = hash;
     next();
    } catch (error) {
      throw new Error ('Could not be hashed');
    }
 });

 export default model<Iuser>('User', userSchema);