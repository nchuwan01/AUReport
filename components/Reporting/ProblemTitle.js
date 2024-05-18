import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';

const ProblemTitleBox = () => {
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
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
});

export default ProblemTitleBox;