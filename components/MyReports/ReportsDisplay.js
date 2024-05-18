import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, Modal, Button } from 'react-native';
import { TouchableOpacity } from 'react-native';

const ReportsDisplay = ({ date, title, status, image, building, room, notes, updated }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const colorData = getStatusColor(status);

    function getStatusColor(status) {
        switch (status) {
            case 'complete':
                return 'green';
            case 'pending':
                return '#6eadb9';
            case 'referred':
                return 'purple';
            case 'open':
                return 'orange';
            default:
                return 'yellow';
        }
    }

    function formatDate(timestampString) {
        const date = new Date(timestampString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    const defaultAvatar = `https://ui-avatars.com/api/?name=${building + room}?&color=076d`;

    return (
        <View style={styles.container}>
            {image &&
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                        source={{ uri: image || null }}
                        style={styles.image}
                    />
                </TouchableOpacity>
            }
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.location}>Building: {building}</Text>
            <Text style={styles.location}>Room: {room}</Text>
            {notes && Array.isArray(notes) && notes[0] != null ? (
                <>
                    <Text style={styles.location}>Notes: </Text>
                    {notes.filter(item => item !== null).map((item, index) => (
                        <Text key={index} style={styles.noteItem}>{item}</Text>
                    ))}
                </>
            ) : null}


            <Text style={{ color: colorData }}>Status: {status}</Text>
            <View>
                <Text style={{ color: 'grey', fontSize:9 }}>Created: {formatDate(date)}</Text>
                <Text style={{ color: 'grey', fontSize:9 }}>Last Updated: {formatDate(updated)}</Text>
            </View>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Image
                        source={{ uri: image || defaultAvatar }}
                        style={styles.modalImage}
                    />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems:"center"
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10
    },
    location: {
        fontSize: 16,
        marginBottom: 3,
    },
    status: {
        fontSize: 16,
    },
    image: {
        width: 225,
        height: 300,
        resizeMode: 'cover',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    modalImage: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
    },
});

export default ReportsDisplay;
