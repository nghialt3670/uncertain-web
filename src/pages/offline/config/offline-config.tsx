import { FC, useState, useRef, useEffect } from 'react';
import { Button, Input, Modal, Select, Slider, Card } from 'antd';
import { EditOutlined, SettingOutlined, UserOutlined, CloseOutlined, DeleteOutlined, ArrowLeftOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../store';
import { setPlayers, setGameWords, setConfig, resetGame } from '../../../store/slices/gameSlice';
import styles from './offline-config.module.css';

const { Option } = Select;

interface Player {
  id: number;
  name: string;
  word?: string;
  hasViewed?: boolean;
}

export const OfflineConfig: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { players, config } = useSelector((state: RootState) => state.game);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [newId, setNewId] = useState<number | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [gameWords, setGameWords] = useState<{ civilian: string; imposter: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Mock API call with translations
  const mockGetWords = () => {
    return new Promise<{ civilian: string; imposter: string }>((resolve) => {
      setTimeout(() => {
        // Word pairs for different languages
        const wordPairs: {[key: string]: Array<{civilian: string; imposter: string}>} = {
          en: [
            { civilian: "Birthday Cake", imposter: "Wedding Cake" },
            { civilian: "Soccer Ball", imposter: "Basketball" },
            { civilian: "Coffee Shop", imposter: "Restaurant" },
            { civilian: "Smartphone", imposter: "Tablet" },
          ],
          vi: [
            { civilian: "Bánh sinh nhật", imposter: "Bánh cưới" },
            { civilian: "Bóng đá", imposter: "Bóng rổ" },
            { civilian: "Quán cà phê", imposter: "Nhà hàng" },
            { civilian: "Điện thoại thông minh", imposter: "Máy tính bảng" },
          ],
          zh: [
            { civilian: "生日蛋糕", imposter: "婚礼蛋糕" },
            { civilian: "足球", imposter: "篮球" },
            { civilian: "咖啡店", imposter: "餐厅" },
            { civilian: "智能手机", imposter: "平板电脑" },
          ]
        };
        
        // Get word pairs for current language
        const currentLang = i18n.language;
        const availableLang = Object.keys(wordPairs).includes(currentLang) ? currentLang : 'en';
        const languageWordPairs = wordPairs[availableLang];
        
        // Select random pair
        const randomPair = languageWordPairs[Math.floor(Math.random() * languageWordPairs.length)];
        resolve(randomPair);
      }, 1000);
    });
  };

  // Initialize translated player names
  useEffect(() => {
    // Check if we have default player names needing translation 
    const hasDefaultNames = players.some(player => 
      player.name === 'Player1' || player.name === 'Player2' || player.name === 'Player3'
    );

    if (hasDefaultNames) {
      const translatedPlayers = players.map((player, index) => {
        if (player.name === `Player${index + 1}`) {
          return { ...player, name: `${t('game.player')} ${index + 1}` };
        }
        return player;
      });
      dispatch(setPlayers(translatedPlayers));
    }
  }, [t, dispatch, i18n.language]);

  useEffect(() => {
    if (newId !== null) {
      // Clear the new player animation after it completes
      const timer = setTimeout(() => {
        setNewId(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [newId]);

  useEffect(() => {
    // Scroll to bottom when new player is added
    if (scrollRef.current && newId !== null) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [players]);

  useEffect(() => {
    const sliderElement = sliderRef.current;
    
    const preventTouchMove = (e: TouchEvent) => {
      // Prevent the default behavior for touch events on the slider
      e.preventDefault();
    };
    
    if (sliderElement) {
      sliderElement.addEventListener('touchmove', preventTouchMove, { passive: false });
      
      return () => {
        sliderElement.removeEventListener('touchmove', preventTouchMove);
      };
    }
  }, [isConfigOpen]);

  const handleEditPlayer = (id: number, newName: string) => {
    dispatch(setPlayers(players.map((player: Player) => 
      player.id === id ? { ...player, name: newName } : player
    )));
  };

  const handleRemovePlayer = (id: number) => {
    if (players.length > 3) {
      setRemovingId(id);
      setTimeout(() => {
        dispatch(setPlayers(players.filter((player: Player) => player.id !== id)));
        setRemovingId(null);
      }, 300);
    }
  };

  const handleAddPlayer = () => {
    const id = players.length > 0 ? Math.max(...players.map((p: Player) => p.id)) + 1 : 1;
    const nextPlayerNumber = players.length + 1;
    setNewId(id);
    dispatch(setPlayers([...players, { id, name: `${t('game.player')} ${nextPlayerNumber}` }]));
  };

  const handleConfigChange = (key: string, value: string | number) => {
    dispatch(setConfig({
      ...config,
      [key]: value
    }));
  };

  const startGame = async () => {
    setIsLoading(true);
    try {
      const words = await mockGetWords();
      dispatch({ type: 'game/setGameWords', payload: words });
      
      // Select random imposters
      const imposterIndices: number[] = [];
      while (imposterIndices.length < config.imposters) {
        const randomIndex = Math.floor(Math.random() * players.length);
        if (!imposterIndices.includes(randomIndex)) {
          imposterIndices.push(randomIndex);
        }
      }
      
      // Create new player objects with assigned words
      const playersCopy = players.map((player, index) => ({
        ...player,
        word: imposterIndices.includes(index) ? words.imposter : words.civilian,
        hasViewed: false
      }));
      
      dispatch({ type: 'game/setPlayers', payload: playersCopy });
      navigate('/offline/gameplay');
    } catch (error) {
      console.error('Error starting game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewWord = () => {
    setIsWordVisible(true);
  };

  const handleNextPlayer = () => {
    // Mark current player as viewed
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].hasViewed = true;
    dispatch(setPlayers(updatedPlayers));
    setIsWordVisible(false);

    // Move to next player or finish
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
    } else {
      // All players have viewed their words
      navigate('/offline/gameplay');
    }
  };

  if (isGameStarted) {
    const currentPlayer = players[currentPlayerIndex];
    return (
      <div className={styles.container}>
        <div className={styles.wordRevealContainer}>
          <h2 className={styles.playerTurn}>
            {t('game.gameplay.playerTurn', { name: currentPlayer.name })}
          </h2>
          
          {!isWordVisible ? (
            <Card className={styles.wordCard}>
              <Button 
                icon={<EyeOutlined />}
                onClick={handleViewWord}
                className={styles.viewButton}
              >
                {t('game.gameplay.tapToReveal')}
              </Button>
            </Card>
          ) : (
            <Card className={styles.wordCard}>
              <div className={styles.wordReveal}>
                <h3>{t('game.gameplay.yourWord')}</h3>
                <p className={styles.word}>{currentPlayer.word}</p>
              </div>
              <Button 
                type="primary"
                onClick={handleNextPlayer}
                className={styles.nextButton}
              >
                {currentPlayerIndex < players.length - 1 
                  ? t('game.gameplay.passToNext') 
                  : t('common.start')}
              </Button>
            </Card>
          )}
          
          <div className={styles.playerProgress}>
            {players.map((player, index) => (
              <div 
                key={player.id}
                className={`${styles.progressDot} ${index < currentPlayerIndex ? styles.viewed : ''} ${index === currentPlayerIndex ? styles.current : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button 
          className={styles.backButton}
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          aria-label={t('common.back')}
        />
        
        <Button 
          className={styles.configButton}
          icon={<SettingOutlined />}
          onClick={() => setIsConfigOpen(true)}
          aria-label={t('game.config')}
        />
      </div>

      <div className={styles.playerList}>
        <div className={styles.playerListScroll} ref={scrollRef}>
          {players.map(player => (
            <div 
              key={player.id} 
              className={`${styles.playerItem} ${removingId === player.id ? styles.removing : ''} ${newId === player.id ? styles.new : ''}`}
            >
              <UserOutlined className={styles.playerIcon} />
              <Input
                value={player.name}
                onChange={(e) => handleEditPlayer(player.id, e.target.value)}
                className={styles.playerInput}
                suffix={
                  <div className={styles.playerActions}>
                    <EditOutlined className={styles.actionIcon} title={t('common.edit')} />
                    <DeleteOutlined 
                      className={`${styles.actionIcon} ${players.length <= 3 ? styles.disabledIcon : ''}`} 
                      title={t('common.delete')}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (players.length > 3) {
                          handleRemovePlayer(player.id);
                        }
                      }}
                    />
                  </div>
                }
              />
            </div>
          ))}
        </div>
        <div className={styles.addPlayer}>
          <div className={styles.playerCount}>
            <UserOutlined />
            <span>{players.length}</span>
          </div>
          <Button 
            type="text" 
            className={styles.addPlayerButton}
            onClick={handleAddPlayer}
            icon={<PlusOutlined />}
            aria-label={t('game.addPlayer')}
          />
        </div>
      </div>

      <Button 
        className={styles.startButton} 
        onClick={startGame}
        loading={isLoading}
      >
        {t('common.start')}
      </Button>

      <Modal
        title={
          <div className={styles.configTitle}>
            {t('game.config')}
            <CloseOutlined onClick={() => setIsConfigOpen(false)} />
          </div>
        }
        open={isConfigOpen}
        footer={null}
        closable={false}
        className={styles.configModal}
        width={400}
        maskClosable={true}
        destroyOnClose={false}
      >
        <div className={styles.configContent}>
          <div className={styles.configItem}>
            <span>{t('game.language')}</span>
            <Select
              value={config.language}
              onChange={(value) => handleConfigChange('language', value)}
              className={styles.configSelect}
            >
              <Option value="en">English</Option>
              <Option value="vi">Vietnamese</Option>
              <Option value="zh">Chinese</Option>
            </Select>
          </div>

          <div className={styles.configItem}>
            <span>{t('game.topic')}</span>
            <Select
              value={config.topic}
              onChange={(value) => handleConfigChange('topic', value)}
              className={styles.configSelect}
            >
              <Option value="general">{t('game.topics.general')}</Option>
              <Option value="movies">{t('game.topics.movies')}</Option>
              <Option value="games">{t('game.topics.games')}</Option>
            </Select>
          </div>

          <div className={styles.configItem}>
            <span>{t('game.timeLimit')}</span>
            <Select
              value={config.timeLimit}
              onChange={(value) => handleConfigChange('timeLimit', value)}
              className={styles.configSelect}
            >
              <Option value="30">30s</Option>
              <Option value="60">60s</Option>
              <Option value="90">90s</Option>
            </Select>
          </div>

          <div className={styles.configItem}>
            <div className={styles.sliderContainer} ref={sliderRef}>
              <div className={styles.sliderInfo}>
                <span>{config.imposters} {t('game.roles.imposters')}</span>
                <span>{players.length - config.imposters} {t('game.roles.civilians')}</span>
              </div>
              <Slider
                min={1}
                max={Math.max(1, Math.floor(players.length / 2))}
                value={config.imposters}
                onChange={(value: number) => handleConfigChange('imposters', value)}
                className={styles.roleSlider}
                tooltip={{ formatter: (value) => `${value} ${t('game.roles.imposters')}` }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 