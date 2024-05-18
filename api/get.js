import axios from "axios";

export const getFromApi = async (ext, token) => {
    const headers = {
        Authorization: token,
    };
    try {
        const response = await axios.get(`https://au-rep-server.onrender.com/${ext}`, { headers });
        // const response = await axios.get(`http://localhost:3000/${ext}`, { headers });
        return response.data;
    } catch (error) {
        console.error(
            "Error on requesting the private endpoint:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};
