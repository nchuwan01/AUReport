import { View, Modal, Image, Button, StyleSheet } from 'react-native';

const PhotoModal = ({ photoUri, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={!!photoUri}
            onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: photoUri }} style={styles.image} />
                </View>
                <Button title="Close" onPress={onClose} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default PhotoModal;
