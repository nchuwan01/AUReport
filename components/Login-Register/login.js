import React, { useState } from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert, ActivityIndicator, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/auth/firebase";
import colors from "@/constants/Colors";
import { setCookie } from "@/api/cookies";
import {getUserData} from "./../Messaging/saveUserData/saveUserData";
import PasswordReset from "@/components/PasswordReset/PasswordReset";

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const trySignIn = async () => {
        try {
            let userCredential = await signInWithEmailAndPassword(auth, email, password);
            const sessionToken = userCredential._tokenResponse['idToken']
            console.log(userCredential._tokenResponse)
            await setCookie("sessionToken", sessionToken);
            await getUserData(email)
            return true;
        } catch (error) {
            console.error('Error signing in:', error.message);
            return false;
        }
    };

    const handleLogin = async () => {
        if (email !== '' && password !== '') {
            setLoading(true);
            const success = await trySignIn();
            setLoading(false);
            if (success) {
                await getUserData(email);
                navigation.navigate('Home')
            } else {
                Alert.alert('Login Failed', 'Invalid email or password.');
            }
        } else {
            Alert.alert('Login Failed', 'Please enter valid email and password.');
        }
    };

    const handleReset = async () => {
        // try {
        //     alert()
        //     await firebase.auth.sendPasswordResetEmail(auth, email);
        //     Alert.alert("YAY!")
        // } catch (error) {
        //     Alert.alert(error.message)
        // }
        return(
            <PasswordReset/>
        )
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://alumni.aurora.edu/s/1512/images/editor/logos/22/au_primary-rgb-white_green.png' }}
                style={{ width: "90%", height: 100 }}
                accessibilityLabel="Aurora University Logo"
            />
            <Text style={{color: 'white' ,fontSize:30, marginBottom: 50}}>Report A Problem</Text>
            <TextInput
                style={styles.textBox}
                placeholder="Email"
                placeholderTextColor="gray"
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.textBox}
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => {
                navigation.navigate('Register')
            }} />
            <Button title="Bypass to app" onPress={() => {
                navigation.navigate('Home')
            }} />
            <Button title="Password Reset" onPress={
                ()=>navigation.navigate('ResetPassword')
            } />
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

export default Login;
