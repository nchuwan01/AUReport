import { io } from 'socket.io-client';
// export default socket = io(`http://localhost:3000`);
let socket;
export default socket = io(`https://au-rep-server.onrender.com`);