import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import './App.css';

const navLinkClass = ({ isActive }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

function App() {
  return (
    <Router>
      {/* BookProvider membungkus seluruh halaman agar state buku bisa diakses dari mana pun */}
      <BookProvider>
        <div className="app">
          <header className="app-header">
            <div className="app-header-inner">
              <NavLink to="/" className="app-brand">
                <span className="app-brand-title">KutuBUKU</span>
                <span className="app-brand-subtitle">Manajemen Buku Pribadi</span>
              </NavLink>
              <nav aria-label="Navigasi utama">
                <ul className="nav-links">
                  <li>
                    <NavLink to="/" end className={navLinkClass}>
                      Beranda
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/statistik" className={navLinkClass}>
                      Statistik
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/statistik" element={<Stats />} />
          </Routes>

          <footer className="app-footer">
            Made with ❤️ by Me
          </footer>
        </div>
      </BookProvider>
    </Router>
  );
}

export default App;
