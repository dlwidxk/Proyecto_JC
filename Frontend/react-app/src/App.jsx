import Header from './components/Header';
import Home from './pages/Home';
import './App.css';
import './pages/Home.css';

function App() {
  return (
    <>
      <Header />
      <Home />

      <footer className="site-footer">
        <a href="#inicio" className="footer-brand">
          Fórmula <strong>Exacta</strong>
        </a>
        <p>
          © {new Date().getFullYear()} Fórmula Exacta.
          Todos los derechos reservados.
        </p>
      </footer>
    </>
  );
}

export default App;
