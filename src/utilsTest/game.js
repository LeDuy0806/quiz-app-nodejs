import { ObjectId } from 'mongodb';

const gameValid = {
    host: new ObjectId('657bb88103adc5835c989d27'),
    quiz: new ObjectId('6482f73f4887f9afcfb547c6'),
    pin: '6789',
    isLive: true,
    playerList: [],
    playerResultList: []
};

const gameHostInValid = {
    host: null,
    quiz: new ObjectId('6482f73f4887f9afcfb547c6'),
    pin: '6789',
    isLive: true,
    playerList: [],
    playerResultList: []
};

const gameQuizInValid = {
    host: new ObjectId('657bb88103adc5835c989d27'),
    quiz: null,
    pin: '6789',
    isLive: true,
    playerList: [],
    playerResultList: []
};

const gamePinInValid = {
    host: new ObjectId('657bb88103adc5835c989d27'),
    quiz: new ObjectId('6482f73f4887f9afcfb547c6'),
    pin: null,
    isLive: true,
    playerList: [],
    playerResultList: []
};

export { gameValid, gameHostInValid, gameQuizInValid, gamePinInValid };
