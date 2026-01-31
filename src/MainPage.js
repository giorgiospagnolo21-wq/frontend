import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function MainPage() {
  const [token, setToken] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [posters, setPosters] = useState([]);

  const API = "https://backend-4bx8.onrender.com/api";

  // ---------------- LOGIN ----------------
  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      setToken(res.data.token);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Errore login");
    }
  };

  const logout = () => {
    setToken("");
    setPosters([]);
    setFile(null);
    setPreview("");
    setTitle("");
    setDescription("");
  };

  // ---------------- FILE CHANGE ----------------
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);

    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview("");
    }
  };

  // ---------------- LOAD POSTERS ----------------
  const loadPosters = async () => {
    try {
      const res = await axios.get(`${API}/posters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosters(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Errore caricamento poster");
    }
  };

  // ---------------- UPLOAD ----------------
  const uploadPoster = async () => {
    try {
      if (!file) return alert("Seleziona un file!");
      if (!title || !title.trim()) return alert("Inserisci un titolo!");

      const formData = new FormData();
      formData.append("poster", file);      // NOME GIUSTO
      formData.append("title", title.trim());
      formData.append("description", description);

      await axios.post(`${API}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFile(null);
      setPreview("");
      setTitle("");
      setDescription("");
      loadPosters();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Errore upload");
    }
  };

  // ---------------- DELETE ----------------
  const deletePoster = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadPosters();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Errore eliminazione");
    }
  };

  // ---------------- AUTO LOAD ----------------
  useEffect(() => {
    if (token) loadPosters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ---------------- UI ----------------
  return (
    <div style={{ padding: 20 }}>
      {!token ? (
        <div>
          <h2>Login Sponsor</h2>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Password"
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

          {preview && <img src={preview} alt="preview" width={150} />}

          <input type="file" onChange={onFileChange} />

          <textarea
            placeholder="Titolo (obbligatorio)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
            style={{ display: "block", width: 320, marginTop: 10 }}
          />

          <textarea
            placeholder="Descrizione"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ display: "block", width: 320, marginTop: 10 }}
          />

          <button onClick={uploadPoster} style={{ marginTop: 10 }}>
            Carica
          </button>

          <h2 style={{ marginTop: 30 }}>Lista Poster</h2>

          {posters.length === 0 ? (
            <p>Nessun poster caricato</p>
          ) : (
            posters.map((p) => (
              <div
                key={p.id}
                style={{
                  marginBottom: 20,
                  padding: 12,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  maxWidth: 420,
                  background: "white",
                }}
              >
                <img
                  src={p.file}
                  width={250}
                  alt={p.title || "poster"}
                  style={{ borderRadius: 8 }}
                />

                <p style={{ fontWeight: 800, fontSize: 18, margin: "10px 0 6px" }}>
                  {p.title || "(senza titolo)"}
                </p>

                <p style={{ margin: 0 }}>{p.description}</p>

                <button
                  onClick={() => deletePoster(p.id)}
                  style={{ marginTop: 10, background: "#b00020", color: "white" }}
                >
                  Elimina
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default MainPage;
