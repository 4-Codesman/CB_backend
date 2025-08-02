const express = require('express');
const router = express.Router();
const savingLeagueController = require('../Controllers/savingLeagueController');

// POST /api/saving-leagues/create
// ✅ Specific first
router.get('/open', savingLeagueController.getOpenSavingLeagues);
router.get('/uID/:uID', savingLeagueController.getUserLeagues);
router.get('/users/:leagueId', savingLeagueController.getUsersInSavingLeague);

// ✅ Generic after
router.post('/:leagueId/join', savingLeagueController.joinSavingLeague);
router.get('/:leagueId', savingLeagueController.getSavingLeagueById);

//redeploy


/*
router.get('/:leagueId', savingLeagueController.getSavingLeagueById);
*/

module.exports = router;
