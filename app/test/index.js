import * as React from "react";
import {StyleSheet, Text, View} from "react-native";

export default function Home() {
    return (
        <View style={styles.container}>
            <Text>WORKING</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "-15%",
        marginBottom: "-5%",
    },
});
