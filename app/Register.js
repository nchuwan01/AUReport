import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../auth/firebase';
import colors from '../constants/Colors';
import axios from "axios";
import { getUserData } from "../components/Messaging/saveUserData/saveUserData";
import { isAuEmail } from "../components/Login-Register/userEmailFilter";
import { setCookie } from "../api/cookies";

const Register = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [registration, setRegistration] = useState({
        email: null,
        password: null,
        confirmPassword: null,
        fName: null,
        lName: null
    });

    const handleInputChange = (field, value) => {
        setRegistration(prevState => ({ ...prevState, [field]: value }));
        setError(null);
    };

    const handleRegister = async () => {
        const { email, password, confirmPassword, fName, lName } = registration;
        const registrationErrors = [];

        if (!isAuEmail(email)) {
            registrationErrors.push("Invalid Email: must be an Aurora.edu authorized email.");
        }
        if (!email || !password || !confirmPassword || !fName || !lName) {
            registrationErrors.push("All fields are required.");
        }
        if (password !== confirmPassword) {
            registrationErrors.push("Passwords do not match.");
        }

        if (registrationErrors.length > 0) {
            Alert.alert("Registration Failed", registrationErrors.join("\n"));
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const sessionToken = userCredential._tokenResponse['idToken']
            await setCookie("sessionToken", sessionToken);
            const apiUrl = `https://au-rep-server.onrender.com/register`;
            const response = await axios.post(apiUrl, { ...registration, token: sessionToken });
            console.log(response);
            await getUserData(email);
            console.log('User registered successfully');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error registering user:', error.message);
            Alert.alert('Registration Failed', error.message);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.textBox}
                placeholder="AU Email"
                placeholderTextColor="gray"
                onChangeText={(text) => handleInputChange('email', text)}
            />
            <TextInput
                style={styles.textBox}
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry
                onChangeText={(text) => handleInputChange('password', text)}
            />
            <TextInput
                style={styles.textBox}
                placeholder="Confirm Password"
                placeholderTextColor="gray"
                secureTextEntry
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
            />
            <TextInput
                style={styles.textBox}
                placeholder="First Name"
                placeholderTextColor="gray"
                onChangeText={(text) => handleInputChange('fName', text)}
            />
            <TextInput
                style={styles.textBox}
                placeholder="Last Name"
                placeholderTextColor="gray"
                onChangeText={(text) => handleInputChange('lName', text)}
            />
            <Button title="Register" onPress={handleRegister} disabled={loading} />
            <Button title="Back to Login" onPress={() => navigation.navigate('index')} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    );
};

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
        paddingBottom: 50,
    },
    textBox: {
        backgroundColor: 'lightgray',
        padding: 10,
        margin: 5,
        width: 200,
        borderRadius: 5,
        color: '#000',
    },
});

export default Register;
