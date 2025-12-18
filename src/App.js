import { HashRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import VotePage from './pages/VotePage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/vote" element={<VotePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
