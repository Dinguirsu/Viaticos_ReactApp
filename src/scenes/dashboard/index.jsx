import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button, 
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import {fetchAnticipos, fetchLiquidaciones} from '../../login/Services/anticiposService'


const Dashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [anticipos, setAnticipos] = useState([]);
  const [liquidaciones, setLiquidaciones] = useState([]);
  const navigate = useNavigate();
  const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLiquidacion, setSelectedLiquidacion] = useState(null);

  const handleOpenDialog = (liquidacion) => {
    setSelectedLiquidacion(liquidacion);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLiquidacion(null);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const anticiposData = await fetchAnticipos();
        setAnticipos(anticiposData || []);

        const liquidacionesData = await fetchLiquidaciones();
        setLiquidaciones(liquidacionesData || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, []);

  const handleLiquidar = (anticipo) => {
    console.log(anticipo);
    navigate('/liquidacion', { state: { anticipo } });
  };

  const formatCurrency = (value) => {
    if (value == null) return "—";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const anticiposColumns = [
    { field: "NumeroAutorizacion", headerName: "N° Autorización", flex: 1, minWidth: 140 },
    { field: "Empleado", headerName: "Empleado", flex: 1.2, minWidth: 160 },
    { field: "Area", headerName: "Área", flex: 1, minWidth: 140 },
    {
      field: "FechaIngreso",
      headerName: "Fecha de Ingreso",
      flex: 0.8,
      minWidth: 130,
    },
    {
      field: "LugarAVisitar",
      headerName: "Lugar a Visitar",
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "MontoAnticipo",
      headerName: "Monto Anticipo",
      flex: 0.8,
      minWidth: 140,
      renderCell: (params) => (
        <span>{formatCurrency(params.row?.MontoAnticipo)}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 0.7,
      minWidth: 130,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleLiquidar(params.row)}
        >
          Liquidar
        </Button>
      ),
    },
  ];

  // Liquidaciones
  const liquidacionesColumns = [
    { field: "NumeroLiquidacion", headerName: "N° Liquidación", flex: 1, minWidth: 140 },
    { field: "Empleado", headerName: "Empleado", flex: 1.2, minWidth: 160 },
    { field: "Area", headerName: "Área", flex: 1, minWidth: 140 },
    {
      field: "FechaIngreso",
      headerName: "Fecha de Liquidación",
      flex: 0.8,
      minWidth: 150,
    },
    {
      field: "Etapa",
      headerName: "Estado",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.row?.Etapa || "—"}
          size="small"
          color="success"
          variant="outlined"
        />
      ),
    },
    {
      field: "Monto",
      headerName: "Monto Liquidación",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => (
        <span>{formatCurrency(params.row?.Monto)}</span>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", typography: "body1", mt: 2 }}>
  <Tabs
    value={tabIndex}
    onChange={(e, newValue) => setTabIndex(newValue)}
    centered
  >
    <Tab label="Mis Anticipos" />
    <Tab label="Mis Liquidaciones" />
  </Tabs>

  <TabPanel value={tabIndex} index={0}>
    <Typography variant="h4" gutterBottom align="center" sx={{ mt: 3 }}>
      Mis Anticipos
    </Typography>
    <Box
      sx={{
        height: 500,
        width: "100%",
        mt: 2,
        "& .MuiDataGrid-root": {
          borderRadius: 2,
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#0b7285",
          color: "#fff",
          fontWeight: "bold",
        },
        "& .MuiDataGrid-row:hover": {
          backgroundColor: "rgba(11, 114, 133, 0.08)",
        },
      }}
    >
      <DataGrid
        rows={anticipos
          ?.filter((row) => row != null)
          .map((row, idx) => ({ id: idx, ...row }))}
        columns={anticiposColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        density="comfortable"
        autoHeight={false}
      />
    </Box>
  </TabPanel>

  <TabPanel value={tabIndex} index={1}>
    <Typography variant="h4" gutterBottom align="center" sx={{ mt: 3 }}>
      Mis Liquidaciones
    </Typography>
    <Box
      sx={{
        height: 500,
        width: "100%",
        mt: 2,
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#364fc7",
          color: "#fff",
          fontWeight: "bold",
        },
        "& .MuiDataGrid-row:hover": {
          backgroundColor: "rgba(54, 79, 199, 0.08)",
        },
      }}
    >
      <DataGrid
        rows={liquidaciones
          ?.filter((row) => row != null)
          .map((row, idx) => ({ id: idx, ...row }))}
        columns={liquidacionesColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        density="comfortable"
      />
    </Box>
  </TabPanel>
</Box>
  );
};

export default Dashboard;
