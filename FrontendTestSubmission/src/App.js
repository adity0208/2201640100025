import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/shorturls', {
        url: url,
        validity: 30
      });
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.response?.data?.error || 'Failed to shorten URL' });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>
          Shorten
        </button>
      </form>
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          {result.error ? (
            <p style={{ color: 'red' }}>Error: {result.error}</p>
          ) : (
            <div>
              <p><strong>Short URL:</strong> <a href={result.shortlink}>{result.shortlink}</a></p>
              <p><strong>Expires:</strong> {result.expiry}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;