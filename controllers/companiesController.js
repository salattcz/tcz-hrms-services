import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import randToken from 'rand-token';

import companies from '../models/companiesSchema.js';
import sessionDetails from '../models/sessionDetailsSchema.js';
import moment from 'moment/moment.js';

export const register = async (req, res) => {
    const {
        name,
        email,
        description,
        contactNumber,
        admins,
        subscPeriod,
        subscType,
    } = req.body;

    const adminMails = admins.replace(/\s/g, '').split(',');

    adminMails.map((mail, index) => {
        adminMails[index] = { adminMail: mail };
    });

    try {
        const sessionId = uuid();
        const existingCompany = await companies.findOne({ email });
        if (existingCompany) {
            return res.status(404).json({ message: 'User already exist' });
        }

        const newCompany = await companies.create({
            name,
            email,
            description,
            contactNumber,
            admins: adminMails,
            subscriptionPeriod: subscPeriod,
            subscriptionType: subscType,
        });
        const token = jwt.sign(
            { email: newCompany.email, id: newCompany._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }

        );
        const refreshToken = randToken.uid(56);
        const refreshTokenExpiry = moment().add(180, 'days');

        await sessionDetails.create({
            sessionId,
            companyId: newCompany._id,
            accessToken: token,
            refreshToken,
            refreshTokenExpiry,
        });
        res.status(200).json({ result: newCompany, token, refreshToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong...' });
    }
};

const verifyJWT = async (req, res, next) => {
    try {
        const { token, companyId } = req.body;
        const userExisted = await sessionDetails.findOne({
            companyId: companyId,
        });
        if (!userExisted) {
            return res.status(404).json({ message: 'Invalid userId' });
        }
        const tokenExisted = await sessionDetails.findOne({
            accessToken: token,
        });
        if (!tokenExisted) {
            return res.status(404).json({ message: 'Invalid token' });
        }
        const foundUser = await sessionDetails.findOne(
            { companyId: companyId } && { accessToken: token }
        );
        const returnObj = {
            code: 200,
            message: 'Valid JWT Token',
            success: true,
            data: foundUser,
        };
        return res.send(returnObj);
    } catch (error) {
        console.log(error);
        res.send(400).json(error);
    }
};

export const generateNewToken = async (req, res, next) => {
    const {
        body: { _id, refreshToken },
    } = req;

    /* This code is looking for a user session that has a refresh token that matches the one passed in. */
    let foundUserSessions = await sessionDetails
        .findOne({
            companyId: _id,
            refreshToken,
        })
        .populate('_id', '_id email name companyId');

    /* The above code is checking if the refresh token is valid. If it is not valid, then it will return an
     error. */
    if (!foundUserSessions)
        return res.status(401).json({ message: 'Invalid refresh token' });

    let { refreshTokenExpiry } = foundUserSessions;

    const expiryDate = moment(refreshTokenExpiry);

    /* This code is checking if the current time is before the expiry date. */
    let isAfter = moment().isBefore(expiryDate);

    /* This code is checking if the token is expired or not. */
    if (!isAfter)
        return res.status(402).json({ message: 'Refresh token expired' });

    /* The above code is generating a JWT token for the user. */
    const token = jwt.sign(
        {
            companyId: foundUserSessions.companyId,
            sessionId: foundUserSessions.sessionId,
        },
        process.env.JWT_SECRET
    );

    /* Adding 180 days to the current date and storing it in the session.refreshTokenExpiry variable. */
    foundUserSessions.refreshTokenExpiry = moment().add(180, 'days');

    /* This code is setting the foundUserSessions.accessToken to the token that we got from the login. */
    await sessionDetails.findByIdAndUpdate(foundUserSessions._id, {
        $set: { accessToken: `JWT ${token}` },
    });

    // await foundUserSessions.save();

    const returnObj = {
        code: 200,
        message: 'Success',
        success: true,
        data: `JWT ${token}`,
    };
    return res.send(returnObj);
};

export const login = async (req, res) => {};
