import { apiClient } from "../../boot/axios";

export async function getInfo(nombre, apellido) {
  try {
    const response = await apiClient.post("/maquinaria/info", {
      nombre,
      apellido,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener información de la maquinaria:", error);
    throw error;
  }
}

export const getAllMaquinas = async () => {
  try {
    const response = await apiClient.get("/maquinarias");
    return response.data;
  } catch (error) {
    console.error("Error al obtener la información de las maquinas:", error);
    throw error;
  }
};
