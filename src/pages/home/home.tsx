import { FC } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css';

export const Home: FC = () => {
  const navigate = useNavigate();

  const handleSingleDeviceClick = () => {
    navigate('/single-device');
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of our application</p>
      <div className={styles.buttonContainer}>
        <Button 
          type="primary" 
          size="large" 
          className={styles.button}
          onClick={handleSingleDeviceClick}
        >
          One device
        </Button>
        <Button type="primary" size="large" className={styles.button}>
          Online
        </Button>
      </div>
    </div>
  );
}; 