import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { OfflineConfig } from './pages/offline/config';
import styles from './app.module.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { OfflineGameplay } from './pages/offline/gameplay';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className={styles.app}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/offline/config" element={<OfflineConfig />} />
            <Route path="/offline/gameplay" element={<OfflineGameplay />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
