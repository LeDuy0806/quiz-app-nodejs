import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true
    },

    userName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15,
        unique: true
    },

    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    avatar: {
        type: String
    },

    userType: {
        type: String,
        enum: ['Student', 'Teacher', 'Admin'],
        required: true
    },

    password: {
        type: String,
        required: true
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
