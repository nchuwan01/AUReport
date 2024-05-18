import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, Button, SafeAreaView, ScrollView, TextInput, Image} from "react-native";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import {Dropdown} from "react-native-element-dropdown";
import colors from "@/constants/Colors";
import {getFromApi} from "../../api/get";
import {useNavigation} from '@react-navigation/native';
import {getCookie} from "../../api/cookies";
import {user} from "../Messaging/saveUserData/saveUserData";
import {reportFormData as globalForm} from "./formData";
import uploadPhoto from "../Camera/uploadPhoto";

export default function ReportForm() {
    const [userId, setUserId] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false); // Track loading state


    const [reportFormData, setReportFormData] = useState({
        userId: user.userid,
        image: globalForm.image || '',
        title: globalForm.title || '',
        location: globalForm.location || null,
        locationSpec: globalForm.locationSpec || null,
        description: globalForm.description || ''
    });

    useEffect(() => {
        const getImageFromStorage = async () => {
            try {
                const fileName = await getCookie('img')
                setImageUri(fileName);
            } catch (error) {
                console.error('Error getting image from storage:', error);
            }
        };

        getImageFromStorage();
    }, []);

    useEffect(() => {
        setReportFormData(prevState => ({...prevState, userId}));
    }, [userId]);

    const updateTitle = (title) => {
        setReportFormData(prevState => ({...prevState, title}));
    };

    const updateLocation = (location) => {
        location = location.buildingname;
        setReportFormData(prevState => ({...prevState, location}));
    };

    const updateLocationSpec = (locationSpec) => {
        locationSpec = locationSpec.roomname;
        setReportFormData(prevState => ({...prevState, locationSpec}));
        console.log(reportFormData)
    };

    const updateDescription = (description) => {
        setReportFormData(prevState => ({...prevState, description}));
    };

    const submitForm = async () => {
        if (!reportFormData.title || !reportFormData.description || !reportFormData.location || !reportFormData.locationSpec) {
            alert("Title, description, and location are required fields.");
            return;
        }

        setLoading(true);
        let uploadResponse;
        if (imageUri != null){
            try {
                uploadResponse = await uploadPhoto(imageUri);
            } catch (error) {
                console.error('Error in form submission:', error);
                alert("Error occurred. Please try again.")
            } finally {
                setLoading(false);
            }
        }

        try {
            const postObject = {
                userId: user.userid || 1,
                image: uploadResponse || null,
                title: reportFormData.title || null,
                location: reportFormData.location || null,
                locationSpec: reportFormData.locationSpec || null,
                description: reportFormData.description ||null
            };
            console.log(JSON.stringify(postObject))
            // const response = await axios.post(`http://localhost:3000/createReport`, postObject);
            const response = await axios.post(`https://au-rep-server.onrender.com/createReport`, postObject);
            console.log('Response data:', response.data);
        } catch (error) {
            console.error('Error posting data:', error);
        }finally {
            setLoading(false);
        }
    };
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView>
                <View style={styles.background}>
                    <Text style={styles.topText}> Problem Title: </Text>
                    <ProblemTitleBox updateTitle={updateTitle}/>
                    <Button onPress={() => {
                        globalForm.title = reportFormData.title
                        globalForm.image = reportFormData.image
                        globalForm.description = reportFormData.description
                        globalForm.location = reportFormData.location
                        globalForm.locationSpec = reportFormData.locationSpec
                        navigation.navigate('Camera/index')
                    }
                    } title={"Add Photo"}/>
                    <View style={{alignItems: 'center'}}>
                        {imageUri && <Image source={{uri: imageUri}} height={200} style={styles.image}/>}
                    </View>
                    <Text style={styles.text}> Location: </Text>
                    <DropdownComponent updateLocation={updateLocation} updateLocationSpec={updateLocationSpec}/>
                    <Text style={styles.text}> Describe Your Problem: </Text>
                    <ProblemDescBox updateDescription={updateDescription}/>
                    <Button onPress={submitForm} title={"Submit"} disabled={loading}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const ProblemTitleBox = ({updateTitle}) => {
    const [title, setTitle] = useState(globalForm.title || null);
    const handleTitleChange = (title) => {
        setTitle(title);
        updateTitle(title);
    };
    return (
        <SafeAreaView>
            <TextInput
                style={titleStyles.input}
                onChangeText={handleTitleChange}
                value={title}
            />
        </SafeAreaView>
    );
};

const DropdownComponent = ({updateLocation, updateLocationSpec}) => {

    const [locationData, setLocationData] = useState([]);
    const [locationValue, setLocationValue] = useState(globalForm.location || null);
    const [locationSpecifics, setLocationSpecifics] = useState([]);
    const [locationSpecValue, setLocationSpecValue] = useState(globalForm.locationSpec || null);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await getFromApi("getLocations", {});
                setLocationData(response);
            } catch (error) {
                console.error("Error fetching location data:", error);
            }
        };
        fetchLocationData();
    }, []);

    const fetchBuildingData = async (location) => {
        try {
            const response = await getFromApi(`getRooms/${location.buildingid}`, {});
            setLocationSpecifics(response);
        } catch (error) {
            console.error("Error fetching location specifics:", error);
        }
    };

    const handleLocationChange = (location) => {
        setLocationValue(location);
        updateLocation(location);
        setIsFocus(false);
        handleLocationSpecChange("")
        fetchBuildingData(location);
    };

    const handleLocationSpecChange = (locationSpec) => {
        setLocationSpecValue(locationSpec);
        updateLocationSpec(locationSpec);
        setIsFocus(false);
    };

    return (
        <View style={locationStyles.container}>
            <View style={{backgroundColor: "#fff"}}>
                <Dropdown
                    style={[locationStyles.dropdown, isFocus && {borderColor: "blue"}]}
                    placeholderStyle={locationStyles.placeholderStyle}
                    selectedTextStyle={locationStyles.selectedTextStyle}
                    inputSearchStyle={locationStyles.inputSearchStyle}
                    iconStyle={locationStyles.iconStyle}
                    data={locationData}
                    search
                    maxHeight={300}
                    labelField="buildingname"
                    valueField="buildingname"
                    placeholder={!isFocus ? "Select Building, Outside or Other" : "..."}
                    searchPlaceholder="Search"
                    value={locationValue}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={handleLocationChange}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={locationStyles.icon}
                            color={isFocus ? "blue" : "black"}
                            name="Safety"
                            size={20}
                        />
                    )}
                />
                <Dropdown
                    style={[locationStyles.dropdown, isFocus && {borderColor: "blue"}]}
                    placeholderStyle={locationStyles.placeholderStyle}
                    selectedTextStyle={locationStyles.selectedTextStyle}
                    inputSearchStyle={locationStyles.inputSearchStyle}
                    iconStyle={locationStyles.iconStyle}
                    data={locationSpecifics}
                    search
                    maxHeight={300}
                    labelField="roomname"
                    valueField="roomname"
                    placeholder={!isFocus ? "Select Room, Nearest room or Parking lot" : "..."}
                    searchPlaceholder="Search"
                    value={locationSpecValue}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={handleLocationSpecChange}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={styles.icon}
                            color={isFocus ? "blue" : "black"}
                            name="Safety"
                            size={20}
                        />
                    )}
                />
            </View>
        </View>
    );
};
const ProblemDescBox = ({updateDescription}) => {
    const [text, onChangeText] = useState(globalForm.description || null);

    const handleDescChange = (text) => {
        onChangeText(text);
        updateDescription(text);
    };

    return (
        <SafeAreaView>
            <TextInput
                style={descStyles.input}
                onChangeText={handleDescChange}
                value={text}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: colors.main.background,
        flex: 1,
    },
    image: {
        alignContent: "center",
        width: 100
    },
    title: {
        fontSize: 40,
        color: '#ffffff',
        marginBottom: 20,
        paddingBottom: 20,
        paddingTop: 20,

    },
    text: {
        fontSize: 25,
        padding: 5,
        color: '#ffffff',
    },
    topText: {
        fontSize: 25,
        paddingTop: 50,
        color: '#ffffff',
    }
});

const titleStyles = StyleSheet.create({
    input: { //title text box
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#fff',
    }
});

const locationStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        margin: 12,

    },
    dropdown: {
        height: 50,
        borderColor: 'black',
        borderWidth: 0.5,
        paddingHorizontal: 8,
        marginBottom: 2,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    }
});

const descStyles = StyleSheet.create({
    input: {
        height: 100,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
});

