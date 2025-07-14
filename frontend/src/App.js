import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/status')
      .then(res => setStatus(res.data.status))
      .catch(() => setStatus('Backend not reachable'));
  }, []);

  return (
    <div>
      <h1>Aviator Game</h1>
      <p>Backend status: {status}</p>
      {/* TODO: Add game UI here */}
    </div>
  );
}

export default App;
