import * as React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ReportForm from "../components/Reporting/ReportForm";
import MainMessage from "../components/Messaging/MainMessage";
import {StyleSheet, KeyboardAvoidingView, Platform} from "react-native";
import MyReportData from "../components/MyReports/MyReportData";

const Tab = createBottomTabNavigator();
export default function Home() {
    //maybe modal
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
        >
            <Tab.Navigator initialRouteName="New Report">
                <Tab.Screen name="Messaging" component={MainMessage} />
                <Tab.Screen name="New Report" component={ReportForm} />
                <Tab.Screen name="My Reports" component={MyReportData} />
            </Tab.Navigator>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: -50,
        marginBottom: -30,
        flex: 1,
    },
});
