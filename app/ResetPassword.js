import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../auth/firebase";
import colors from '../constants/Colors';
import {useNavigation} from "@react-navigation/native";

const PasswordReset = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert('Email is required');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Check email for resetting password");
        } catch (error) {
            Alert.alert(error.code);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <TextInput
                style={styles.textBox}
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('index')}>
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.main.background,
    },
    title: {
        color: colors.main.text,
        fontSize: 40,
        paddingBottom: 20,
    },
    textBox: {
        backgroundColor: 'lightgray',
        padding: 10,
        marginVertical: 5,
        width: 200,
        borderRadius: 5,
        color: '#000',
    },
    button: {
        padding: 1,
        marginVertical: 10,
        width: 200,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default PasswordReset;
