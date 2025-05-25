/** @format */

const express = require('express');
const pollController = require('../controllers/pollController');
const optionController = require('../controllers/optionController');
const voteController = require('../controllers/voteController');
const homeController = require('../controllers/homeController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Home page
router.get('/', homeController.getHomePage);

// Public routes (if any)
router.get('/polls', pollController.getAll);
router.get('/polls/:id', pollController.getById);
router.get('/polls/:id/results', pollController.getResults);

// All protected routes
// --- POLLS ROUTES ---
router.post('/polls', isAuthenticated, pollController.create);
router.put('/polls/:id', isAuthenticated, pollController.update);
router.delete('/polls/:id', isAuthenticated, pollController.delete);

// --- OPTIONS ROUTES ---
router.post('/options', isAuthenticated, optionController.create);
router.get('/options', isAuthenticated, optionController.getAll);
router.get('/options/:id', isAuthenticated, optionController.getById);
router.put('/options/:id', isAuthenticated, optionController.update);
router.delete('/options/:id', isAuthenticated, optionController.delete);

// --- VOTES ROUTES ---
router.post('/votes', isAuthenticated, voteController.create);
router.get('/votes', isAuthenticated, voteController.getAll);
router.get('/votes/:id', isAuthenticated, voteController.getById);
router.put('/votes/:id', isAuthenticated, voteController.update);
router.delete('/votes/:id', isAuthenticated, voteController.delete);

module.exports = router;
