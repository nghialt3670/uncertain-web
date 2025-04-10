import { FC, useState } from 'react';
import { Button, Modal } from 'antd';
import { SettingOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './home.module.css';

export const Home: FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSingleDeviceClick = () => {
    navigate('/offline/config');
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsSettingsOpen(false);
  };

  return (
    <div className={styles.container}>
      <Button 
        icon={<SettingOutlined />}
        className={styles.settingsButton}
        onClick={() => setIsSettingsOpen(true)}
        aria-label={t('game.config')}
      />

      <div className={styles.titleContainer}>
        <h1 className={styles.title}>UNCERTAIN</h1>
        <p className={styles.subtitle}>A social deduction game</p>
      </div>

      <div className={styles.content}>
        <h2 className={styles.gameModesTitle}>{t('game.selectMode', 'Select game mode:')}</h2>
        <div className={styles.buttonContainer}>
          <Button 
            type="default"
            size="large" 
            className={styles.button}
            onClick={handleSingleDeviceClick}
          >
            {t('game.modes.oneDevice', 'One Device')}
          </Button>
          <Button 
            type="default" 
            size="large" 
            className={`${styles.button} ${styles.disabled}`}
            disabled
          >
            {t('game.modes.online', 'Online')}
            <span> (Coming Soon)</span>
          </Button>
        </div>
      </div>

      <Modal
        title={
          <div className={styles.settingsTitle}>
            {t('game.config')}
            <CloseOutlined onClick={() => setIsSettingsOpen(false)} />
          </div>
        }
        open={isSettingsOpen}
        footer={null}
        closable={false}
        className={styles.settingsModal}
        onCancel={() => setIsSettingsOpen(false)}
      >
        <div className={styles.languageOptions}>
          <h3>{t('language')}</h3>
          <Button 
            className={styles.languageButton}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </Button>
          <Button 
            className={styles.languageButton}
            onClick={() => handleLanguageChange('vi')}
          >
            Tiếng Việt
          </Button>
          <Button 
            className={styles.languageButton}
            onClick={() => handleLanguageChange('zh')}
          >
            中文
          </Button>
        </div>
      </Modal>
    </div>
  );
}; 