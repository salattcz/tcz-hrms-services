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

const verifyJWT = async (req, res, next) => {
    try {
    //   let {
    //     user: { contactDetails },
    //   } = req;
  
      const companyObj = {
        name: _.get(req.body, 'name', ''),
        email: _.get(req.body, 'email'),
        description: _.get(req.body, 'description'),
        contactNumber: _.get(req.body, 'contactNumber'),
        companyLogo: _.get(req.body, 'companyLogo', ''),
        _id: _.get(req.body, '_id', ''),
        admins: {
          adminMail: _.get(req.body, 'admins.adminMail', ''),
        },
        subscriptionPeriod: _.get(req.body, 'subscriptionPeriod'),
        subscriptionType: _.get(req.body, 'subscriptionType')
      };
  
      const returnObj = responseObject.create({
        code: 200,
        message: 'Valid JWT Token',
        success: true,
        data: companyObj,
      });
      return res.send(returnObj);
    } catch (error) {
      const { message } = error;
      logger.error(`Error in verifyJWT: ${message}`);
      return next(new AppError(message, 401));
    }
  };

  