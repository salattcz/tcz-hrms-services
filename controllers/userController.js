import csv from 'csvtojson';
import moment from 'moment/moment.js';
import csvwriter from 'csv-writer';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import randToken from 'rand-token';

import users from '../models/userSchema.js';
import sessionDetails from '../models/sessionDetailsSchema.js';

var createCsvWriter = csvwriter.createObjectCsvWriter;

export const addUsers = async (req, res) => {
    const filePath = req.file.path;
    const csvWriter = createCsvWriter({
        // Output csv file name is geek_data
        path: 'user_data_summary.csv',
        header: [
            // Title of the columns (column_names)
            { id: 'Sr', title: 'Sr' },
            { id: 'name', title: 'name' },
            { id: 'role', title: 'role' },
            { id: 'gender', title: 'gender' },
            { id: 'dob', title: 'dob' },
            { id: 'email', title: 'email' },
            { id: 'username', title: 'username' },
            { id: 'mobileNumber', title: 'mobileNumber' },
            { id: 'jobTitle', title: 'jobTitle' },
            { id: 'department', title: 'department' },
            { id: 'reportingManager', title: 'reportingManager' },
            { id: 'permanentAddress', title: 'permanentAddress' },
            { id: 'mailingAddress', title: 'mailingAddress' },
            { id: 'about', title: 'about' },
            { id: 'currentProjects', title: 'currentProjects' },
            { id: 'bloodGroup', title: 'bloodGroup' },
            { id: 'status', title: 'status' },
            { id: 'message', title: 'message' },
            { id: 'mongoId', title: 'mongoId' },
        ],
    });
    try {
        const userObjs = await csv()
            .fromFile(filePath)
            .then((jsonObj) => {
                return jsonObj;
            });
        var status;
        var message;
        var mongoId;
        for (var x in userObjs) {
            var userObj = userObjs[x];
            let existingUser = await users.findOne({
                'contactDetails.email': userObj.email,
            });
            if (existingUser) {
                x++;
                // res.json({
                //     message:
                //         'User already exists with userId: ' + existingUser._id,
                // })
                status = 'failed';
                message = 'user already exists';
                mongoId = existingUser._id.toString();
                var newField = {
                    status: status,
                    message: message,
                    mongoId: mongoId,
                };
                var records = [{ ...userObj, ...newField }];
                csvWriter
                    .writeRecords(records)
                    .then(() =>
                        console.log('Data uploaded into csv successfully')
                    );
                continue;
            }
            const dob = moment.utc(userObj.dob, 'DD-MM-YYYY').toDate();
            const user = await users.create({
                name: userObj.name,
                role: userObj.role,
                gender: userObj.gender,
                dob: dob,
                contactDetails: {
                    email: userObj.email,
                    username: userObj.username,
                    mobileNumber: userObj.mobileNumber,
                },
                jobTitle: userObj.jobTitle,
                department: userObj.department,
                reportingManager: userObj.reportingManager,
                address: [
                    {
                        permanentAddress: userObj.permanentAddress,
                        mailingAddress: userObj.mailingAddress,
                    },
                ],
                currentProjects: userObj.currentProjects,
                bloodGroup: userObj.bloodGroup,
                about: userObj.about,
                password: userObj.name.split(' ')[0].toLowerCase() + 123,
                assignedCalendar: userObj.assignedCalendar,
            });
            x++;
            user.save();
            status = 'success';
            message = 'successfully added';
            user.save();
            mongoId = user._id.toString();

            var newField = {
                status: status,
                message: message,
                mongoId: mongoId,
            };
            var records = [{ ...userObj, ...newField }];
            csvWriter
                .writeRecords(records)
                .then(() => console.log('Data uploaded into csv successfully'));
        }
        res.json('success');
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
};

export const addSingleUser = async (req, res) => {
    const {
        name,
        dob,
        gender,
        email,
        department,
        mobileNumber,
        username,
        jobTitle,
        role,
    } = req.body;
    try {
        let existingUser = await users.findOne({
            'contactDetails.email': email,
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const dobFinal = moment.utc(dob, 'DD-MM-YYYY').toDate();
        const user = await users.create({
            name: name,
            role: role,
            gender: gender,
            dob: dobFinal,
            contactDetails: {
                email: email,
                username: username,
                mobileNumber: mobileNumber,
            },
            jobTitle: jobTitle,
            department: department,
            password: name.split(' ')[0].toLowerCase() + 123,
        });
        user.save();
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
};

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let existingUser = await users.findOne({
            'contactDetails.email': email,
        });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (existingUser.role !== 'admin') {
            return res.status(400).json({ message: 'User is not an admin' });
        }
        // const isPasswordCorrect = await bcrypt.compare(
        //     password,
        //     existingUser.password
        // )
        if (password !== existingUser.password) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { email: existingUser.contactDetails.email, id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const sessionId = uuid();
        const refreshToken = randToken.uid(56);
        const refreshTokenExpiry = moment().add(180, 'days');

        await sessionDetails.create({
            sessionId,
            userId: existingUser._id,
            accessToken: token,
            refreshToken,
            refreshTokenExpiry,
        });
        res.status(200).json({ result: existingUser, token, refreshToken });
    } catch (error) {
        console.log(error);
    }
};

export const employeeLogin = async (req, res) => {
    const { companyEmail, email, password } = req.body;
    try {
        let existingUser = await users
            .findOne({
                'contactDetails.email': email,
            })
            .populate({
                path: 'companyId',
                model: 'companies',
                select: 'email',
            });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (existingUser.companyId.email !== companyEmail) {
            return res
                .status(400)
                .json({ message: 'User does not belong to this company' });
        }
        if (existingUser.role !== 'employee') {
            return res
                .status(401)
                .json({ message: 'User is not registered as employee' });
        }
        if (password !== existingUser.password) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { email: existingUser.contactDetails.email, id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const sessionId = uuid();
        const refreshToken = randToken.uid(56);
        const refreshTokenExpiry = moment().add(180, 'days');

        await sessionDetails.create({
            sessionId,
            userId: existingUser._id,
            accessToken: token,
            refreshToken,
            refreshTokenExpiry,
        });
        const userRole = existingUser.role;
        res.status(200).json({
            result: existingUser,
            userRole,
            token,
            refreshToken,
        });
    } catch (error) {}
};

export const deleteUser = async (req, res) => {
    const { email, userId } = req.body;
    try {
        //    const user = await users.find({ $and: [{'contactDetails.email':email}, {_id:userId} ]})
        const existedUser = await users.findOne({
            'contactDetails.email': email,
        });
        if (!existedUser) {
            return res.status(400).json({ message: "User doesn't exists" });
        }
        const updatedUser = await users.findByIdAndUpdate(userId, {
            $set: { isActive: false },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
    }
};

export const getAllUsers = async (req, res) => {
    const { limit: limit, skip: skip } = req.params;
    try {
        const allUsers = await users.find().skip(skip).limit(limit);
        res.status(200).json(allUsers);
    } catch (error) {
        console.log(error);
    }
};

export const getUser = async (req, res) => {
    const { id: _id } = req.params;
    try {
        const user = await users.findById(_id);
        return res.status(200).json(user);
     }catch(error){
        console.log(error);
     }
 }

export const updateUserByAdmin = async (req, res) => {
    const data = req.body;
    try {
        const updatedUser = await users.findByIdAndUpdate(data.userId, {
            $set: data,
        });
        res.send(updatedUser);
    } catch (error) {
        console.log(error);
    }
};

export const updateUserBySelf = async (req, res) => {
    try {
    } catch (error) {}
};
