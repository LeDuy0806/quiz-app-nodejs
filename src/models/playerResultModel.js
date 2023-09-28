import mongoose from 'mongoose';

const playerResultSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },

    score: {
        type: Number,
        default: 0
    },

    answers: [
        {
            questionIndex: { type: Number },
            answered: {
                type: Boolean,
                default: false
            },
            answers: [String],
            time: { type: Number },
            points: {
                type: Number,
                default: 0
            }
        }
    ]
});

const PlayerResult = mongoose.model('PlayerResult', playerResultSchema);
export default PlayerResult;
