import '../consultas/style.css';
import { Box } from "@mui/material";
import {Grid} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '.././../theme';
import Header from "../../components/Header";
import axios from "axios";
import AnticiposTable from "./anticiposTable";
import LiquidacionesTable from "./LiquidacionesTable";

const Consultas = () => {

    const [etapas, setEtapas] = useState([]); // Estado para guardar las etapas
    const [selectedEtapa, setSelectedEtapa] = useState(""); // Estado para la etapa seleccionada
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDateInput, setShowDateInput] = useState(false);
    const [anticipos, setAnticipos] = useState([]);
    const [liquidaciones, setliquidaciones] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [filtroActivo, setFiltroActivo] = useState("");  
    const [tipoFiltroActivo, setTipoFiltroActivo] = useState("");  
    const [tipoFiltro, setTipoFiltro] = useState("anticipos");

    const fetchEtapas = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/obtenerEtapas/` // Ajusta tu endpoint
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
        const response = await axios.get(
          `http://localhost:3000/api/obtenerEtapasLiquidacion/` // Ajusta tu endpoint
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
            const usuario = 615;
            const response = await axios.get(
            `http://localhost:3000/api/obtenerAnticiposByIDEmpleado/${usuario}` 
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
            const response = await axios.get(
            `http://localhost:3000/api/obtenerAnticipoParaLiquidar/${SistemaUsuario}` 
          );
          console.log(response.data);
          setliquidaciones(response.data); 
          setError(null);
        } catch (error) {
          console.error("Error al obtener etapas:", error);
          setError("No se pudieron cargar las etapas.");
        }
    };
    
    const handleBuscarClick = () => {
        fetchEtapas(); 
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
            const response = await axios.get(
                `http://localhost:3000/api/obtenerAnticipoEtapas/${etapaSeleccionada}/${sistemaUsuario}`
            );
            console.log(response.data);
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
        const Usuario = "ADMIN";
        const { startDate, endDate } = dateRange;
        try {
            const response = await axios.get(
                `http://localhost:3000/api/obtenerAnticipoFecha/${startDate}/${endDate}/${Usuario}`
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
        const Usuario = 'martha.dubon';
        const { startDate, endDate } = dateRange;
        try {
            const response = await axios.get(
                `http://localhost:3000/api/obtenerLiquidacionesFecha/${startDate}/${endDate}/${Usuario}`
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
      const Usuario = 'martha.dubon';
      try {
          const response = await axios.get(
              `http://localhost:3000/api/obtenerLiquidacionesEtapas/${etapaSeleccionada}/${Usuario}`
          );
          setliquidaciones(response.data); // Guardar resultados
          setError(null);
      } catch (error) {
          console.error("Error al obtener anticipos por Etapa:", error);
          setError("No se encontraron anticipos para este rango de fechas.");
          setAnticipos([]); // Limpiar resultados en caso de error
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
                          <th>Código Etapa</th>
                          <th>Lugar a Visitar</th>
                          <th>Descripcion</th>
                          <th>Fecha Salida</th>
                          <th>Monto</th>
                      </tr>
                  </thead>
                  <tbody>
                      {liquidaciones.map((liquidaciones, index) => (
                          <tr key={index}>
                              <td>{liquidaciones.NumeroLiquidacion}</td>
                              <td>{liquidaciones.CodigoEtapa}</td>
                              <td>{liquidaciones.LugarAVisitar}</td>
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