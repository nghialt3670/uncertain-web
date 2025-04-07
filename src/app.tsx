import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import { Home } from './pages/home';
import { About } from './pages/about';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <Navigation />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
