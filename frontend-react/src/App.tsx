
import { Navbar } from './layout/Navbar';
import { RecetasPage } from './pages/RecetasPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <RecetasPage />
      </main>
    </div>
  );
}

export default App;
