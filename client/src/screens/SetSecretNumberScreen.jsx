import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { gameService } from '../services/api';

const SetSecretNumberScreen = ({ route, navigation }) => {
    const { mode, difficulty } = route.params;
    const [secretNumber, setSecretNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        if (secretNumber.length !== 4) {
            Alert.alert('Error', 'Please enter a 4 digit number');
            return;
        }

        const digits = secretNumber.split('');
        if (new Set(digits).size !== 4) {
            Alert.alert('Error', 'All digits must be unique');
            return;
        }

        if (digits.includes('0')) {
            Alert.alert('Error', 'Digits must be between 1-9');
            return;
        }

        try {
            setLoading(true);
            const response = await gameService.createGame(mode, difficulty, secretNumber);
            navigation.replace('Game', {
                gameId: response.data.id,
                mode,
                difficulty,
            });
        } catch (error) {
            Alert.alert('Error', 'Could not start game');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Secret Number</Text>
            <Text style={styles.subtitle}>
                Enter a 4 digit number for the AI to guess.{'\n'}
                All digits must be unique and between 1-9.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="e.g. 1234"
                value={secretNumber}
                onChangeText={setSecretNumber}
                keyboardType="number-pad"
                maxLength={4}
            />

            <Text style={styles.difficulty}>Difficulty: {difficulty}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleStart}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Start Game!</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        color: '#333',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        color: '#666',
        marginBottom: 32,
        lineHeight: 22,
    },
    input: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        fontSize: 32,
        textAlign: 'center',
        letterSpacing: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    difficulty: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginBottom: 24,
        textTransform: 'capitalize',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SetSecretNumberScreen;