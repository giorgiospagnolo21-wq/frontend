import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import VotePage from './pages/VotePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/vote" element={<VotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
