import mongoose from 'mongoose';

const leaderBoardSchema = new mongoose.Schema(
    {
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game'
        },

        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },

        pin: {
            type: String
        },

        playerResultList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'PlayerResult'
            }
        ],

        currentLeaderBoard: [
            {
                questionIndex: { type: Number },
                leaderBoardList: [
                    {
                        player: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User'
                        },
                        pointAnswerQuestion: { type: Number },
                        playerCurrentScore: { type: Number }
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
);

const LeaderBoard = mongoose.model('LeaderBoard', leaderBoardSchema);
export default LeaderBoard;
