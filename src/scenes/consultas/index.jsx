import '../consultas/style.css';
import React, { useState } from 'react';
import axios from "axios";
import { obtenerEtapas } from '../../login/Services/anticiposService';
import api from '../../login/Services/api';


const Consultas = () => {

    const [etapas, setEtapas] = useState([]); // Estado para guardar las etapas
    const [selectedEtapa, setSelectedEtapa] = useState(""); // Estado para la etapa seleccionada
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDateInput, setShowDateInput] = useState(false);
    const [anticipos, setAnticipos] = useState([]);
    const [liquidaciones, setliquidaciones] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [filtroActivo, setFiltroActivo] = useState("");  
    const [tipoFiltroActivo, setTipoFiltroActivo] = useState("");  
    const [tipoFiltro, setTipoFiltro] = useState("anticipos");

    const fetchEtapas = async () => {
        try {
          const response = await api.get(
            `/anticipos/obtenerEtapas` // Ajusta tu endpoint
          );
          setEtapas(response.data); // Guardamos las etapas en el estado
          setError(null);
        } catch (error) {
          console.error("Error al obtener etapas:", error);
          setError("No se pudieron cargar las etapas.");
        }
    };

    const fetchEtapasLiquidacion = async () => {
      try {
        const response = await api.get(
          `/anticipos/obtenerEtapasLiquidacion/` // Ajusta tu endpoint
        );
        setEtapas(response.data); // Guardamos las etapas en el estado
        setError(null);
      } catch (error) {
        console.error("Error al obtener etapas:", error);
        setError("No se pudieron cargar las etapas.");
      }
    };

    const handleChange = (event) => {
        setSelectedEtapa(event.target.value);
    };

    const fetchAllAnticipos = async () => {
        try {
            const response = await api.get(
            `/anticipos/obtenerAnticiposByIDEmpleado` 
          );
          setAnticipos(response.data); 
          setError(null);
        } catch (error) {
          console.error("Error al obtener etapas:", error);
          setError("No se pudieron cargar las etapas.");
        }
    };

    const fetchAllLiquidaciones = async () => {
        try {
            const SistemaUsuario = 'eduardo.rosales';
            const response = await api.get(
            `/anticipos/obtenerAnticipoParaLiquidar` 
          );
          console.log(response.data);
          setliquidaciones(response.data); 
          setError(null);
        } catch (error) {
          console.error("Error al obtener etapas:", error);
          setError("No se pudieron cargar las etapas.");
        }
    };
    
    const handleBuscarClick = async () => {
        fetchEtapas(); 
        //await obtenerEtapas();
        setShowDropdown(true); 
        setFiltroActivo("etapas");
        setTipoFiltroActivo("anticipo");
    };

    const handleBuscarClickLiquidacion = () => {
      fetchEtapasLiquidacion(); 
      setShowDropdown(true); 
      setFiltroActivo("etapas");
      setTipoFiltroActivo("liquidacion");
    };

    const fetchAnticipos = async (etapaSeleccionada) => {
        const sistemaUsuario = "ADMIN";
        try {
            const response = await api.get(
                `/anticipos/obtenerAnticipoEtapas/${etapaSeleccionada}`
            );

          setAnticipos(response.data);
          setError(null);
        } catch (error) {
          console.error("Error al obtener anticipos:", error);
          setError("No se encontraron anticipos para esta etapa.");
          setAnticipos([]);
        }
    };

    const handleBuscarEtapas = () => {
        fetchEtapas();
        setShowDropdown(true); 
    };
    
    const handleEtapaChange = (event) => {
        const nuevaEtapa = event.target.value;
        console.log(nuevaEtapa);
        setSelectedEtapa(nuevaEtapa);
        fetchAnticipos(nuevaEtapa);
    };

    const handleEtapaChangeLIQ = (event) => {
      const nuevaEtapa = event.target.value;
      console.log(nuevaEtapa);
      setSelectedEtapa(nuevaEtapa);
      fetchLiquidacionesPorEtapa(nuevaEtapa);
  };

    const handleBuscarPorFechasClick = () => {
        setShowDateInput(true); // Mostrar inputs para rango de fechas
        setFiltroActivo("fechas");
    };

    const handleDateChange = (event) => {
        const { name, value } = event.target;
        setDateRange({ ...dateRange, [name]: value });
    };

    const fetchAnticiposPorFechas = async () => {
        const { startDate, endDate } = dateRange;
        try {
            const response = await api.get(
                `/anticipos/obtenerAnticipoFecha/${startDate}/${endDate}`
            );
            setAnticipos(response.data); // Guardar resultados
            setError(null);
        } catch (error) {
            console.error("Error al obtener anticipos por fechas:", error);
            setError("No se encontraron anticipos para este rango de fechas.");
            setAnticipos([]); // Limpiar resultados en caso de error
        }
    };

    const fetchLiquidacionesPorFechas = async () => {
        const { startDate, endDate } = dateRange;
        try {
            const response = await api.get(
                `/anticipos/obtenerLiquidacionesFecha/${startDate}/${endDate}`
            );
            setAnticipos(response.data); // Guardar resultados
            setError(null);
        } catch (error) {
            console.error("Error al obtener anticipos por fechas:", error);
            setError("No se encontraron anticipos para este rango de fechas.");
            setAnticipos([]); // Limpiar resultados en caso de error
        }
    };

    const fetchLiquidacionesPorEtapa = async (etapaSeleccionada) => {
      try {
          const response = await api.get(
              `/anticipos/obtenerLiquidacionesEtapas/${etapaSeleccionada}`
          );
          setliquidaciones(response.data);
          setError(null);
      } catch (error) {
          console.error("Error al obtener anticipos por Etapa:", error);
          setError("No se encontraron anticipos para este rango de fechas.");
          setAnticipos([]);
      }
    };

    return (
        <div className="App">
            <div className="header">CONSULTAS DEL SISTEMA</div>

            <div className="content-container">
      {/* Sección de botones */}
      <div className="buttons-container">
        <div className="section">
          <h3>Anticipos</h3>
          <button className="button" onClick={fetchAllAnticipos}>
            Todos los Anticipos
          </button>
          <button
            className={`button ${filtroActivo === "etapas" ? "active" : ""}`}
            onClick={() => {
              handleBuscarClick();
              setTipoFiltro("anticipos");
            }}
          >
            Anticipos Por Estado de Aprobación
          </button>
          <button
            className={`button ${filtroActivo === "fechas" ? "active" : ""}`}
            onClick={() => {
              handleBuscarPorFechasClick();
              setTipoFiltro("anticipos");
            }}
          >
            Anticipos Por Rango de Fechas
          </button>
        </div>
        <div className="section">
          <h3>Liquidaciones</h3>
          <button className="button" onClick={fetchAllLiquidaciones}>
            Todas las Liquidaciones
          </button>
          <button
            className={`button ${filtroActivo === "etapas" ? "active" : ""}`}
            onClick={() => {
              handleBuscarClickLiquidacion();
              setTipoFiltro("liquidaciones");
            }}
          >
            Liquidaciones Por Estado de Aprobación
          </button>
          <button
            className={`button ${filtroActivo === "fechas" ? "active" : ""}`}
            onClick={() => {
              handleBuscarPorFechasClick();
              setTipoFiltro("liquidaciones");
            }}
          >
            Liquidaciones Por Rango de Fechas
          </button>
        </div>
      </div>

      {/* Filtros dinámicos */}
      <div className="filters-container">
        {filtroActivo === "etapas" && (
          <div className="dropdown-container">
            <h3 className="dropdown-title">Selecciona una Etapa</h3>
            <select
              className="dropdown-select"
              value={selectedEtapa}
              onChange={tipoFiltro === "anticipos" ? handleEtapaChange : handleEtapaChangeLIQ}
            >
              <option value="" disabled>
                -- Selecciona una etapa --
              </option>
              {etapas.map((etapa) => (
                <option key={etapa.CodigoEtapa} value={etapa.CodigoEtapa}>
                  {etapa.Etapa}
                </option>
              ))}
            </select>
          </div>
        )}

        {filtroActivo === "fechas" && (
          <div className="date-picker-container">
            <h3 className="date-picker-title">Selecciona un Rango de Fechas</h3>
            <div className="date-picker-inputs">
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="date-input"
              />
              <span className="date-separator">—</span>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="date-input"
              />
            </div>
            {/* Botón dinámico */}
            <button
              className="date-picker-button"
              onClick={tipoFiltro === "anticipos" ? fetchAnticiposPorFechas : fetchLiquidacionesPorFechas}
            >
              Buscar {tipoFiltro === "anticipos" ? "Anticipos" : "Liquidaciones"}
            </button>
          </div>
        )}
      </div>
    
      {anticipos.length > 0 && (
          <div className="table-container">
              <h4 className="table-title">Resultados de Anticipos</h4>
              <table className="styled-table">
                  <thead>
                      <tr>
                          <th>Número Autorización</th>
                          <th>Fecha Ingreso</th>
                          <th>Empleado</th>
                          <th>Área</th>
                          <th>Etapa</th>
                      </tr>
                  </thead>
                  <tbody>
                      {anticipos.map((anticipo, index) => (
                          <tr key={index}>
                              <td>{anticipo.NumeroAutorizacion}</td>
                              <td>{new Date(anticipo.FechaIngreso).toISOString().split("T")[0]}</td>
                              <td>{anticipo.Empleado}</td>
                              <td>{anticipo.Area}</td>
                              <td>{anticipo.Etapa}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {liquidaciones.length > 0 && (
          <div className="table-container">
              <h4 className="table-title">Resultados de Anticipos</h4>
              <table className="styled-table">
                  <thead>
                      <tr>
                          <th># Autorización</th>
                          <th>Etapa</th>
                          {liquidaciones.LugarAVisitar && liquidaciones.LugarAVisitar.trim() !== "" ? (
                                <th>Lugar a Visitar</th>
                              ) : null}
                          
                          <th>Descripcion</th>
                          <th>Fecha Salida</th>
                          <th>Monto</th>
                      </tr>
                  </thead>
                  <tbody>
                      {liquidaciones.map((liquidaciones, index) => (
                          <tr key={index}>
                              <td>{liquidaciones.NumeroLiquidacion}</td>
                              <td>{liquidaciones.Etapa}</td>
                              {liquidaciones.LugarAVisitar && liquidaciones.LugarAVisitar.trim() !== "" ? (
                                <td>{liquidaciones.LugarAVisitar}</td>
                              ) : null}
                              <td>{liquidaciones.Descripcion}</td>
                              <td>{new Date(liquidaciones.FechaIngreso).toLocaleDateString()}</td>
                              <td>{liquidaciones.Monto !== undefined && liquidaciones.Monto !== null
                                  ? `L${liquidaciones.Monto.toFixed(2)}`
                                  : "N/A"}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}
    </div>
  </div>
  );
      
}
export default Consultas;