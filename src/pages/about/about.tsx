import { FC } from 'react';
import styles from './about.module.css';

export const About: FC = () => {
  return (
    <div className={styles.container}>
      <h1>About Us</h1>
      <p>Learn more about our company and mission</p>
    </div>
  );
}; 