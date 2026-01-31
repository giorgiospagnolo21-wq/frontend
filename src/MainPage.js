import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function MainPage() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [description, setDescription] = useState('');
  const [posters, setPosters] = useState([]);

  const API = 'https://backend-4bx8.onrender.com/api';

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      setToken(res.data.token);
      setUsername('');
      setPassword('');
    } catch (err) {
      alert(err.response?.data?.message || 'Errore login');
    }
  };

  const logout = () => {
    setToken('');
    setPosters([]);
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

 const uploadPoster = async () => {
  try {
    if (!file) return alert('Seleziona un file!');
    if (!title.trim()) return alert('Inserisci un titolo!');

    const formData = new FormData();
    formData.append('poster', file);          // DEVE chiamarsi "poster"
    formData.append('title', title.trim());
    formData.append('description', description);

    await axios.post(`${API}/upload`, formData, {
      headers: { Authorization: `Bearer ${token}` }, // meglio Bearer
    });

    setFile(null);
    setPreview('');
    setTitle('');
    setDescription('');
    loadPosters();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.response?.data?.error || 'Errore upload');
  }
};

  const loadPosters = async () => {
    const res = await axios.get(`${API}/posters`, {
      headers: { Authorization: token },
    });
    setPosters(res.data);
  };

  const deletePoster = async (id) => {
    await axios.delete(`${API}/delete/${id}`, {
      headers: { Authorization: token },
    });
    loadPosters();
  };

  useEffect(() => {
    if (token) loadPosters();
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      {!token ? (
        <div>
          <h2>Login Sponsor</h2>
          <input value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <>
          <button onClick={logout}>Logout</button>

          <h2>Carica Poster</h2>
          {preview && <img src={preview} alt="preview" width={150} />}
          <input type="file" onChange={onFileChange} />
          <input value={description} onChange={e => setDescription(e.target.value)} />
          <button onClick={uploadPoster}>Carica</button>

          <h2>Lista Poster</h2>
          {posters.map(p => (
            <div key={p.id}>
              <img src={p.file} width={200} />
              <p>{p.description}</p>
              <button onClick={() => deletePoster(p.id)}>Elimina</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default MainPage;
