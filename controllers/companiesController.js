import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import randToken from 'rand-token';

import companies from '../models/companiesSchema.js';

export const register = async (req,res) => {
    const {name, email, description, contactNumber, admins, subscPeriod, subscType} = req.body;
    try {
        const sessionId = uuid();
        const existingCompany = await companies.findOne({email});
        if(existingCompany){
            return res.status(404).json({message: "User already exist"});
        }

        const newCompany = await companies.create({name, email, description, contactNumber, admins, subscriptionPeriod: subscPeriod, subscriptionType: subscType});
        const token = jwt.sign({email: newCompany.email, id:newCompany._id}, process.env.JWT_SECRET, {expiresIn:'1h'})
        const refreshToken = randToken.uid(56);
        res.status(200).json({result: newCompany, token, refreshToken})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong..."});
    }
}