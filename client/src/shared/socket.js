import { io } from "socket.io-client";
const ENDPOINT = 'http://localhost:4000/classic';
export default io(ENDPOINT);