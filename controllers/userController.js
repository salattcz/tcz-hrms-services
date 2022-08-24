import csv from 'csvtojson'
import moment from 'moment/moment.js'

import users from '../models/userSchema.js'

export const addUsers = async (req, res) => {
    const filePath = req.file.path
    try {
        const userObjs = await csv()
            .fromFile(filePath)
            .then((jsonObj) => {
                return jsonObj
            })
        for (var x in userObjs) {
            var userObj = userObjs[x]
            let existingUser = await users.findOne({'contactDetails.email': userObj.email})
            if (existingUser) {
                x++;
                // res.json({
                //     message:
                //         'User already exists with userId: ' + existingUser._id,
                // })
                continue;
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
            x++;
            user.save()
        }
        // return res.json('success')
    } catch (error) {
        console.log(error)
    }
}
