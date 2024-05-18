import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, ScrollView, View, SafeAreaView} from 'react-native';
import SendIcon from "./SendIcon";
import CircleWithText from './PublicChat';
import MyChat from './PersonalChat';
import socket from './Socket/socket';
import {getFromApi} from "../../api/get";
import {user} from "./saveUserData/saveUserData";

const MainMessage = () => {
    const [dataResponse, setDataResponse] = useState([]);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getFromApi("messaging/getMessages", {});
                setDataResponse(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handleSocketData = (msg) => {
            setDataResponse(prevData => [...prevData, {
                clientid: user.userid,
                message: msg.message,
                firstname: msg.firstName,
                userid: msg.userid,
                lastname: msg.lastName,
                timeposted: msg.postedTime
            }]);
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({animated: true});
            }, 100);
        };
        socket.on("data", handleSocketData);
        return () => {
            socket.off("data", handleSocketData);
        };
    }, []);

    return (
        <SafeAreaView style={styles.safeView}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={styles.mainBox}>
                    {dataResponse.map(data => {
                        if (data.message) {
                            if (data.userid === user.userid) {
                                return (
                                    <View style={styles.chatBox} key={data.messageid}>
                                        <MyChat
                                            message={data.message}
                                            firstname={data.firstname}
                                            lastname={data.lastname}
                                            timeposted={data.timeposted}
                                        />
                                    </View>
                                );
                            } else {
                                return (
                                    <View style={styles.chatBox} key={data.messageid}>
                                        <CircleWithText
                                            message={data.message}
                                            firstname={data.firstname}
                                            lastname={data.lastname}
                                            timeposted={data.timeposted}
                                        />
                                    </View>
                                );
                            }
                        }
                        return null;
                    })}
                </View>
            </ScrollView>
            <View style={styles.checkIcon}>
                <SendIcon/>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeView: {
        flex: 1
    },
    scrollContainer: {
        paddingBottom: 50
    },
    mainBox: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    chatBox: {
        width: "100%",
        padding: 5,
        borderRadius: 8,
        marginBottom: 10
    },
    checkIcon: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0
    },
});

export default MainMessage;