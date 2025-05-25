/** @format */

const express = require('express');
const pollController = require('../controllers/pollController');
const optionController = require('../controllers/optionController');
const voteController = require('../controllers/voteController');

const router = express.Router();

// --- POLLS ROUTES ---
router.post('/polls', pollController.create);
router.get('/polls', pollController.getAll);
router.get('/polls/:id', pollController.getById);
router.put('/polls/:id', pollController.update);
router.delete('/polls/:id', pollController.delete);

// --- OPTIONS ROUTES ---
router.post('/options', optionController.create);
router.get('/options', optionController.getAll);
router.get('/options/:id', optionController.getById);
router.put('/options/:id', optionController.update);
router.delete('/options/:id', optionController.delete);

// --- VOTES ROUTES ---
router.post('/votes', voteController.create);
router.get('/votes', voteController.getAll);
router.get('/votes/:id', voteController.getById);
router.put('/votes/:id', voteController.update);
router.delete('/votes/:id', voteController.delete);

module.exports = router;
