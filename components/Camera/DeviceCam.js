import {Camera} from "expo-camera";
import React, {useEffect, useRef, useState} from "react";
import {Text, View, StyleSheet, Button, Platform, Image, Alert} from "react-native";
import * as FileSystem from 'expo-file-system';
import {setCookie} from "../../api/cookies";
import {useNavigation} from "@react-navigation/native";

export const DeviceCam = () => {
    const [hasCameraPerm, setHasCameraPerm] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasCameraPerm(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = {quality: 0.5, base64: true};
            const data = await cameraRef.current.takePictureAsync(options);
            setImage(data.uri);
            await savePhoto(data.uri)
        }
    };

    const savePhoto = async (uri) => {
        const fileName = uri.split('/').pop();
        const newPath = FileSystem.cacheDirectory + fileName;
        await setCookie("img", newPath)
        try {
            await FileSystem.copyAsync({from: uri, to: newPath});
            // Alert.alert('Success', 'Photo saved to cache');
        } catch (error) {
            console.error('Error saving photo:', error);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    if (hasCameraPerm === null) {
        return <View><Text>Requesting camera permission...</Text></View>;
    }
    if (hasCameraPerm === false) {
        return <View><Text>No access to camera</Text></View>;
    }

    const nav = useNavigation();

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={type}
                flashMode={flash}
                ref={cameraRef}
            >
                <View style={styles.buttonContainer}>
                    <Button
                        title="Flip"
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}
                    />
                    <Button
                        title="Flash"
                        onPress={() => {
                            setFlash(
                                flash === Camera.Constants.FlashMode.off
                                    ? Camera.Constants.FlashMode.on
                                    : Camera.Constants.FlashMode.off
                            );
                        }}
                    />
                </View>
            </Camera>
            {image && <Image source={{uri: image}} style={styles.image}/>}
            <View style={styles.bottomButtonContainer}>
                <Button
                    title="Take Photo"
                    onPress={takePicture}
                />
                {image ? <Button title="Use Photo" onPress={() => {nav.goBack()}}/> : ""}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
        alignSelf: 'center',
    },
    bottomButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
});
