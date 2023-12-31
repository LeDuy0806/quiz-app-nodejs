import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30
    },

    firstName: {
        minlength: 2,
        maxlength: 7,
        type: String
    },

    lastName: {
        minlength: 2,
        maxlength: 7,
        type: String
    },

    avatar: {
        type: Object
    },

    userType: {
        type: String,
        enum: ['Student', 'Teacher', 'Admin'],
        required: true
    },

    password: {
        type: String
    },

    point: {
        type: Number
    },

    follows: {
        type: [String]
    },

    friends: {
        type: [String]
    },

    workspace: {
        type: String
    },

    bio: {
        type: String
    },

    emailToken: {
        type: String
    },

    isVerified: {
        type: Boolean
    },

    update: {
        profile: { type: Date },
        mail: { type: Date },
        password: { type: Date }
    }
});

const User = mongoose.model('User', userSchema);
export default User;
