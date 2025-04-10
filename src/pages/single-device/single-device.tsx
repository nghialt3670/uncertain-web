import { FC } from 'react';
import styles from './single-device.module.css';

export const SingleDevice: FC = () => {
  return (
    <div className={styles.container}>
      <h1>Single Device Mode</h1>
      <div className={styles.content}>
        <p>Welcome to single device configuration</p>
      </div>
    </div>
  );
}; 