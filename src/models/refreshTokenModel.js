import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
        token: { type: String, unique: true }
    },

    {
        timestamps: true
    }
);

const RefreshToken = mongoose.model('refresh_tokens', RefreshTokenSchema);
export default RefreshToken;
