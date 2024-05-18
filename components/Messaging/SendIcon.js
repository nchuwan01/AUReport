import React, { useState } from 'react';
import { StyleSheet, View, TextInput, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import socket from './Socket/socket';
import { user } from './saveUserData/saveUserData'; // Import user object

const SendIcon = () => {
    const [message, setMessage] = useState("");

    async function sendClicked() {
        if (message.length > 0) {

            socket.emit("message", {
                message: message,
                firstName: user.first, // Access user's first name
                lastName: user.last, // Access user's last name
                email: user.email, // Access user's email
                userid: user.userid, // Access user's ID
                postedTime: new Date(new Date()).toLocaleString("en-US", { timeZone: "America/Chicago" })
            });

            // axios.post(`http://localhost:3000/messaging/postMessages`, {
            axios.post(`https://au-rep-server.onrender.com/messaging/postMessages`, {
                message: message,
                userid: user.userid, // Access user's ID
                postedTime: new Date(new Date()).toLocaleString("en-US", { timeZone: "America/Chicago" })
            })
                .then(response => {
                    console.log("This is the response " + response);
                    // If you have a scrollViewRef defined, uncomment the line below
                    // this.scrollViewRef.current.scrollToEnd({ animated: true });
                })
                .catch(error => {
                    console.log("it's going into the error lane!");
                    console.error('Error posting data:', error);

                });
            setMessage("");
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TextInput
                    maxLength={200}
                    style={styles.input}
                    placeholder="Type something..."
                    placeholderTextColor="grey"
                    onChangeText={newMessage => setMessage(newMessage)}
                    defaultValue={message}
                    required
                />
                <MaterialIcons name="send" size={24} color="black" onPress={sendClicked} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: 5,
        borderRadius: 25,
        paddingHorizontal: 10,
        backgroundColor: "white"
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: 'black',
    },
});

export default SendIcon;
