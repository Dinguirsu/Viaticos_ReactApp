import api from "../Services/api";

export const obtenerCodigoLiquidacion = async () => {
  try {
    const response = await api.get(`/anticipos/obtenerCodigoLiquidacion`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener etapas:", error);
  }
};