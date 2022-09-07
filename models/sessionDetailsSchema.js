import mongoose from 'mongoose';

const SessionDetailSchema = mongoose.Schema(
    {
        sessionId: { type: String, required: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        refreshTokenExpiry: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('sessionDetails', SessionDetailSchema);
