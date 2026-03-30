import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

export const gameService = {
    createGame: (mode, difficulty, playerSecretNumber) => api.post('/games', {
        mode,
        difficulty,
        player_secret_number: playerSecretNumber,
    }),
    makeGuess: (gameId, number) => api.post(`/games/${gameId}/guess`, { number }),
};

export const leaderboardService = {
    getLeaderboard: () => api.get('/leaderboard'),
};

export const userService = {
    getProfile: () => api.get('/profile'),
};

export default api;