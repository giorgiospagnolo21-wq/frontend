import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [description, setDescription] = useState('');
  const [posters, setPosters] = useState([]);

  // URL backend
  const API = 'https://backend-4bx8.onrender.com/api';

  // --- LOGIN ---
  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      setToken(res.data.token);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Errore login');
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    setToken('');
    setPosters([]);
  };

  // --- FILE CHANGE ---
  const onFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // --- UPLOAD POSTER ---
  const uploadPoster = async () => {
    if (!file) return alert('Seleziona un file!');
    const formData = new FormData();
    formData.append('poster', file);
    formData.append('description', description);

    try {
      await axios.post(`${API}/upload`, formData, {
        headers: { Authorization: token },
      });
      setFile(null);
      setPreview('');
      setDescription('');
      loadPosters();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Errore upload');
    }
  };

  // --- LOAD POSTERS ---
  const loadPosters = async () => {
    try {
      const res = await axios.get(`${API}/posters`, {
        headers: { Authorization: token },
      });
      setPosters(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // --- DELETE POSTER ---
  const deletePoster = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`, {
        headers: { Authorization: token },
      });
      loadPosters();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Errore eliminazione');
    }
  };

  // Load posters on token change
  useEffect(() => {
    if (token) loadPosters();
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      {!token ? (
        <div>
          <h2>Login Sponsor</h2>
          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <>
          <button onClick={logout}>Logout</button>

          <h2>Carica Poster</h2>
          {preview && <img src={preview} alt="preview" style={{ width: 150 }} />}
          <input type="file" onChange={onFileChange} />
          <input
            placeholder="Descrizione"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={uploadPoster}>Carica</button>

          <h2>Lista Poster</h2>
          {posters.map((p) => (
            <div key={p.id} style={{ marginBottom: 20 }}>
              <img src={p.file} alt={p.description} style={{ width: 200 }} />
              <p>{p.description}</p>
              <button onClick={() => deletePoster(p.id)}>Elimina</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
