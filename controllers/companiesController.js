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

  const generateNewToken = catchAsync(async (req, res, next) => {
    const {
      body: { _id, refreshToken },
    //   headers: { app_id = 1 },
    } = req;
  
    /* This code is looking for a user session that has a refresh token that matches the one passed in. */
    let foundUserSessions = await SessionDetailSchema.findOne({
      userGUID: _id,
      refreshToken,
    }).populate('_id', '_id email accountStatus name guid');
  
    /* The above code is checking if the refresh token is valid. If it is not valid, then it will return an
     error. */
    if (!foundUserSessions) return next(new AppError('Invalid refresh token', 401));
  
    let { refreshTokenExpiry } = foundUserSessions;
  
    const expiryDate = moment(refreshTokenExpiry);
  
    /* This code is checking if the current time is before the expiry date. */
    let isAfter = moment().isBefore(expiryDate);
  
    /* This code is checking if the token is expired or not. */
    if (!isAfter) return next(new AppError('Refresh Token Expired', 402));
  
    const {
      browser: savedbrowser,
      version: savedversion,
      os: savedos,
      platform: savedplatform,
      source: savedsource,
    } = foundUserSessions.deviceDetails;
  
    const { browser, version, os, platform, source } = req.useragent;
  
    /* The above code is checking if the user is using a different browser, version, os, platform, or
     source than the one they used last time. If they are, it will return an error. */
    if (
      browser !== savedbrowser ||
      version !== savedversion ||
      os !== savedos ||
      platform !== savedplatform ||
      source !== savedsource
    )
      return next(new AppError('Invalid Device', 403));
  
    /* The above code is generating a JWT token for the user. */
    const token = await generateJWT(foundUserSessions.userId, app_id, foundUserSessions.sessionId);
  
    /* Adding 180 days to the current date and storing it in the session.refreshTokenExpiry variable. */
    foundUserSessions.refreshTokenExpiry = moment().add(180, 'days');
  
    /* This code is setting the foundUserSessions.accessToken to the token that we got from the login. */
    foundUserSessions.accessToken = `JWT ${token}`;
  
    await foundUserSessions.save();
  
    const returnObj = responseObject.create({
      code: 200,
      message: 'Success',
      success: true,
      data: `JWT ${token}`,
    });
    return res.send(returnObj);
  });