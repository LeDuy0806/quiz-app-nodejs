import { Router } from "express";
const route = Router();

import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import quizRouter from "./quizRoutes.js";
import communityRouter from "./communityRoutes.js";
import gameRouter from "./gameRoutes.js";
import leaderBoardRouter from "./leaderBoardRoutes.js";
import playerResultRouter from "./playerResultRoutes.js";

route.use("/api/auth", authRouter);
route.use("/api/user", userRouter);
route.use("/api/quiz", quizRouter);
route.use("/api/community", communityRouter);
route.use("/api/game", gameRouter);
route.use("/api/leaderBoard", leaderBoardRouter);
route.use("/api/playerResult", playerResultRouter);

export default route;
