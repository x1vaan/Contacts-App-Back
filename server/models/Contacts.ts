import { Schema, Document } from "mongoose";

interface Contacts extends Document{
    _id: string;
    name : string;
    phone : number;
}


const contactSchema = new Schema <Contacts>({
    name : {
        type: String,
        require: true
    },
    phone : {
        type: Number,
        unique: true
    }
})

export default contactSchema;