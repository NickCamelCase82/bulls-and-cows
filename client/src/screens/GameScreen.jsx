import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';
import { gameService } from '../services/api';

const GameScreen = ({ route, navigation }) => {
    const { gameId } = route.params;
    const [guess, setGuess] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [attemptsLeft, setAttemptsLeft] = useState(10);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGuess = async () => {
        if (guess.length !== 4) {
            Alert.alert('Error', 'Please enter a 4 digit number');
            return;
        }

        try {
            setLoading(true);
            const response = await gameService.makeGuess(gameId, guess);
            const { bulls, cows, attempts_left, result, secret_number } = response.data;

            setGuesses(prev => [{
                number: guess,
                bulls,
                cows,
            }, ...prev]);

            setGuess('');

            if (result === 'win') {
                setGameOver(true);
                Alert.alert('🎉 You Won!', `You guessed the number in ${10 - attempts_left + 1} attempts!`, [
                    { text: 'Play Again', onPress: () => navigation.replace('Home') }
                ]);
            } else if (result === 'loss') {
                setGameOver(true);
                Alert.alert('😞 Game Over', `The secret number was ${secret_number}`, [
                    { text: 'Play Again', onPress: () => navigation.replace('Home') }
                ]);
            } else {
                setAttemptsLeft(attempts_left);
            }
        } catch (error) {
            Alert.alert('Error', 'Invalid guess — make sure all digits are unique and between 1-9');
        } finally {
            setLoading(false);
        }
    };

    const renderGuess = ({ item }) => (
        <View style={styles.guessRow}>
            <Text style={styles.guessNumber}>{item.number}</Text>
            <View style={styles.guessResult}>
                <Text style={styles.bulls}>🐂 {item.bulls}</Text>
                <Text style={styles.cows}>🐄 {item.cows}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.attempts}>Attempts left: {attemptsLeft}</Text>
                <Text style={styles.hint}>Guess the 4 digit number</Text>
                <Text style={styles.hint}>🐂 Bull = right digit, right position</Text>
                <Text style={styles.hint}>🐄 Cow = right digit, wrong position</Text>
            </View>

            {!gameOver && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter 4 digits"
                        value={guess}
                        onChangeText={setGuess}
                        keyboardType="number-pad"
                        maxLength={4}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleGuess}
                        disabled={loading}>
                        <Text style={styles.buttonText}>Guess!</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={guesses}
                renderItem={renderGuess}
                keyExtractor={(item, index) => index.toString()}
                style={styles.guessList}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No guesses yet — make your first guess!</Text>
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
    header: {
        marginBottom: 24,
    },
    attempts: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    hint: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        fontSize: 24,
        textAlign: 'center',
        letterSpacing: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    guessList: {
        flex: 1,
    },
    guessRow: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    guessNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 4,
        color: '#333',
    },
    guessResult: {
        flexDirection: 'row',
        gap: 16,
    },
    bulls: {
        fontSize: 18,
        color: '#4CAF50',
    },
    cows: {
        fontSize: 18,
        color: '#FF9800',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 40,
        fontSize: 14,
    },
});

export default GameScreen;