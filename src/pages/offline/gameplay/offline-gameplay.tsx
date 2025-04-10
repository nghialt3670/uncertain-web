import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined, UserOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../store';
import { setCurrentPlayerIndex, setIsWordVisible, markPlayerAsViewed } from '../../../store/slices/gameSlice';
import styles from './offline-gameplay.module.css';

interface Player {
  id: number;
  name: string;
  word?: string;
  hasViewed?: boolean;
}

export const OfflineGameplay: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { players, currentPlayerIndex, isWordVisible } = useSelector((state: RootState) => state.game);
  const [isFlipped, setIsFlipped] = useState(false);
  const [allPlayersViewed, setAllPlayersViewed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentPlayer = players[currentPlayerIndex];

  // Reset flip state when current player changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentPlayerIndex]);

  const handleViewWord = () => {
    setIsFlipped(true);
    dispatch(setIsWordVisible(true));
  };

  const handleNextPlayer = () => {
    // Start transition - hide content
    setIsTransitioning(true);
    setIsFlipped(false);
    
    // Mark current player as viewed
    if (currentPlayer) {
      dispatch(markPlayerAsViewed(currentPlayer.id));
    }
    
    // Reset word visibility in Redux
    dispatch(setIsWordVisible(false));
    
    // Wait for card flip animation to complete before changing player
    setTimeout(() => {
      if (currentPlayerIndex < players.length - 1) {
        dispatch(setCurrentPlayerIndex(currentPlayerIndex + 1));
      } else {
        setAllPlayersViewed(true);
      }
      // End transition
      setIsTransitioning(false);
    }, 400); // Slightly longer than the flip animation
  };

  const startDiscussion = () => {
    navigate('/offline/discussion');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button 
          className={styles.backButton}
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/offline/config')}
          aria-label={t('common.back')}
        />
      </div>

      {!allPlayersViewed ? (
        <>
          <h2 className={styles.gamePhaseTitle}>
            {t('game.gameplay.playerTurn', { name: currentPlayer?.name })}
          </h2>
          
          <div className={styles.cardContainer}>
            <div 
              className={`${styles.flipCard} ${isFlipped ? styles.flipped : ''} ${isTransitioning ? styles.transitioning : ''}`} 
              onClick={!isFlipped && !isTransitioning ? handleViewWord : undefined}
            >
              <div className={styles.cardFront}>
                <EyeOutlined className={styles.cardIcon} />
                <div className={styles.cardText}>
                  {t('game.gameplay.tapToReveal')}
                </div>
              </div>
              <div className={styles.cardBack}>
                <div className={styles.cardText}>
                  <div className={styles.cardLabel}>{t('game.gameplay.yourWord')}</div>
                  <p className={styles.wordText}>{currentPlayer?.word}</p>
                  <Button 
                    type="primary"
                    onClick={handleNextPlayer}
                    className={styles.nextButton}
                    disabled={isTransitioning}
                  >
                    {currentPlayerIndex < players.length - 1 
                      ? t('game.gameplay.passToNext') 
                      : t('common.done')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className={styles.gamePhaseTitle}>
            {t('game.gameplay.allPlayersViewed')}
          </h2>
          
          <div className={styles.playerList}>
            <div className={styles.playerListScroll}>
              {players.map((player: Player) => (
                <div key={player.id} className={styles.playerItem}>
                  <UserOutlined className={styles.playerIcon} />
                  <span className={styles.playerName}>{player.name}</span>
                  <span className={styles.playerStatus}>
                    <CheckCircleOutlined /> {t('game.gameplay.viewed')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            className={styles.discussButton}
            onClick={startDiscussion}
          >
            {t('game.gameplay.startDiscussion')}
          </Button>
        </>
      )}
    </div>
  );
};
