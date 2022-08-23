import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    empNo: { type: String },
    role: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    contactDetails: [
        {
            email: { type: String, required: true },
            username: { type: String, required: true },
            emailVerified: { type: Boolean, default: 'false' },
            mobileNumber: { type: String, required: true },
        },
    ],
    profilePicture: { data: Buffer, contentType: String, default: {} },
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    reportingManager: { type: String, required: true },
    team: [{ type: String, default: '' }],
    documents: [
        {
            aadhar: { type: String },
            panCard: { type: String },
            banDetails: [{ type: String }],
        },
    ],
    address: [
        {
            permanentAddress: { type: String, required: true },
            mailingAddress: { type: String, required: true },
        },
    ],
    password: { type: String, required: true },
    about: { type: String, default: '' },
    currentProjects: [{ type: String }],
    bloodGroup: { type: String },
})
