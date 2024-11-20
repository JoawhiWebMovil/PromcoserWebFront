import { authClient } from "../boot/axios";

export const LogIn = async (credentials) => {
  try {
    const response = await authClient.post("/api/Personal/LogIn", credentials);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesion:", error);
    throw error;
  }
};
