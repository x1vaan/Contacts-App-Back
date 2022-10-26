import { Router, Request, Response } from "express";
import User from "../models/User";

const router = Router()

router.put('/addcontact', async (req: Request,res: Response):Promise<any | void> => {
    try {
        const id = req.user?.id
        const {name, phone} = req.body
        await User.updateOne({_id : id}, {
            $push: {
                contacts: {name,phone}
            }
        })
        res.status(201).send('Contact added')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/contacts', async (req: Request,res: Response):Promise<any | void > => {
    try {
        const id = req.user?.id
        const contacts = await User.findById(id).select('contacts');
        res.status(200).send(contacts?.contacts)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/deleteContact', async(req: Request,res: Response):Promise<any | void > => {
    try {
        const id = req.user?.id
        const {_id} = req.body
        let contacts = await User.findById(id).select('contacts')
        let contactsFiltered = contacts?.contacts?.filter(contact => contact._id.toString() !== _id);
        await User.updateOne({_id : id}, {
            contacts: contactsFiltered
        })
        res.status(200).json(contactsFiltered)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.put('/editContact', async (req:Request,res:Response):Promise<any | void> => {
    try {
        const id = req.user?.id
        const {name,phone,_id} = req.body
        await User.updateOne({
        _id:id, contacts : { $elemMatch : {_id : _id}}
    }, {
      $set : {'contacts.$.name': name, 'contacts.$.phone': phone}
    })
        res.status(200).json('Contact edited')
    } catch (error) {
        res.status(500).send(error.message)
    }
});

export default router