import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },

        field: {
            type: String
        },

        creator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },

        backgroundImage: {
            type: String
        },

        questionIndex: { type: Number, required: true },

        questionType: {
            type: String,
            enum: ['True/False', 'Quiz'],
            required: true
        },

        optionQuestion: {
            type: String,
            required: true
        },

        pointType: {
            type: String,
            enum: ['Standard', 'Double', 'BasedOnTime'],
            required: true
        },

        isPublic: { type: Boolean, required: true, default: true },

        answerTime: {
            type: Number,
            min: 5,
            max: 90
        },

        maxCorrectAnswer: { type: Number, required: true },

        answerList: [
            {
                name: { type: String },
                body: { type: String },
                isCorrect: { type: Boolean }
            }
        ],

        correctAnswerCount: { type: Number, required: true },

        answerCorrect: { type: [String], required: true }
    },

    {
        timestamps: true
    }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;
