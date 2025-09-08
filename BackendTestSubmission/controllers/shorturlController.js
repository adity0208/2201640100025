const { urlDatabase, analyticsDB } = require('../storage/inMemoryStore');
const { generateRandomShortcode, isValidUrl, isAlphanumeric, calculateExpiry } = require('../utils/helpers');
const logger = require('../utils/logger'); // Import the logger

const shorturlController = {
  createShortUrl: async (req, res) => {
    try {
      const { url, validity = 30, shortcode } = req.body;

      // Log the request
      await logger.info('controller', `Received request to shorten URL: ${url}`);

      // Validation
      if (!url || !isValidUrl(url)) {
        await logger.warn('controller', `Invalid URL received: ${url}`);
        return res.status(400).json({ error: 'Invalid or missing URL' });
      }

      if (validity && (typeof validity !== 'number' || validity <= 0)) {
        await logger.warn('controller', `Invalid validity received: ${validity}`);
        return res.status(400).json({ error: 'Validity must be a positive number' });
      }

      let finalShortcode = shortcode;
      
      // Handle custom shortcode
      if (finalShortcode) {
        if (!isAlphanumeric(finalShortcode)) {
          await logger.warn('controller', `Non-alphanumeric shortcode attempted: ${finalShortcode}`);
          return res.status(400).json({ error: 'Shortcode must be alphanumeric' });
        }
        if (urlDatabase.has(finalShortcode)) {
          await logger.warn('controller', `Duplicate shortcode attempted: ${finalShortcode}`);
          return res.status(409).json({ error: 'Shortcode already exists' });
        }
        await logger.info('controller', `Using custom shortcode: ${finalShortcode}`);
      } else {
        // Generate random shortcode until unique
        do {
          finalShortcode = generateRandomShortcode();
        } while (urlDatabase.has(finalShortcode));
        await logger.debug('controller', `Generated random shortcode: ${finalShortcode}`);
      }

      // Create entry
      const createdAt = new Date();
      const expiry = calculateExpiry(validity);
      
      urlDatabase.set(finalShortcode, {
        longUrl: url,
        createdAt,
        expiry,
        validityMinutes: validity
      });

      // Initialize analytics
      analyticsDB.set(finalShortcode, []);

      await logger.info('controller', `Successfully created shortcode: ${finalShortcode} for URL: ${url} with expiry: ${expiry.toISOString()}`);

      res.status(201).json({
        shortlink: `http://localhost:${process.env.PORT}/${finalShortcode}`,
        expiry: expiry.toISOString()
      });

    } catch (error) {
      await logger.error('controller', `Error creating short URL: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  redirectToUrl: async (req, res) => {
    try {
      const { shortcode } = req.params;
      
      await logger.info('handler', `Redirect request for shortcode: ${shortcode}`);
      
      if (!urlDatabase.has(shortcode)) {
        await logger.warn('handler', `Shortcode not found: ${shortcode}`);
        return res.status(404).json({ error: 'Shortcode not found' });
      }

      const urlData = urlDatabase.get(shortcode);
      
      // Check if expired
      if (new Date() > urlData.expiry) {
        await logger.info('handler', `Shortcode expired: ${shortcode}`);
        urlDatabase.delete(shortcode);
        analyticsDB.delete(shortcode);
        return res.status(410).json({ error: 'Shortlink has expired' });
      }

      // Log analytics data
      const clickData = {
        timestamp: new Date(),
        referrer: req.get('Referer') || 'Direct',
        userAgent: req.get('User-Agent'),
        ip: req.ip
      };
      
      analyticsDB.get(shortcode).push(clickData);

      await logger.info('handler', `Redirecting shortcode: ${shortcode} to URL: ${urlData.longUrl}`);
      await logger.debug('handler', `Click data: ${JSON.stringify(clickData)}`);

      res.redirect(302, urlData.longUrl);

    } catch (error) {
      await logger.error('handler', `Error redirecting for shortcode ${req.params.shortcode}: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getStats: async (req, res) => {
    try {
      const { shortcode } = req.params;
      
      await logger.info('controller', `Stats request for shortcode: ${shortcode}`);
      
      if (!urlDatabase.has(shortcode)) {
        await logger.warn('controller', `Shortcode not found for stats: ${shortcode}`);
        return res.status(404).json({ error: 'Shortcode not found' });
      }

      const urlData = urlDatabase.get(shortcode);
      const analyticsData = analyticsDB.get(shortcode) || [];

      await logger.info('controller', `Returning stats for shortcode: ${shortcode}, total clicks: ${analyticsData.length}`);

      res.json({
        shortcode,
        longUrl: urlData.longUrl,
        createdAt: urlData.createdAt.toISOString(),
        expiry: urlData.expiry.toISOString(),
        totalClicks: analyticsData.length,
        clicks: analyticsData.map(click => ({
          timestamp: click.timestamp.toISOString(),
          referrer: click.referrer,
          userAgent: click.userAgent
        }))
      });

    } catch (error) {
      await logger.error('controller', `Error getting stats for shortcode ${req.params.shortcode}: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = shorturlController;