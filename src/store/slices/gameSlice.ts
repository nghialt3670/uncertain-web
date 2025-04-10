import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Player {
  id: number;
  name: string;
  word?: string;
  hasViewed?: boolean;
}

interface GameState {
  players: Player[];
  gameWords: {
    civilian: string;
    imposter: string;
  } | null;
  currentPlayerIndex: number;
  isWordVisible: boolean;
  config: {
    language: string;
    topic: string;
    timeLimit: string;
    imposters: number;
  };
}

const initialState: GameState = {
  players: [
    { id: 1, name: 'Player1' },
    { id: 2, name: 'Player2' },
    { id: 3, name: 'Player3' }
  ],
  gameWords: null,
  currentPlayerIndex: 0,
  isWordVisible: false,
  config: {
    language: 'en',
    topic: 'general',
    timeLimit: '60',
    imposters: 1
  }
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    setGameWords: (state, action: PayloadAction<{ civilian: string; imposter: string }>) => {
      state.gameWords = action.payload;
    },
    setCurrentPlayerIndex: (state, action: PayloadAction<number>) => {
      state.currentPlayerIndex = action.payload;
    },
    setIsWordVisible: (state, action: PayloadAction<boolean>) => {
      state.isWordVisible = action.payload;
    },
    setConfig: (state, action: PayloadAction<GameState['config']>) => {
      state.config = action.payload;
    },
    markPlayerAsViewed: (state, action: PayloadAction<number>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player) {
        player.hasViewed = true;
      }
    },
    resetGame: () => initialState
  }
});

export const {
  setPlayers,
  setGameWords,
  setCurrentPlayerIndex,
  setIsWordVisible,
  setConfig,
  markPlayerAsViewed,
  resetGame
} = gameSlice.actions;

export default gameSlice.reducer; 