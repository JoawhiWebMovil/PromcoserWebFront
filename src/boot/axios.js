import { boot } from "quasar/wrappers";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5159",
  timeout: 3000,
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { apiClient };
