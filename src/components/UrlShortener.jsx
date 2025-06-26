import React, { useState } from 'react';
import axios from 'axios';

function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    if (count >= 5) {
      setError('Limit reached: You can only shorten 5 URLs per session.');
      return;
    }

    if (!originalUrl.trim()) {
      setError('URL cannot be empty');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/shorturls', {
        originalUrl,
      });
      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCount(prev => prev + 1);
      setHistory(prev => [...prev, { original: originalUrl, short: newShortUrl }]);
      setOriginalUrl('');
    } catch (err) {
      console.error(err);
      setError('Failed to shorten URL. Please check the server.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>URL Shortener</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter your long URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          disabled={count >= 5}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button
          type="submit"
          style={{ padding: '8px 16px' }}
          disabled={count >= 5}
        >
          Shorten
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

      {shortUrl && (
        <div style={{ marginTop: 20 }}>
          <p>
            Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h4>Shortened URLs ({count}/5):</h4>
          <ul style={{ textAlign: 'left' }}>
            {history.map((item, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>Original:</strong> <a href={item.original}>{item.original}</a><br />
                <strong>Short:</strong> <a href={item.short}>{item.short}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UrlShortener;
