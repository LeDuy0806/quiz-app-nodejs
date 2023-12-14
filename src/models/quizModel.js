import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
    {
        name: { type: String },

        creator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },

        description: { type: String },

        backgroundImage: {
            type: String
        },

        isPublic: { type: Boolean, required: true, default: true },

        category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },

        grade: { type: mongoose.SchemaTypes.ObjectId, ref: 'Grade' },

        tags: [String],

        numberOfQuestions: {
            type: Number
        },

        pointsPerQuestion: {
            type: Number,
            min: 1
        },

        importFrom: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },

        likesCount: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],

        questionList: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Question'
            }
        ]
    },

    {
        timestamps: true
    }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
