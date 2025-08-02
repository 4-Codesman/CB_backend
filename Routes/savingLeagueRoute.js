const express = require('express');
const router = express.Router();
const savingLeagueController = require('../Controllers/savingLeagueController');

// POST /api/saving-leagues/create
router.post('/create', savingLeagueController.createSavingLeague);

module.exports = router;
