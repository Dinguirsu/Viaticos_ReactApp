
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {Grid} from '@mui/material';

const Liquidacion = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <Grid container spacing={-4}>
    <Box m="20px">
      <Header title="Liquidacion de Gastos de Viaje" subtitle="Datos Generales" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        //validationSchema={checkoutSchema}
      >
        {({
          values,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              <TextField
                fullWidth
                disabled= "true"
                variant="filled"
                type="text"
                label="Numero de Liquidacion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.numeroLiquidacion}
                name="numeroLiquidacion"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                disabled= "true"
                fullWidth
                variant="filled"
                type="text"
                label="Empleado"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.empleado}
                name="empleado"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                disabled= "true"
                fullWidth
                variant="filled"
                type="text"
                label="Area Solicitante"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.areaSolicitante}
                name="areaSolicitante"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                disabled= "true"
                variant="filled"
                type="text"
                label="Fecha de Liquidacion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fechaLiquidacion}
                name="fechaliquidacion"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                disabled= "true"
                variant="filled"
                type="text"
                label="Autorizacion de Anticipo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.autorizacionAnticipo}
                name="autorizacionAnticipo"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                disabled= "true"
                variant="filled"
                type="text"
                label="Total Anticipo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.totalAnticipo}
                name="totalAnticipo"
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}>
            <Header title="Datos de Mision" subtitle="Detalles Finales" />
            <TextField
                fullWidth
                disabled= "true"
                variant="filled"
                type="text"
                label="Total de Viaticos y Otros Gastos:"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.totalViaticos}
                name="totalViaticos"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                disabled= "true"
                variant="filled"
                type="text"
                label="Diferencia Anticipos Gastos en Lps:"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.diferenciaAnticipo}
                name="diferenciaAnticipo"
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
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