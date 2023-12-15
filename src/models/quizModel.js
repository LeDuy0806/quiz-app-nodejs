import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        creator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },

        description: { type: String, default: '' },

        backgroundImage: {
            type: String,
            default: ''
        },
        isDraft: { type: Boolean, required: true, default: true },

        isPublic: { type: Boolean, required: true, default: true },

        category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },

        grade: { type: mongoose.SchemaTypes.ObjectId, ref: 'Grade' },

        tags: [String],

        numberOfQuestions: {
            type: Number,
            default: 0
        },

        pointsPerQuestion: {
            type: Number,
            min: 1,
            default: 1
        },

        importFrom: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            default: null
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

quizSchema.pre('save', function (next) {
    // console.log(this.importFrom, this.name, this.creator);

    this.importFrom = this.importFrom ? this.importFrom : null;
    this.category = this.category ? this.category : null;
    this.grade = this.grade ? this.grade : null;
    this.numberOfQuestions = this.questionList.length;

    next();
});

quizSchema.pre('findOne', function (next) {
    console.log('chay vo day roi ne');

    this.populate({
        path: 'creator',
        select: ['userName', 'firstName', 'lastName', 'avatar', 'userType']
    });

    if (this.category) {
        this.populate({ path: 'category', select: 'name' });
    }

    if (this.grade) {
        this.populate({ path: 'grade', select: 'name' });
    }

    if (this.importFrom) {
        this.populate({
            path: 'importFrom',
            select: ['userName', 'firstName', 'lastName', 'avatar', 'userType']
        });
    }

    next();
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
