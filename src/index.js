import express from 'express';
import connectDb from './config/dbConnection.js';
import errorHandler from './middlewares/errorHandler.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { Server } from 'socket.io';

import route from './routes/index.js';

dotenv.config();
connectDb();
const Port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(route);
app.use(errorHandler);

const server = app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});

const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
        origin: 'http://localhost:3000'
    }
});

let game;
let gameIdCurrent;
let pinGames = [];
let leaderBoard;
let leaderBoardGame = [];
let players = [];

const addPlayer = (userName, playerId, avatar, socketId) => {
    !players.some((player) => player.socketId === socketId) &&
        players.push({ userName, playerId, avatar, socketId });
};

const getPlayer = (socketId) => {
    return players.find((player) => player.socketId === socketId);
};

io.on('connection', (socket) => {
    console.log('User with id ' + socket.id + ' connected');

    socket.on('disconnect', (reason) => {
        console.log('Socket ' + socket.id + ' was disconnected');
        console.log(reason);
    });

    socket.on('init-game', (newGame, newLeaderBoard) => {
        game = JSON.parse(JSON.stringify(newGame));
        pinGames.push(game.pin);

        newLeaderBoard = JSON.parse(JSON.stringify(newLeaderBoard));
        leaderBoardGame.push(newLeaderBoard);

        // console.log(
        //     'Host with id ' +
        //         socket.id +
        //         ' started game and joined room: ' +
        //         game.pin
        // );

        socket.join(game.pin);
    });

    socket.on('add-player', (user, socketId, pin, cb) => {
        if (pinGames.includes(pin)) {
            leaderBoardGame.map((leaderBoard) => {
                if (leaderBoard.pin === pin) {
                    gameIdCurrent = leaderBoard.game;
                }
            });
            addPlayer(user.userName, user._id, user.avatar, socketId);
            cb('correct', user._id, gameIdCurrent);

            // console.log(
            //     'Student ' +
            //         user.userName +
            //         ' with id ' +
            //         socket.id +
            //         ' joined room ' +
            //         pin
            // );
            socket.join(pin);

            const player = getPlayer(socketId);
            io.to(pin).emit('player-added', player, pin);
        } else {
            cb('wrong', gameIdCurrent);
        }
    });

    socket.on('host-leave-room', (pin, cb) => {
        cb();

        // console.log('Host with id ' + socket.id + ' leave room: ' + pin);

        pinGames = pinGames.filter((item) => item !== pin);
        leaderBoardGame = leaderBoardGame.filter((item) => item.pin !== pin);

        socket.to(pin).emit('host-leave', pin);
        socket.leave(pin);
    });

    socket.on('student-leave-room', (pin, cb) => {
        cb();

        // console. log('Student with id ' + socket.id + ' leave room: ' + pin);
        let player = getPlayer(socket.id);

        socket.to(pin).emit('student-leave', player, pin);
        socket.leave(pin);
    });

    socket.on('start-game', (leaderBoardId) => {
        // console.log('Start Game');
        socket.to(game?.pin).emit('host-start-game', leaderBoardId);
    });

    socket.on('countdown-preview', (gamePin, cb) => {
        cb();

        socket.to(gamePin).emit('host-countdown-preview', gamePin);
    });

    socket.on('start-question-timer', (gamePin, questionIndex, cb) => {
        cb();

        // console.log('Send question ' + questionIndex + ' data to players');
        socket.to(gamePin).emit('host-start-question-timer', questionIndex);
    });

    socket.on('start-question-result', (gamePin, questionIndex, cb) => {
        cb();

        // console.log('Start question result' + questionIndex);
        socket.to(gamePin).emit('host-start-question-result', questionIndex);
    });

    socket.on(
        'send-answer-to-host',
        (leaderBoardId, pinGame, questionIndex, result) => {
            // console.log(
            //     'Student with id ' + socket.id + ' send answer for teacher'
            // );
            socket
                .to(pinGame)
                .emit(
                    'get-answer-from-player',
                    leaderBoardId,
                    pinGame,
                    questionIndex,
                    result
                );
        }
    );

    socket.on('send-other-result', (pinGame, resultPlayer) => {
        // console.log(resultPlayer, pinGame);
        socket.to(pinGame).emit('host-send-other-result', resultPlayer);
    });

    socket.on('show-leaderBoard', (gamePin, questionIndex, cb) => {
        cb();

        // console.log('Show leaderBoard ' + questionIndex + ' to players');
        socket.to(gamePin).emit('host-show-leaderBoard', questionIndex);
    });

    socket.on('end-game', (pinGame, cb) => {
        cb();
        socket.to(pinGame).emit('host-end-game');
        socket.leave(pinGame);
    });

    socket.on('host-end-game', (pinGame, cb) => {
        cb();
        socket.to(pinGame).emit('host-end-game');
        socket.leave(pinGame);
    });

    socket.on('player-end-game', (pinGame, cb) => {
        cb();
        socket.to(pinGame).emit('player-end-game');
        socket.leave(pinGame);
    });
});
