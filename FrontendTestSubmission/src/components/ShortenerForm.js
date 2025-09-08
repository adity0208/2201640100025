import React, { useState } from 'react';
import { api } from '../services/api';
import { logger } from '../utils/logger';

const ShortenerForm = () => {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    logger.info('component', 'Form submitted');
    
    const results = [];
    for (const item of urls) {
      if (item.url) {
        try {
          const response = await api.createShortUrl({
            url: item.url,
            validity: item.validity ? parseInt(item.validity) : undefined,
            shortcode: item.shortcode || undefined
          });
          results.push({ success: true, data: response.data, original: item });
        } catch (error) {
          results.push({ success: false, error: error.response?.data, original: item });
        }
      }
    }
    setResults(results);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {urls.map((item, index) => (
          <div key={index}>
            <input
              placeholder="Long URL"
              value={item.url}
              onChange={(e) => {
                const newUrls = [...urls];
                newUrls[index].url = e.target.value;
                setUrls(newUrls);
              }}
              required
            />
            <input
              placeholder="Validity (minutes)"
              type="number"
              value={item.validity}
              onChange={(e) => {
                const newUrls = [...urls];
                newUrls[index].validity = e.target.value;
                setUrls(newUrls);
              }}
            />
            <input
              placeholder="Custom Shortcode (optional)"
              value={item.shortcode}
              onChange={(e) => {
                const newUrls = [...urls];
                newUrls[index].shortcode = e.target.value;
                setUrls(newUrls);
              }}
            />
          </div>
        ))}
        <button type="submit">Shorten URLs</button>
      </form>

      {results.map((result, index) => (
        <div key={index}>
          {result.success ? (
            <div>
              <p>Original: {result.original.url}</p>
              <p>Shortlink: <a href={result.data.shortlink}>{result.data.shortlink}</a></p>
              <p>Expires: {result.data.expiry}</p>
            </div>
          ) : (
            <div>
              <p>Error: {result.error?.error}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShortenerForm;