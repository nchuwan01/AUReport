import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {DeviceCam} from "../../components/Camera/DeviceCam";

export default function Home() {
    return (
        <DeviceCam/>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "-15%",
        marginBottom: "-5%",
    },
});
