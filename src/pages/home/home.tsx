import { FC } from 'react';
import styles from './home.module.css';

export const Home: FC = () => {
  return (
    <div className={styles.container}>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of our application</p>
    </div>
  );
}; 