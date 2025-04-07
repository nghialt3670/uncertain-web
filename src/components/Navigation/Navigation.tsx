import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation: FC = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <Link to="/" className={styles.link}>Home</Link>
        </li>
        <li>
          <Link to="/about" className={styles.link}>About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 