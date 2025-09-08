const express = require('express');
const router = express.Router();
const shorturlController = require('../controllers/shorturlController');

// POST /shorturls - Create short URL
router.post('/', shorturlController.createShortUrl);

// GET /:shortcode - Redirect to original URL
router.get('/:shortcode', shorturlController.redirectToUrl);

// GET /:shortcode/stats - Get analytics
router.get('/:shortcode/stats', shorturlController.getStats);

module.exports = router;