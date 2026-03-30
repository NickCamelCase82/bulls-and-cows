import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { leaderboardService } from '../services/api';

const LeaderboardScreen = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const response = await leaderboardService.getLeaderboard();
            setLeaderboard(response.data);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.row}>
            <Text style={styles.rank}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </Text>
            <Text style={styles.username}>{item.username}</Text>
            <View style={styles.stats}>
                <Text style={styles.wins}>{item.wins} wins</Text>
                <Text style={styles.best}>Best: {item.best_score}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏆 Leaderboard</Text>
            <FlatList
                data={leaderboard}
                renderItem={renderItem}
                keyExtractor={(item) => item.username}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No games played yet!</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#333',
    },
    row: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    rank: {
        fontSize: 20,
        width: 40,
    },
    username: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    stats: {
        alignItems: 'flex-end',
    },
    wins: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    best: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 40,
        fontSize: 14,
    },
});

export default LeaderboardScreen;