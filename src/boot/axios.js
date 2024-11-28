import { boot } from "quasar/wrappers";
import axios from "axios";

const baseuUrl = "http://localhost:5159";
// const baseuUrl = "https://ff11-38-25-17-64.ngrok-free.app/"; Tunel actual
//http://localhost/5159

const apiClient = axios.create({
  baseURL: baseuUrl,
  timeout: 1000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

//Manejar los request y ponerle la autorización
apiClient.interceptors.request.use((config) => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const token = JSON.parse(userData).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

//Manejar los response y ponerle la autorización
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Se terminó el tiempo de sesión");
      console.error("El token ha expirado o no es válido.");
      localStorage.removeItem("userData");
      window.location.href = "";
    }
    return Promise.reject(error);
  }
);

const authClient = axios.create({
  baseURL: baseuUrl,
  timeout: 1000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { apiClient, authClient };
