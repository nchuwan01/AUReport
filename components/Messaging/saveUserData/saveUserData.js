import { setCookie } from "@/api/cookies";
import axios from "axios";

let user = {
    userid: null,
    first: null,
    last: null,
    email: null
};

const getUserData = async (userEmail) => {
    try {
        const response = await axios.post(`https://au-rep-server.onrender.com/getUserInfo`, { email: userEmail });
        // const response = await axios.post(`http://localhost:3000/getUserInfo`, { email: userEmail });
        const userData = response.data;

        if (Object.keys(userData).length > 0) {
            // Update user object with retrieved data
            user.userid = userData.userid.toString();
            user.first = userData.firstname;
            user.last = userData.lastname;
            user.email = userEmail;

            // Set cookies

            await setCookie("userid", user.userid);
            await setCookie("first", user.first);
            await setCookie("last", user.last);
            await setCookie("email", user.email);
            await setCookie("img", "");

            console.log("User data retrieved successfully:", user);
        } else {
            console.log("User not found.");
        }

        // Return user data
        return userData;
    } catch (error) {
        console.error('Error getting user data:', error.message);
        return null;
    }
};

export { getUserData, user };

