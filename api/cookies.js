import * as SecureStore from 'expo-secure-store';

export const setCookie = async (key, value) => {
    try {
        await SecureStore.setItemAsync(key, value);
        console.log('Cookie set successfully: ', value);
    } catch (error) {
        console.log(`Error setting cookie: ${key} `, error);
    }
}

export const getCookie = async (key) => {
    try {
        const value = await SecureStore.getItemAsync(key);
        if (value) {
            return value;
        } else {
            console.log('Cookie not found: ', value);
            return null;
        }
    } catch (error) {
        console.log('Error getting cookie:', error);
        return null;
    }
}