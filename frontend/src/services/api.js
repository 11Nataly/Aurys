import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, //backend corre aquí # Todo ese archivo realizado por douglas   
  headers: {
    "Content-Type": "application/json",
  
  },
});

export default api;