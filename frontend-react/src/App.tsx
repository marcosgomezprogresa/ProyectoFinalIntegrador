
import { Navbar } from './components/Navbar';
import { ListadoRecetas } from './components/ListadoRecetas';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <ListadoRecetas />
      </main>
    </div>
  );
}

export default App;
