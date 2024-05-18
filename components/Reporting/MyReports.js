import { Text, View, Button } from "react-native"; // Import Button component
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { getFromApi } from "../../api/get";

export default function MyReports() {
    const [res, setRes] = useState("Loading..."); // Initial state message
    const [user, setUser] = useState({ first: "", last: "" });

    const fetchData = async () => {
        try {
            const token = await SecureStore.getItemAsync("sessionToken");
            const data = await getFromApi("private", token);
            setRes(JSON.stringify(data));
        } catch (error) {
            console.error("Error fetching data:", error);
            setRes("Error fetching data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClick = () => {
        fetchData();
    };

    return (
        <View>
            <Button title="Refresh" onPress={handleClick} />
            <Text>{res}</Text>
        </View>
    );
}
