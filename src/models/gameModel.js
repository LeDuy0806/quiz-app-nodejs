import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
    {
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },

        pin: {
            type: String
        },

        isLive: {
            type: Boolean,
            default: false
        },

        playerList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],

        playerResultList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'PlayerResult'
            }
        ]
    },
    {
        timestamps: true
    }
);

const Game = mongoose.model('Game', gameSchema);
export default Game;
