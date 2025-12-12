import api from "../Services/api";

export const obtenerEtapas = async () => {
  try {
    const response = await api.get(`/anticipos/obtenerEtapas/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener etapas:", error);
  }
};

export const fetchAnticipos = async () => {
  try {
    const response = await api.get("/anticipos/obtenerAnticiposByIDEmpleado");
    return response.data;
  } catch (error) {
    console.error("Error fetching anticipos:", error);
    throw error;
  }
};

export const fetchLiquidaciones = async () => {
  try {
    const response = await api.get("/anticipos/obtenerTodasLiquidaciones");
    return response.data;
  } catch (error) {
    console.error("Error fetching liquidaciones:", error);
    throw error; 
  }
};

export const fetchHistorialAnticipos = async () => {
  try {
    const response = await api.get("/anticipos/obtenerHistorialAnticipos");
    return response.data;
  } catch (error) {
    console.error("Error fetching liquidaciones:", error);
    throw error; 
  }
};

export const fetchHistorialAnticiposByEtapa = async (etapaSeleccionada) => {
  try {
    const response = await api.get(`/anticipos/obtenerHistorialAnticiposbyEtapa/${etapaSeleccionada}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching liquidaciones:", error);
    throw error;
  }
};

export const patchAnticipoAprobado = async (numeroAutorizacion, observacion) => {
  try {
    const response = await api.patch(`/anticipos/modificarEstadoAnticipo/${numeroAutorizacion}/${observacion}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching liquidaciones:", error);
    throw error; 
  }
};

export const cargarLiquidacion = async (formData) => {
  try {
    const response = await api.post("/anticipos/cargarLiquidacion"
      ,formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error al cargar la liquidación:", error);
    throw error;
  }
};