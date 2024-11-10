import { boot } from "quasar/wrappers";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 1000,
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { apiClient };
