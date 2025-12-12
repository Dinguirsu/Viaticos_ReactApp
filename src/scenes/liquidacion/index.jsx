import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {Grid} from '@mui/material';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileUpload from './upload';
import { Upload } from "@mui/icons-material";
import {obtenerCodigoLiquidacion} from "../../login/Services/liquidacionesService";

const today = new Date();
const month = today.getMonth()+1;
const year = today.getFullYear();
const date = today.getDate();
const currentDate = month + "/" + date + "/" + year;

const Liquidacion = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [liquidacion, setLiquidacion] = useState([]); 
  const location = useLocation();
  const anticipo = location.state?.anticipo || {};
  const [numeroLiquidacion, setNumeroLiq] = useState(""); 
  //const [anticipo, setAnticipo] = useState({});

  useEffect(() => {
    const fetchAnticipos = async () => {
      try { 
        const liquidacionCodigo = await obtenerCodigoLiquidacion();
        setNumeroLiq(liquidacionCodigo || []);
      } catch (error) {
        console.error('Error fetching Liquidaciones:', error);
      }
    };

    fetchAnticipos();
  }, []);

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
    <Box
      m="20px"
      p="20px"
      width="60%" // Ajusta el ancho según tu necesidad
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#2b2d42" // Combina con tu tema
      borderRadius="10px"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.3)"
    >
      <Header title="Liquidacion de Gastos de Viaje" subtitle="Datos Generales" />
  
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
      >
        {({
          values,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                disabled
                variant="filled"
                type="text"
                label="Numero de Liquidacion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={numeroLiquidacion.nextNumeroLiquidacion || ""}
                name="numeroLiquidacion"
                sx={{ gridColumn: "span 4" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                disabled
                variant="filled"
                type="text"
                label="Empleado"
                onBlur={handleBlur}
                onChange={handleChange}
                value={anticipo.Empleado || ""}
                name="empleado"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                disabled
                variant="filled"
                type="text"
                label="Area Solicitante"
                onBlur={handleBlur}
                onChange={handleChange}
                value={anticipo.Area || ""}
                name="areaSolicitante"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                disabled
                variant="filled"
                type="text"
                label="Fecha de Liquidacion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={currentDate || ""}
                name="fechaliquidacion"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                disabled
                variant="filled"
                type="text"
                label="Autorizacion de Anticipo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={anticipo.NumeroAutorizacion || ""}
                name="autorizacionAnticipo"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                disabled
                variant="filled"
                type="text"
                label="Total Anticipo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={anticipo.MontoAnticipo || ""}
                name="totalAnticipo"
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
  
            <br />
            <FileUpload numeroLiquidacion={numeroLiquidacion?.nextNumeroLiquidacion} />
          </form>
        )}
      </Formik>
    </Box>
  </Grid>
  
  );
};


const initialValues = {
  numeroLiquidacion: "",
  empleado: "",
  areaSolicitante: "",
  fechaLiquidacion: "",
  autorizacionAnticipo: "",
  totalAnticipo: "",
  totalViaticos: "",
  diferenciaAnticipo: ""
};

export default Liquidacion;