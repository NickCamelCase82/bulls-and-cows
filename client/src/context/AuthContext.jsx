import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('user');
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading stored user:', error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (data) => {
        const response = await authService.register(data);
        const { token, user } = response.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return response;
    };

    const login = async (data) => {
        const response = await authService.login(data);
        const { token, user } = response.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return response;
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);