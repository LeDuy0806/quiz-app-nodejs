import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const Grade = mongoose.model('Grade', gradeSchema);
export default Grade;
