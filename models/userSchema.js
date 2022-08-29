import mongoose from 'mongoose'

const contactSchema = mongoose.Schema({
    email: String,
    username: { type: String, required: true },
    emailVerified: { type: Boolean, default: 'false' },
    mobileNumber: { type: String, required: true },
})
const userSchema = mongoose.Schema(
    {
        empNo: { type: String },
        role: { type: String, required: true },
        name: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: Date },
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
        contactDetails: contactSchema,
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
        address: { type: Array, default: [] },
        password: { type: String },
        about: { type: String, default: '' },
        currentProjects: [{ type: String }],
        bloodGroup: { type: String },
    },
    { timestamps: true }
)

export default mongoose.model('users', userSchema)
