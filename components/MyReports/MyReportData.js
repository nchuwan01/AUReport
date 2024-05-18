import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ReportsDisplay from './ReportsDisplay';
import axios from "axios";
import {getCookie} from "../../api/cookies";

const MyReportData = () => {
    const [selectedValue, setSelectedValue] = useState('open');
    const [reportData, setReportsData] = useState([{}]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = await getCookie('userid');
                const response = await axios.get(`https://au-rep-server.onrender.com/getReports/${userId}/${selectedValue}`);
                // const response = await axios.get(`http://localhost:3000/getReports/${userId}/${selectedValue}`);
                setReportsData(response.data.reverse());
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };
        const intervalId = setInterval(fetchData, 5000);
        fetchData();
        return () => clearInterval(intervalId);
    }, [selectedValue]);

    return (
        <SafeAreaView style={styles.scrollViewTag}>
            <Picker style={styles.picker}
                    selectedValue={selectedValue}
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                <Picker.Item label="Pending" value="pending"/>
                <Picker.Item label="Open" value="open"/>
                <Picker.Item label="Complete" value="complete"/>
                <Picker.Item label="Referred" value="referred"/>
            </Picker>
            <ScrollView>
                {
                    reportData.length > 0 ? (
                        reportData.map(data => {
                            console.log(JSON.stringify(data))
                            if (data.title) {
                                const locationObject = data.location
                                const building = locationObject[0]
                                const room = locationObject[1]
                                return (
                                    <View key={data.reportid}>
                                        <ReportsDisplay date={data.timestamp} updated={data.updated_at} title={data.title} building={building} room={room} image={data.image} status={data.status} notes={data.notes}/>
                                    </View>
                                );
                            }
                            return null;
                        })
                    ) : (
                        <View>
                            <Text style={{textAlign: 'center', paddingTop: 100}}>
                                No {selectedValue} reports found
                            </Text>
                        </View>
                    )
                }

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollViewTag: {
        marginBottom: '50%',
        marginLeft: 30,
        marginRight: 30
    },

    picker: {
        marginTop: -50,
        height: 200
    }

})

export default MyReportData;