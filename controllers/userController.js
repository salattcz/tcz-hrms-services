import csv from 'csvtojson'
import moment from 'moment/moment.js'
import csvwriter from 'csv-writer'

import users from '../models/userSchema.js'

var createCsvWriter = csvwriter.createObjectCsvWriter

export const addUsers = async (req, res) => {
    const filePath = req.file.path
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
    })
    try {
        const userObjs = await csv()
            .fromFile(filePath)
            .then((jsonObj) => {
                return jsonObj
            })
        var status
        var message
        var mongoId
        for (var x in userObjs) {
            var userObj = userObjs[x]
            let existingUser = await users.findOne({
                'contactDetails.email': userObj.email,
            })
            if (existingUser) {
                x++
                // res.json({
                //     message:
                //         'User already exists with userId: ' + existingUser._id,
                // })
                status = 'failed'
                message = 'user already exists'
                mongoId = existingUser._id.toString()
                var newField = {
                    status: status,
                    message: message,
                    mongoId: mongoId,
                }
                var records = [{ ...userObj, ...newField }]
                csvWriter
                    .writeRecords(records)
                    .then(() =>
                        console.log('Data uploaded into csv successfully')
                    )
                continue
            }
            const dob = moment.utc(userObj.dob, 'DD-MM-YYYY').toDate()
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
                // password: userObj.name.split(' ')[0].toLowerCase() + 123,
            })
            x++
            status = 'success'
            message = 'successfully added'
            user.save()
            mongoId = user._id.toString()

            var newField = {
                status: status,
                message: message,
                mongoId: mongoId,
            }
            var records = [{ ...userObj, ...newField }]
            csvWriter
                .writeRecords(records)
                .then(() => console.log('Data uploaded into csv successfully'))
        }

        res.json('success')
    } catch (error) {
        console.log(error)
        res.status(400).json(error.message)
    }
}
