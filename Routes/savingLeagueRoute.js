const express = require('express');
const router = express.Router();
const savingLeagueController = require('../Controllers/savingLeagueController');

// POST /api/saving-leagues/create
router.post('/create', savingLeagueController.createSavingLeague);
router.get('/:leagueId', savingLeagueController.getSavingLeagueById);
router.post('/:leagueId/join', savingLeagueController.joinSavingLeague);
router.get('/uID/:uID', savingLeagueController.getUserLeagues);
/*
router.get('/:leagueId', savingLeagueController.getSavingLeagueById);
*/

module.exports = router;
