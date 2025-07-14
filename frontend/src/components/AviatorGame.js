import React, { useState } from 'react';
import axios from 'axios';

function AviatorGame() {
  const [username, setUsername] = useState('player1');
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashMultiplier, setCrashMultiplier] = useState(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [payout, setPayout] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const startRound = async () => {
    const res = await axios.post('http://localhost:5000/api/aviator/start');
    setCrashMultiplier(res.data.crashMultiplier);
    setMultiplier(1.0);
    setBetPlaced(false);
    setCashedOut(false);
    setPayout(null);

    // Simulate multiplier increasing every 100ms
    if (intervalId) clearInterval(intervalId);
    const id = setInterval(() => {
      setMultiplier(prev => {
        const next = +(prev + 0.05).toFixed(2);
        if (next >= res.data.crashMultiplier) {
          clearInterval(id);
        }
        return next;
      });
    }, 100);
    setIntervalId(id);
  };

  const placeBet = async () => {
    await axios.post('http://localhost:5000/api/aviator/bet', {
      username,
      amount: betAmount,
    });
    setBetPlaced(true);
  };

  const cashOut = async () => {
    const res = await axios.post('http://localhost:5000/api/aviator/cashout', {
      username,
      cashoutMultiplier: multiplier,
    });
    setCashedOut(true);
    setPayout(res.data.payout);
    if (intervalId) clearInterval(intervalId);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 24, borderRadius: 8, maxWidth: 400 }}>
      <h2>Aviator Game</h2>
      <div>
        <label>
          Username: <input value={username} onChange={e => setUsername(e.target.value)} disabled={betPlaced} />
        </label>
      </div>
      <div>
        <label>
          Bet Amount: <input type="number" value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} disabled={betPlaced} />
        </label>
      </div>
      <div style={{ margin: '16px 0' }}>
        <button onClick={startRound}>Start Round</button>
        <button onClick={placeBet} disabled={betPlaced}>Place Bet</button>
        <button onClick={cashOut} disabled={!betPlaced || cashedOut}>Cash Out</button>
      </div>
      <div>
        <strong>Current Multiplier:</strong> {multiplier}x
      </div>
      <div>
        <strong>Crash Multiplier:</strong> {crashMultiplier ? crashMultiplier + 'x' : 'Not started'}
      </div>
      {cashedOut && (
        <div>
          <strong>Payout:</strong> {payout}
        </div>
      )}
    </div>
  );
}

export default AviatorGame;
