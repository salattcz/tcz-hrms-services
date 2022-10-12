import mongoose from 'mongoose';

const companiesSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String },
    contactNumber: { type: String, required: true },
    admins: [
        {
            adminMail: { type: String, required: true },
        },
    ],
    subscriptionPeriod: { type: String, required: true },
    subscriptionType: { type: String, required: true },
    companyLogo: {
        data: Buffer,
        contentType: String,
    },
});

export default mongoose.model('companies', companiesSchema);
