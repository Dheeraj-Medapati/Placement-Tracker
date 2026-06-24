import axios from "axios";

const api = axios.create({
    baseURL: "https://placement-tracker-backend-g1c4.onrender.com"
});

export default api;