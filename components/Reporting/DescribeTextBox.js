import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';

const ProblemDescBox = () => {
    const [text, onChangeText] = useState('');

    return (
        <SafeAreaView>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 100,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
});

export default ProblemDescBox;