import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://backend-4bx8.onrender.com/api';

function VotePage() {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Poster già votati (per browser)
  const voted = JSON.parse(localStorage.getItem('voted') || '[]');

  // 🔹 Carica poster
  const loadPosters = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/vote`);
      setPosters(res.data);
    } catch (err) {
      console.error(err);
      setError('Errore nel caricamento dei poster');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Vota poster
  const vote = async (posterId) => {
    if (voted.includes(posterId)) {
      alert('Hai già votato questo poster');
      return;
    }

    try {
      await axios.post(`${API}/vote/${posterId}`);
      localStorage.setItem(
        'voted',
        JSON.stringify([...voted, posterId])
      );
      loadPosters();
    } catch (err) {
      console.error(err);
      alert('Errore durante il voto');
    }
  };

  // 🔹 Caricamento iniziale
  useEffect(() => {
    loadPosters();
  }, []);

  // 🔹 Stati UI
  if (loading) {
    return <p style={{ padding: 20 }}>Caricamento poster…</p>;
  }

  if (error) {
    return <p style={{ padding: 20, color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Vota il Poster</h2>

      {posters.length === 0 && (
        <p>Nessun poster disponibile</p>
      )}

      {posters.map((p) => (
        <div
          key={p.id}
          style={{
            marginBottom: 30,
            padding: 15,
            border: '1px solid #ddd',
            borderRadius: 8,
            maxWidth: 300
          }}
        >
          <img
            src={p.file}
            alt={p.description}
            style={{ width: '100%', borderRadius: 6 }}
          />

          <p style={{ marginTop: 10 }}>
            {p.description}
          </p>

          <p>
            ⭐ Voti: <strong>{p.votes}</strong>
          </p>

          <button
            onClick={() => vote(p.id)}
            disabled={voted.includes(p.id)}
            style={{
              padding: '8px 12px',
              cursor: voted.includes(p.id) ? 'not-allowed' : 'pointer'
            }}
          >
            {voted.includes(p.id) ? 'Già votato' : 'Vota'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default VotePage;
