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

        // questionLeaderBoard: [
        //     {
        //         questionIndex: { type: Number },
        //         questionResultList: [
        //             {
        //                 player: {
        //                     type: mongoose.Schema.Types.ObjectId,
        //                     ref: 'User'
        //                 },
        //                 playerPoints: { type: Number }
        //             }
        //         ]
        //     }
        // ],

        currentLeaderBoard: [
            {
                questionIndex: { type: Number },
                leaderBoardList: [
                    {
                        player: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User'
                        },
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
