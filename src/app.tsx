import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { About } from './pages/about';
import { SingleDevice } from './pages/single-device';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/single-device" element={<SingleDevice />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
