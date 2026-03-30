import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { userService, gameService } from '../services/api';

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await userService.getProfile();
            setProfile(response.data);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const startGame = async (mode) => {
        try {
            setLoading(true);
            const response = await gameService.createGame(mode);
            navigation.navigate('Game', { gameId: response.data.id, mode });
        } catch (error) {
            console.error('Error starting game:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bulls & Cows</Text>
            <Text style={styles.welcome}>Welcome, {user?.username}!</Text>

            {profile && (
                <View style={styles.statsContainer}>
                    <Text style={styles.statsTitle}>Your Stats</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{profile.total_games}</Text>
                            <Text style={styles.statLabel}>Games</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{profile.wins}</Text>
                            <Text style={styles.statLabel}>Wins</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{profile.best_score || '-'}</Text>
                            <Text style={styles.statLabel}>Best</Text>
                        </View>
                    </View>
                </View>
            )}

            <Text style={styles.sectionTitle}>Start a Game</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => startGame('vs_ai')}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Text style={styles.buttonText}>🤖 Play vs AI</Text>
                        <Text style={styles.buttonSubtext}>Guess the AI's number</Text>
                    </>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => startGame('vs_player')}
                disabled={loading}>
                <Text style={styles.buttonText}>👥 Play vs Player</Text>
                <Text style={styles.buttonSubtext}>Coming soon</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.leaderboardButton}
                onPress={() => navigation.navigate('Leaderboard')}>
                <Text style={styles.leaderboardText}>🏆 Leaderboard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 4,
        color: '#333',
    },
    welcome: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 24,
    },
    statsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    buttonSecondary: {
        backgroundColor: '#2196F3',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonSubtext: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 4,
    },
    leaderboardButton: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#4CAF50',
        alignItems: 'center',
    },
    leaderboardText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        color: '#999',
        fontSize: 14,
    },
});

export default HomeScreen;