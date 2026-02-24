
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './layout/Navbar';
import { RecetasPage } from './pages/RecetasPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<RecetasPage />} />
          <Route path="/recetas" element={<RecetasPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
