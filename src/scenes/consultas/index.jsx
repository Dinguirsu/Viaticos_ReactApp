import './style.css';
import { Box } from "@mui/material";
import {Grid} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '.././../theme';
import Header from "../../components/Header";

const initialState = {
    Nombre: '',
    Area_Solicitada: '',
    Tipo_Empleado: '',
    Fecha_Ingreso: '',
    Continente: '',
    Pais_Destino: '',
    Objetivo_Mision: '',
    Fecha_Salida: '',
    Fecha_Regreso: '',
    Observaciones: '',
    Placa_Automovil: ''
};

const columns = [
    { field: 'numero_Autorizacion', headerName: 'Numero de Autorizacion', flex: 1 },
    { field: 'fecha_Ingreso', headerName: 'Fecha de Ingreso', flex: 1 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'area_Solicitada', headerName: 'Area Solicitada', flex: 1 },
    { field: 'etapa', headerName: 'Etapa', flex: 1 },
    { field: 'fecha_Autorizacion_Jefe', headerName: 'Autorizacion de Jefe', flex: 1 },
    { field: 'fecha_Autorizacion_Director', headerName: 'Autorizacion de Director', flex: 1 },
    { field: 'fecha_Autorizacion_AsistenteDIFA', headerName: 'Autorizacion de Asistente DIFA', flex: 1 },
    { field: 'fecha_Autorizacion_Administrador', headerName: 'Autorizacion de Administrador', flex: 1 }
];

const Consultas = () => {

    const [formData, setFormData] = useState(initialState);
    const [details, setDetails] = useState([]);

    const handleSubmit = (values, { resetForm }) => {
        const newDetail = { id: details.length + 1, ...values };
        console.log(values);
        setDetails([...details, newDetail]);
        resetForm();
    };
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <>  <div className="App">
            <div className="header">CONSULTAS DEL SISTEMA</div>
            <div className="buttons-container">
                <div className="section">
                    <button className="button">Todos los Anticipos</button>
                    <button className="button">Anticipos Por Estado de Aprobacion</button>
                    <button className="button">Anticipos Por Rango de Fechas</button>
                </div>
                <div className="section">
                    <button className="button">Todas las Liquidaciones</button>
                    <button className="button">Liquidaciones por Estado de Aprobacion</button>
                    <button className="button">Liquidaciones por Rango de Fechas</button>
                </div>
            </div>
            <div className="footer">TODOS LOS ANTICIPOS</div>
            </div>
            <Grid item xs={12} md={6}>
                <Header subtitle="Datos de la Mision" />
                <Box
                    m="10px 0 0 0"
                    height="45vh"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: colors.blueAccent[700],
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: colors.primary[400],
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "none",
                            backgroundColor: colors.blueAccent[700],
                        },
                        "& .MuiCheckbox-root": {
                            color: `${colors.greenAccent[200]} !important`,
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `${colors.grey[100]} !important`,
                        },
                    }}
                >
                    <DataGrid
                        rows={details}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }} />
                </Box>
            </Grid>
        </>
       
    );
      
}
export default Consultas;