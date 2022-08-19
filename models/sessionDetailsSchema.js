import mongoose from 'mongoose'

const SessionDetailSchema = mongoose.Schema(
    {
        sessionId: { type: String, required: true },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'companies',
            required: true,
        },
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        refreshTokenExpiry: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('sessionDetails', SessionDetailSchema)
