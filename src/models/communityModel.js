import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    backgroundImage: {
        type: String
    },

    users: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        }
    ],

    quizzes: [
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Quiz'
        }
    ],

    field: {
        type: String
    },

    chatBox: [
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Message'
        }
    ]
});

const Community = mongoose.model('Community', communitySchema);
export default Community;
