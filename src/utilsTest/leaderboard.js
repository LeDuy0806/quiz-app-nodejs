import { ObjectId } from 'mongodb';

const leaderBoardValid = {
    game: new ObjectId('657f0d99bab1d78f78897d8f'),
    quiz: new ObjectId('6482f73f4887f9afcfb547c6'),
    pin: '7992',
    playerResultList: [],
    currentLeaderBoard: []
};

const leaderBoardInValidGame = {
    game: null,
    quiz: new ObjectId('6482f73f4887f9afcfb547c6'),
    pin: '7992',
    playerResultList: [],
    currentLeaderBoard: []
};

const leaderBoardInValidQuiz = {
    game: new ObjectId('657f0d99bab1d78f78897d8f'),
    quiz: null,
    pin: '7992',
    playerResultList: [],
    currentLeaderBoard: []
};

const leaderBoardInValidPin = {
    game: new ObjectId('657f0d99bab1d78f78897d8f'),
    quiz: new ObjectId('6482f73f4887f9afcfb547c6'),
    pin: null,
    playerResultList: [],
    currentLeaderBoard: []
};

export {
    leaderBoardValid,
    leaderBoardInValidGame,
    leaderBoardInValidQuiz,
    leaderBoardInValidPin
};
