import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import React, { useState } from 'react';
import {Grid} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '.././../theme';
import { NombreEmpleadoComponent, AreaEmpleadoComponent, TipoEmpleadoComponent, SelectContinentes, TransporteComponent, GetTotalAnticipos, TipoCambioComponent, postAnticiposDetalleMision, postAnticiposGastoViaje, GetCodigoZonaViatico, GetCodigoZonaViaticoHN, GetMontoViaticoDolares, GetMontoViaticoLempiras} from "./infoCalls";
import './index.css';

const Form = () => {  
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [empleado, setEmpleado] = useState('');
  const [area, setArea] = useState('');
  const [selectedPais, setSelectedPais] = useState(null);
  const [anticipo, setCodigoAnticipo] = useState(null);
  const [Estado, setEstadoAnticipo] = useState(null);
  const [lugar, setLugar] = useState(null);
  const [transport, setTransport] = useState(null);
  const [registro, setRegistro] = useState(null);
  const [cambio, setCambio] = useState(null);
  const [moneda, setMoneda] = useState(null);
  const [tipoEmpleado, setTipoEmpleado] = useState(null);
  const [Monto, setMonto] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaRegreso, setFechaRegreso] = useState('');

  const today = new Date();
  const month = today.getMonth()+1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = month + "/" + date + "/" + year;
  const today2 = new Date().toISOString().split('T')[0];
  const [details, setDetails] = useState([]);

  const handleEmpleadoChange = (nombreEmpleado) => {
    setEmpleado(nombreEmpleado);
  };

  const handleMoneda = (moneda) => {
    setMoneda(moneda);
  };

  const handleAreaChange = (areaEmpleado) => {
    setArea(areaEmpleado);
  };

  const handleCountryChange = (pais) => {
    setSelectedPais(pais);
  };

  const handleAnticipo = (codigoAnticipo) => {
    setCodigoAnticipo(codigoAnticipo);
  };

  const handleEstado = (estado) => {
    setEstadoAnticipo(estado);
  };

  const handleCambio = (cambio) => {
    setCambio(cambio);
  };

  const handleTransport = (transport) => {
    setTransport(transport);
  };

  const handleRegistro = (idRegister) => {
    //setLugar(lugar);
    setRegistro(idRegister);
  };

  const handleTipoEmpleado = (tipo) => {
    setTipoEmpleado(tipo);
  };

  const handleLugar = (lugar) => {
    setLugar(lugar);
  };

  const manejarCambioCheckbox = (e) => {
    const isChecked = e.target.checked;
    setCheckboxSeleccionado(isChecked);

    if (isChecked) {
      const fechaActual = new Date().toISOString().split('T')[0]; 
      setFechaSalida(fechaActual);
      setFechaRegreso(fechaActual);
    } 
  };

  const manejarCambioFechaSalida = (e) => {
    if (!checkboxSeleccionado) {
      setFechaSalida(e.target.value);
    }
  };

  const manejarCambioFechaRegreso = (e) => {
    if (!checkboxSeleccionado) {
      setFechaRegreso(e.target.value);
    }
  };

  const [checkboxSeleccionado, setCheckboxSeleccionado] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {

    const dateSalida = new Date(values.fecha_salida);
    const dateRegreso = new Date(values.fecha_regreso);

    const timeDiff = dateRegreso.getTime() - dateSalida.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    let montoCalculado = null;
    console.log(dayDiff);

    if (checkboxSeleccionado) {
      if(lugar.Nombre === 'Distrito Central'){
        const codigoZonaViatico = await GetCodigoZonaViaticoHN(lugar.Nombre)
        const MontoViatico = {
          CodigoZona: codigoZonaViatico,
          CodigoCargoEmpleado: tipoEmpleado,
          CodigoPeriodo: 1         
        };
        let monto = await GetMontoViaticoLempiras(MontoViatico);
        montoCalculado = monto * 0.25;
        console.log(monto);
        console.log('DC',montoCalculado);
      }
      else{
        const codigoZonaViatico = await GetCodigoZonaViaticoHN(lugar.Nombre)
        const MontoViatico = {
          CodigoZona: codigoZonaViatico,
          CodigoCargoEmpleado: tipoEmpleado,
          CodigoPeriodo: 1         
        };
        let monto = await GetMontoViaticoLempiras(MontoViatico);
        montoCalculado = monto * 0.50;
        console.log(monto);
        console.log('FDC', montoCalculado);
      }
      
    } else {
      console.log('Checkbox no seleccionado.');
    }
 
    ///////////////////////////////////////////////////////////////////////////////
    if (dayDiff <= 30) {
      if(selectedPais.CodigoPais === 'HN'){
        const codigoZonaViatico = await GetCodigoZonaViaticoHN(lugar.Nombre)
        const MontoViatico = {
          CodigoZona: codigoZonaViatico,
          CodigoCargoEmpleado: tipoEmpleado,
          CodigoPeriodo: 1         
        };
        montoCalculado = await GetMontoViaticoLempiras(MontoViatico);
      }else{
        const codigoZonaViatico = await GetCodigoZonaViatico(selectedPais.NombrePais)
        const MontoViatico = {
          CodigoZona: codigoZonaViatico,
          CodigoCargoEmpleado: tipoEmpleado,
          CodigoPeriodo: 1         
        }
        montoCalculado = await GetMontoViaticoDolares(MontoViatico);
      }
      console.log("Menos de 30 dias");
    } else {
      if(selectedPais.CodigoPais === 'HN'){
        const codigoZonaViatico = await GetCodigoZonaViaticoHN(lugar.Nombre)
        const MontoViatico = {
          CodigoZona: codigoZonaViatico,
          CodigoCargoEmpleado: tipoEmpleado,
          CodigoPeriodo: 2         
        };
        montoCalculado = await GetMontoViaticoLempiras(MontoViatico);
      }else{
        const codigoZonaViatico = await GetCodigoZonaViatico(selectedPais.NombrePais)
        const MontoViatico = {
          CodigoZona: codigoZonaViatico,
          CodigoCargoEmpleado: tipoEmpleado,
          CodigoPeriodo: 2         
        }
        montoCalculado = await GetMontoViaticoDolares(MontoViatico);
      }
      console.log("Mas de 30 dias");
    }
  
    const newDetail = {
      id: details.length + 1,
      nombre: empleado.Empleado,
      area: area,
      pais_destino: selectedPais.NombrePais,
      objetivo_mision: values.objetivo_mision,
      fecha_salida: values.fecha_salida,
      fecha_regreso: values.fecha_regreso,
    };

    const newDetailForm = {
      NumeroAutorizacion: anticipo,
      CodigoEmpleado: empleado.CodigoEmpleado,
      DireccionResidencia: 'NA',
      FechaIngreso: currentDate,
      CodigoEtapa: 'ETP_PEN_ANT_JEFE',
      Observaciones: values.observaciones,
      SistemaUsuario: empleado.Empleado,
      SistemaFecha: currentDate
    };

    const newDetailForm2 = {
      NumeroAutorizacionAnticipo: anticipo,
      LugarAVisitar: (lugar.IDMunicipio) ? lugar.IDMunicipio : selectedPais.NombrePais,
      ObjetivoMision: values.objetivo_mision,
      Observaciones: values.observaciones,
      FechaSalida: values.fecha_salida,
      FechaRegreso: values.fecha_regreso,
      IDTransporte: transport.IDTransporte,
      NumeroPlaca: registro,
      TipoCambio: cambio,
      Moneda: moneda,
      Monto: montoCalculado,
      SistemaUsuario: empleado.Empleado,
      SistemaFecha: currentDate
    };

    //const result = await postAnticiposGastoViaje(newDetailForm);
    //const result2 = await postAnticiposDetalleMision(newDetailForm2);
    console.log('Resultado:', newDetailForm2);
    setDetails([...details, newDetail]);
    resetForm();
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'area', headerName: 'Area Solicitada', flex: 1 },
    { field: 'pais_destino', headerName: 'País de Destino', flex: 1 },
    { field: 'objetivo_mision', headerName: 'Objetivo Misión', flex: 1 },
    { field: 'fecha_salida', headerName: 'Fecha Salida', flex: 1 },
    { field: 'fecha_regreso', headerName: 'Fecha Regreso', flex: 1 },
  ];

    return (
      <Box m="20px"> 
        <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (          
          <Grid container spacing={2}>           
            <Header title="Sistemas de Control de Viaticos"/>
            <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit}>
            <GetTotalAnticipos onGetDatos={handleAnticipo} onGetEstado={handleEstado}/>
            <label className="checkbox-container">
              Viatico por un dia
              <input
                type="checkbox"
                checked={checkboxSeleccionado}
                onChange={manejarCambioCheckbox}
              />
              <span className="checkmark"></span>
            </label>
              <Header subtitle="Datos Generales" />              
                <Box>
                  <Box
                    display="grid"
                    gap="40px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      width: '100%',
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                  > 
                    <NombreEmpleadoComponent onEmpleadoChange={handleEmpleadoChange}/>                

                    <AreaEmpleadoComponent onAreaChange={handleAreaChange}/>
                    
                    <TipoEmpleadoComponent onTipoEmpleado={handleTipoEmpleado} />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Fecha Ingreso"
                      //onBlur={handleBlur}
                      //onChange={handleChange}
                      value={currentDate}
                      name="fecha_ingreso"
                      sx={{ gridColumn: "span 2" }}
                    />                                         
                  </Box>
                  <Header subtitle="Datos de la Mision" />
                  <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      width: '100%',
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                  >
                    <Box gridTemplateColumns="repeat(4, minmax(0, 1fr))" sx={{ width: '100%', gridColumn: "span 2"}}>
                      <SelectContinentes
                        onCountryChange={handleCountryChange}
                        onLugar={handleLugar}
                        getMoneda={handleMoneda}
                      />
                    </Box>
                    
                    <TipoCambioComponent getCambio={handleCambio}/>

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Objetivo de la Mision"
                      //onBlur={handleBlur}
                      onChange={handleChange}
                      //value={values.objetivo_mision}
                      name="objetivo_mision"
                      error={!!touched.objetivo_mision && !!errors.objetivo_mision}
                      sx={{ gridColumn: "span 2" }}
                    />
                       
                    <TextField
                      fullWidth
                      variant="filled"
                      type="date"
                      label="Fecha Salida"
                      //onBlur={handleBlur}
                      onChange={handleChange}
                      name="fecha_salida"
                      //value={values.fecha_salida}
                      error={!!touched.fecha_salida && !!errors.fecha_salida}
                      sx={{ gridColumn: "span 2" }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        min: today2,
                      }}
                    />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="date"
                      label="Fecha de Regreso"
                      min={currentDate}
                      //onBlur={handleBlur}
                      onChange={handleChange}
                      name="fecha_regreso"
                      //value={values.fecha_regreso}
                      error={!!touched.fecha_regreso && !!errors.fecha_regreso}
                      sx={{ gridColumn: "span 2" }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        min: today2,
                      }}
                    />  

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Observaciones"
                      //onBlur={handleBlur}
                      onChange={handleChange}
                      name="observaciones"
                      //value={values.observaciones}
                      error={!!touched.observaciones && !!errors.observaciones}
                      sx={{ gridColumn: "span 2" }}
                    />

                    <Box gridTemplateColumns="repeat(4, minmax(0, 1fr))" sx={{ width: '100%', gridColumn: "span 2"}}>
                      <TransporteComponent 
                        onSelectTransport={handleTransport} 
                        onSelectRegitro={handleRegistro}
                      />
                    </Box>

                  </Box>
                  <Box display="flex" justifyContent="start" mt="20px">
                    <Button type="submit" color="primary" variant="contained">
                      Agregar Nuevo Detalle
                    </Button>
                  </Box>
                </Box>
              </form>
            </Grid>
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
                  components={{ Toolbar: GridToolbar }}
                />
              </Box>
            </Grid>
          </Grid>)}
        </Formik>
      </Box>
    );
};

const checkoutSchema = yup.object().shape({
  //nombre: yup.string().required("required"),
  //area_Solicitada: yup.string().required("required"),
  //tipo_empleado: yup.string().required("required"),
  //fecha_ingreso: yup.string().required("required"),
  //continente: yup.string().required("required"),
  //pais_destino: yup.string().required("required"),
  //objetivo_mision: yup.string().required("required"),
  //observaciones: yup.string().required("required"),
  //fecha_salida: yup.string().required("required"),
  //fecha_regreso: yup.string().required("required"),
  //placa_automovil: yup.string().required("required")
});

const initialValues = { 
  nombre: "",
  area: "",
  tipo_empleado: "",
  fecha_ingreso: "",
  continente: "",
  pais_destino: "",
  objetivo_mision: "",
  observaciones: "",
  fecha_salida: "",
  fecha_regreso: "",
  placa_automovil: ""
};

export default Form;