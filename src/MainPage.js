const uploadPoster = async () => {
  try {
    if (!file) return alert("Seleziona un file");
    if (!title.trim()) return alert("Inserisci un titolo");

    const formData = new FormData();
    formData.append("poster", file);        // NOME GIUSTO
    formData.append("title", title.trim());
    formData.append("description", description);

    await axios.post(`${API}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`   // token corretto
      }
    });

    setFile(null);
    setTitle("");
    setDescription("");
    loadPosters();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Errore upload");
  }
};
