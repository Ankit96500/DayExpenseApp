"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const premiumFeatureC_1 = require("../controllers/premiumFeatureC");
const authorize_1 = require("../middleware/authorize");
const router = (0, express_1.Router)();
// redirect to leader board
router.get("/leaderboard", authorize_1.UserAuthorized, premiumFeatureC_1.LeaderBoard);
router.get("/get-leaderboard-data", authorize_1.UserAuthorized, premiumFeatureC_1.getLeaderBoardData);
exports.default = router;
