import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://backend-4bx8.onrender.com/api';

function VotePage() {
  const [posters, setPosters] = useState([]);
  const voted = JSON.parse(localStorage.getItem('voted') || '[]');

  const loadPosters = async () => {
    const res = await axios.get(`${API}/vote`);
    setPosters(res.data);
  };

  const vote = async (id) => {
    if (voted.includes(id)) {
      alert('Hai già votato questo poster');
      return;
    }

    await axios.post(`${API}/vote/${id}`);
    localStorage.setItem('voted', JSON.stringify([...voted, id]));
    loadPosters();
  };

  useEffect(() => {
    loadPosters();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Vota il Poster</h2>

      {posters.map(p => (
        <div key={p.id} style={{ marginBottom: 30 }}>
          <img src={p.file} style={{ width: 250 }} />
          <p>{p.description}</p>
          <p>⭐ Voti: {p.votes}</p>

          <button
            onClick={() => vote(p.id)}
            disabled={voted.includes(p.id)}
          >
            {voted.includes(p.id) ? 'Già votato' : 'Vota'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default VotePage;
