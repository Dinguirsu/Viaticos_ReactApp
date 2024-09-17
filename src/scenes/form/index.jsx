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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './index.css';
import imprimir from './resume_print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  const [reset, setReset] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState([]);
  const [resumeData, setresumeData] = useState([]);

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

  const manejarCambioCheckbox = (e, setFieldValue) => {
    const isChecked = e.target.checked;
    setCheckboxSeleccionado(isChecked);

    if (isChecked) {
      const fechaActual = new Date().toISOString().split('T')[0]; 
      setFechaSalida(fechaActual);
      setFechaRegreso(fechaActual);
      setFieldValue('fecha_salida', fechaActual);
      setFieldValue('fecha_regreso', fechaActual);
    } 
  };

  const [checkboxSeleccionado, setCheckboxSeleccionado] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {

    let dateSalida = new Date();
    let dateRegreso = new Date();
    let montoCalculado = null;

    if (checkboxSeleccionado) {
      console.log("Aqui si deberia entrar");
      dateSalida = new Date(currentDate);
      dateRegreso = new Date(currentDate);     
      if(lugar.Nombre === 'Distrito Central'){
        const codigoZonaViatico = await GetCodigoZonaViaticoHN(lugar.Nombre)
        const MontoViatico = {
          CodigoZona: codigoZonaViatico,
          CodigoCargoEmpleado: tipoEmpleado,
          CodigoPeriodo: 1         
        };
        let monto = await GetMontoViaticoLempiras(MontoViatico);
        console.log(monto);
        montoCalculado = monto * 0.25;
        console.log(montoCalculado);
      }
      else{
        const codigoZonaViatico = await GetCodigoZonaViaticoHN(lugar.Nombre)
        const MontoViatico = {
          CodigoZona: codigoZonaViatico,
          CodigoCargoEmpleado: tipoEmpleado,
          CodigoPeriodo: 1         
        };
        let monto = await GetMontoViaticoLempiras(MontoViatico);
        console.log(monto);
        montoCalculado = monto * 0.50;
      }
      
    } else {
      console.log('Checkbox no seleccionado.');
      dateSalida = new Date(values.fecha_salida);
      dateRegreso = new Date(values.fecha_regreso);
    }

    
    const timeDiff = dateRegreso.getTime() - dateSalida.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
 
    ///////////////////////////////////////////////////////////////////////////////
    if (dayDiff <= 30 && !checkboxSeleccionado) {
      console.log("En teoria no deberia entrar aqui");
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
    } else if(!checkboxSeleccionado){
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
      pais_destino: (lugar.Nombre) ? lugar.Nombre : selectedPais.NombrePais,
      objetivo_mision: values.objetivo_mision,
      fecha_salida: values.fecha_salida,
      fecha_regreso: values.fecha_regreso,
      observaciones: values.observaciones,
      monto: montoCalculado,
      moneda: moneda,
      tipoTransporte: transport.DescripcionTransporte,
      numeroPlaca: (transport.IDTransporte !== 1) ? "No Aplica" : registro.NoPlaca,
      estado: Estado,
      numeroAnticipos: anticipo
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
      FechaSalida: (checkboxSeleccionado) ? fechaSalida : values.fecha_salida,
      FechaRegreso: (checkboxSeleccionado) ? fechaRegreso : values.fecha_regreso,
      IDTransporte: transport.IDTransporte,
      NumeroPlaca: registro.NoPlaca,
      TipoCambio: cambio,
      Moneda: moneda,
      Monto: montoCalculado,
      SistemaUsuario: empleado.Empleado,
      SistemaFecha: currentDate
    };
    setFormData(newDetail);
    setOpenDialog(true);
    setresumeData(newDetail);
    //const result = await postAnticiposGastoViaje(newDetailForm);
    //const result2 = await postAnticiposDetalleMision(newDetailForm2);
    console.log('Resultado:', newDetailForm2);
    setDetails([...details, newDetail]);
    resetForm();
    setReset(true); // Activar el reset
    setTimeout(() => setReset(false), 0);
    setCheckboxSeleccionado(false);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddNew = () => {
    window.location.reload(); // Refrescar la página
  };

  const handleGeneratePdf = () => {

    const imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUwAAABZCAYAAABVAh3DAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAgAElEQVR4nOy9e5RcVZ0v/tmP86jqSnen02lCDOGREELAGDEiAwGj8hIfo6hBZ5R3pxODk/H6YzlehsXyurzgON6ZCHl0QkDEcZyg42NUlCiiRkRERjHEEEMIIcSkSTr9qK6uOmfv/f39UV3Vp3bvc6rCvWvdu2bmu1avPrXPd39f57u/3+/e55x9GAAOwCT+25A8jwSOqx9P9DMpfdP6ZdGywfzlT3cvYeDlr7x5wW4H/SywdXTxdOmLFJw0/Vxg2yfJP6ufq2+WrLYNXLIm8ZNyuPi5ZLb7t0ojTWYbv5mPpNnSbmtVLtf5LH9q1Zat2N1ua1VmW47/6LaE1W7jpoGLRjO7O+OezEBGEtFBuFm73ZYWVNIM4gqudbn8MP+XwvOOANjt6JvGswZpwT9NfpddXBe/2fkkjWb9bfw0aHa+GW6WXZrRcNnXZatmcmTJ1YqdWkkQrdixlcFXo9mMvm2npK+1olOz9rTz/5Ft2UqscfFvFpNaldOwFAYuo9kCpTFtpkQaLwOAf2T78+CBPq9SLDzztatmR0kCN/zy+QXExHuYIUmgXsZFkcj8EwMvqyj+1oNvnr8/yecjP32um4H1fPnNC3ZacraS0dKSR1a2sum1ksnT8DITRhOZ/k/htRL8XPit6JXsnyWPS/Ysn0u7Xq1c1xORqRW8VvllyXEiPvEf3ZbJ81mx50THWxrfKTzSMo6x/lx9khWZC68VmBJ8mIe83955q98+vnCKfBEdAtGI11b4OIhOI63P9dum9TLBDnuaBhLyVLMBZ8vA2ZqVTz1v62TLnVUdNbNDEg8WXlowsZ3VlTnTLuoU/O3bf41f/2534Xe7n7dnDDY/F19bt7RBYeO7MniyYmgW5NOyfpq8aTZI0ylNtjQ/tW3QyvVN4rt4u655M1tmyf2f3ZbJ/q441WpsypLbhVv/S6swk22uajLLYK3i1+mveOwp+GLaXCn9+UbF3X5b+xei4si3GBffBEOJKf+pL735lAgA/8iO5+F5ch0ZuoULoVS5fDtx/ndfXjYPAHDtT57LizBYYpQKmRS9QnqL4/HS7dzzR5iJdr79z+YfXsF5mmxpstv2SNM7bbBkVaXN+jStcN/713/Lb3zHlWec+ppZRxcvmj+SgduMvs3HRacVvdLouug34wekXwvXeRdulgxp9mjmI2k4Lj42/Wa2zKoA0/TIkuk/mi2TkBW4WxmzLn6p9JKVQBqRZNQ1mKowz+ibxrwh8/oiBwFuZBDe4OULd8el4mzh+Td7bYU7AczWUTRJQ41LAj+PGL/DgP4+6Oh8PbTO12QjBgUyC7xC4R9AuFpXKgv8tsJ6BrxPk1BgLCmHKwu7sl/WRUnqnbSHnZltOyVtmWbHrKBd/3vkq5tRKpXktEK+M0W2ZoMkea7VZGIPkLTsnmyz6Wedc1UmLrBt2ayiSLNlsyCf7GPTtMHGsQduM1u65P8vW072S/5vFgiz6LtiW7L/FHzXIK0dOwenJbAr0NoCTwnKK3fsbcD7ysXnmAcuPvNAPD6+WpfHdwnPBwCuSsXbHrho3tcfvGzeJB/NunRUvl2Pj97FOL+9Uhzdqpmq835w+VnR6EuDX4qKxc9xKSX3fa5V/EQ8Xvn4l5fNO7qiGjA5AFy6/df8Qz/bY+tkXxDbJvZxFiRtluVcdp8a2H2c2XJsYAAjI6MAZHuiX/Ia2IPH5dD2oLb72HhJ/Wx9XTRtuWz9bD7IaEvyyhqoWfJnJbEkNKt8XIMszcauIOayZVoS/S9buuV2jccs32xmG9eY5ED1Lnla5koKaxN1DX5X3ymB4iOPPedHWi8G8LTV15CO53qFjva4NPZ3MsxdSkotBfBIkvaDbztnAMBAou8jSfoAkDt1JheG3iiD4PuqXN4rpL8sYlEeQDnJs1u2hZJoMYAnMmyQpq8dvJplwDTnsnnBcb5BP6sfB4Cx0ijGdZwHpjili0ea3GkDKs1hbRvYxzbvrPMum2YlpTScNN90JQ1XP1g4zWxpy1/rm8armS1dPP7LllPx0/w5i3+avGl0p8hu3ySwBc4yRJbBXIwBAIxhrsi3feraHc/3fnnZvMEkLjMIo9LoJ0hjB1XG79bGLLvx0WfD+956TnmK8OservJf+/akLFUe5UrBCPEbXancYVRcJuBSIWnWZ386Mnjbm9vreD7nc7jv33b9Y89/6EvL5xUzdLF1SguWLhyXPbJ4NHNAF28+VqqAg+WJSDLGVAa9VvRztTX87/3lrm4iNnLvhWdHFm6zxOAaNKm2/Nhj/y7HhF8YLYcjD102L40PAKDvp8/kmRdcSaQVEQyIQJxBSD8yUeW3my8+56hNP8m7b8eznYyLhWTIAFTFY4DwQ6Wj8p7+ixaV7T4O+W27penYzH9sWv/btrRwbDqu8W73PRG/tGVJk/PV2NLGzfLprP5ZNJ1t0mqsEW+mQFoGcAr2ge1/lG2+ngvuFQzMci69C9j4+FXX/+LFZ7RWQ4tHZx+89R05E0Sjv928fGmN/6Gl39319Zkhz1/z8z09BekvDKU4bYakc0LB8wBVZX/moIq0iY5r/KFosL9UUTsHK5Whgaj41ScvPs8AMB/Y/vz3g5DxI7P+hJt++pI0nplrjMmD1CXSDy6IVendN/zihZ0EDF114WkHVzDm0rcGrgzuymB2QmkWjF3ZO02OKQOoMl6B0RSiek0VpkKzCjFL/iQ+AHCm8SkG6gewxyFbFrgGvy1nnU8sg1m+lH/RoSv/qxltBtnDfe9Bo7isrlRTtTUIinEc3QTgOxafpDxGeP75THr/QmQMwEy1PyA8f0hH5fcB2Jmio207VzWTFrDS/KKZvyRlT4NWKqssaCWY1dqT8tg6Z/F+Nba0fa1ZjMri58JNrfSlJVjmIIH74td+u0pnDgBEEUiEZ3Ah13PS86PiCGdSPgBmnmZEa58c+7eDALD58qUKAH/T9md5u/QWLZiWu/Ks6W1XzM+LJSeHXvfMthDTJUMw4ci1GzgRAUOKcHQ8wp9KlaEXymbnrmPFR7t+8sdvDoxHOx+6bJ6qyfOR7c9DSjaXS7aFNJ8fl8bApHwQYE+BzMdXMHbQYbhWMq+Na19cl11dVUeaPdOcnwNAXKkgjiJ78GQFaw43zWbym5WP/S4vw/AvGNFvMBkwmw3GZhWWyw8N84PlflvhQ1oNbgYwYp1vsJcRBKa1T1pJACCquggplSewLFsCAHQUS2jdCar6F9X8rHqcaX/LBk5dUuySlnBbDQYt29JxnGrLJvI3tWUKblqfVm1pn0v+zqpmXfKk4WbqKVOQsyJzmmCpA+brl59jen/5wqOVOHoX9+SvuO93gmhAVcauABdDD61YYQDgzT/+Y35eIbzkrM7cTW+cnrvqtdPDsIMzLhlDLdtXYyQDEQFEYIwhBGGWBE5uD3DutKBTg5aNndK+7PfD0f/39PHSjqW/Prh118jYD3a87azig5fNUzf/ZM/PIsneKzz/J0ygmzF2MB4vvguS16ZsLqdt1T5JyEoyrja7YkgbKPa14MpowzkPDVBbq3XRy6KRKf/KHc92+m2FVVx4p6vKeBcZ002GPnXLb1+6mDEWRcXiA/0XLXwqQz978Dn95brtz0gvkBf4+fAdRikYFV8eFUfO5aA7Vv9yzytEdLRcMl/50qVnlzJ4ASAkn4iYOHRVS045CAQGgIjVyaX0aUazVV9phnvCtszo92r8Mut3mi3TkoVrjNl4zfzSptOMZ5rsLkiVrVZhJhvtzOMSJuuc88IOeRo5RQv9Qvv+uDi6Q+byV6ooOuPBixc8fcF3n/LndXUteX13+6cu7iksX9DmdXZIXg+IRLVgyWCIEGmCJoLkDIIBglXPVYEgGUM7B5Z1hfnXdQSX7+spXPjTgdwTZ/5i32f3Do09wTwecaIFXr5tfzxW/CqT8j1cBnMfWDbvqKWDy3Au+7RiM1g4sHBbCZSuzM4BwCgNrQ03asp5m2+Wk9n8J/uNU5Fy9IiBug1g79ZRhXMhF4FMSMRu46DaO/2tyG7LVz8XIDKG8Z1kaLnwgzWqPD7LKAXu+x9lXDxuKpU7fCbLdr+pwMBAtWIxUStmVlYNvatBl2CBje/SKw1cCTHNn+zzLtlhtdv80/wyy5+RgdNMnrRg1ayibNWWLnvZ4Bondl8XcEylP+V/ssLkKUhpBGxGLsZ1JfwxLQmsMx4vfaQCs5sq4w8wsDlXPPz7vad3d9x41Sldn7ykO9/TISargqSr1gLnS2MRfnlkBDOC6hKmLzmWndQOAYASAbb2v8CBxQWvcGZb16W/bA/Pe/jQ8OadA8f+4aRcmI+KI708op3g/F/I0NwPbH/+6Ycum9c0OGUY3PW72SBxVezNktUUhyWjoI2CpjpNG9clb1Z10SD/5svONQCeXrlj1ydkEJ4vPG8OGIsqpdKdWy46+2uYai8XLVu/KTJsvmwpAIx8YPtTd3W3dyjO+Z3V68n3UBT19l+0cB/SHHpKbJtMpKyx2R7gjccTc/nqv4n+kxVqK77g0rUVSAtcaQEx05YOfNe5tOCQlvxsXmm2dCVru/+rsWWzajetn03DlUSa0netYboM4CKcbGtWsfB/evNZBsCX6y0f2Pb0Zb2vPfyW00568OpTOt95VpsHImoIdjaUNeH5kXGclPNwtKLQ4Qm8WKzgjd0GeSkSVWYjMMaQA+FtM/NdC9qDv/nXtuCt333+T3/5o6279uGhFQDwuCV7VkbOaoOjLSvBtBoom1WxiI2CMsQ1UZgiU2rfE8GXQW6xDIN8eWT47/22wnLhB28DcG9GX7stLfE2ttF0gLGLhC/3qEp5J5PyEhVXegDsxdSBV+0/5fJPSb7Nkn8Vl1V7JsnVp+bZ/p9mX5evZF3r2nFWUmvdlumQFnBdwTlL51YKqSRPF/9WbJmmY1qsSkIrlWZW8DZJInbWqv0liXAHnquKsnGS/zkAvqh/O39v32vP/dBZs7+3ct6Mqxa0eQCqgc0VLJPT7dfkffSEHiRjGNcGXb5EMdbVs4mpe7Jvkt6cQOCm06eff/05p377+r8+f/mif9nhqsiSCcTWCRntWedOlEZaVnReDzIAacMZyM+QPcu5muq0+vFd0qjKbCK8lxg+RVp/IC6P71v149+327hId26brxM68+XTyMR7VaX8LqPj64xSdwjuLfqr557LqnwSUF3jrgGrhsw0WzbQYMQmbviwhts+KbplBRrXgM6qpmzcrMTasi0tvmk8bDxbr2ZJPC34NrP3idgy+R9Il88GV0xrFbcBalNyO1slO6aVqWnOkJZdq/8ffo4vmcaXvGVuz5YVr5m2uI1XA5o9/a5BreIEgNFYY6AcgxPgcSDShBiEwYpCT86fUmEmp+f1NgAFwXD17LZFoUS/Aa3ZtW3bj7BiRVbGTHMO+2JP1Tf7f1alk5UB7SoEhgham+Q6hmsgGKtvVradcn31GBkE+it3L55dnGg60PvLnZ/Vwii4ZavLfOXDz2HuNFoKbQY3v3nRvgy+AMCJ8QEdq9u3XHxOCYBZ+ZOdm5nPOwEBR193ZcAmHy4ioLDy8T90VR+vZABxAzLVQ+JggGEMklCrMKtlZqPnNNgmzVatVFVJmV9NsHMFlVRbNuGXVZ1mBfckNJOrlQBty9PMllnjsVWdm52bQkOmdGo1IGRVL05jXcrjOcvnzNn4wde0n9fGMSWg1apBux0AytqAAxg31Sm4xwi+YJDWjaG0aX2yPWTAO3oK82ON9UdK57zrh5P7aqYFD9d/W9e042bZvdUgasMkH9IwZGCmVqeurG7TcDn7FPk3X3aOAVBKtJstf3au/TC3U9fZoeJemL9GRZUXAGyy+EzR/96Lzi4m+vPNbznXADjq4GPTAADQ5G0b6KjiCy+4nUuxpnqWqeRzlmBMMUAZpbp1VAEmEnij/02pUG2+aYkW1vm042ZFSFrwSpMnLYi0QttFz6adJksS15alWTHWii3txJ8FzYKu6/pkBf0pN32yjJNUupUsNGXwv+HfnipcNnfm1qtnTzu/MNGr5pSuNctagFOGcGQ8giZgZs6DzzkqysAXHIoIRysx+CgwI/TQ7ol6/2TQtP8DQMiBd81qm3+sPOtf9CPPXvajy8+pbRGXZguknHdB2sBJ2sYFrqBpH9fo12lrTdBag0i7puRpAzXZlpUQmzmvCx/X/uAXyHWcdAapWIJRnnF+OeN8oHfHrkcBFkk/KClGA1veOC/Llra8yfYMH6xOqQECDHETR/NNnMElATW/qT2NmQBXsEm2ZyWNrCRq02slAKJJuwtepS0bIC3ouQJ0lt++Glsm/9v9ssZrM8iyXwN9nvhLy0jJY1fgsHFtITgAc/EPd/oXzOq55X1zp7+1y6ui127y1AJj2k2bwUqMQ6UIkTY4VlaIDaEzlAADtKk69mBFIdJV8ew1zCTU+NTa84Lh6jkdi98ws+P2t3z/93mHTtzRZjtWK8kkzUmzHNTlfC6+1eU6MpwzXkihmSVLklftfNa1bQW47+fAoJfkumZs9fJt/6Yq5UUgXBIUpj2c6+i8n7ReUBgj284uWzYLCFMHeq14xOS0vOGBdLIQJ9rtc4zcPpnU0yFbK4M3Sx/b/idy7ZJ9/ndsmeXDaX7ZjEcrwTjLls1w0/ik8U2La6l9Xa9Guo5dQTQtk06ls+77/DV5/9wr50y/9fSc5PVXMOAOaDUYijQ8zhCbqgdrIhyP1ERVyVBRBgaEWTkfmoCRWKOoDHzO0B168PlkYLT51IM0gJMDgXec0nX9YKXyw5cffu77e95+VpZNTvSiZyUTV7uN0ywpAQA0CNoQwJg9a8jikSZTWv9m1UED3PvW8wDgW32P7znKONaDaA4YQCo+GI2Prd30ZwufsXim8XNVUXYl0gAN15sxNPhcovgEYxMPqVfvi0+8FzEZaFnyhYlUOe32rErLJT8c/WxoFjRrMqTJ+KptmdKeJb+r6EjKl1Z4wNHejHezCt0Vv1z0Wkps0tXoAFsYW2FX9VTve+H8UwpLujtuf9tJha7kfUf7pkxyjXHfaBmHxiK0eQKxNujwJXaPjOOFYgWnFwIIxvBCsYxibDA9qOBN3QUcLceIDaHNExiNNea1h/AcVauL55u6coU/9HTevnvw8BN7qmtlzeyQ1m4nFVjtdvWR5hjN6CTbeXXmSTCmfjc3OU1y8Ws2tUurGOxB0bSdyOyWfm7IKFVijPlGmwEzKmvvZcPRP42mDZmVXC0ugghcSjDOJ08kK8va+jcRSOuJIIr6ixNVJOc+qmmQNVtLw7X7ua5TViBOC1yv1pZpQS3N5mnVoUuGLD90yeWyiT1u0mQxKTg2jzQ9Gn7LRKNN3CaW1u5SqsEY53RPW37pye2X5pKvNcK9blmMNf4wVH3r7ezpefxyYBQeZ/jR4WEYAl47PQ/JGCIidAUSJ+c4ekKJfx8cw4L2EMMVjWmegDKEJwZGMactwKmFANxaK7V5eyC8pWfakt8dHXv/z6s3JVzQzODNBkZWe9pUpJUgWn2sqHaLd6o8rWTf2jnbudIGjB1MU/VgDIvBmDKxuoILPttrK/SaeHABgF0ZeqUl4TQ+DZBMilxKZYz5AYj2Vmfc5KNxdpUHEQcwG4wtrxegLOEvWczcAzKtkksbY3ZicgWVLPpZCfvV2DItgLrOuyrJtALBJU8SmtkyrQBwydZKdenqm4qbfKwoLRukHWcNlDrTS7/3lDynM3fTgkJQsJnbN2VGY43nhsdRjA0umdWOI+MRPAbsODKC13e1ISLCvPYQr8kH8Hh1MByvKDw3PI750wL8caQMwRhmk49ZOQ++5HipWAEAnFYIGni6bjbNyUl/cVe+703fe/a+X73jnNpLhi4HtyGtosuCZjSTOE0ypFd9dIYMaOrQzuKRlgyz8ADA9P5yT4/UbGjjsjOjlP6TTkcYUONjvf0Xnb135bbtHKeetpODVALPFVQMAH7zL3ZJHavw/oHdJaxYkaYPB2CS17L6Hnh1Gs6lp0y5fP+mZQv/FQD/6K7nsO9FAESYMczgzS5LX4dgnr4cgi+Hofq0nOr06nfJbZlderdSsWQFFLtfWiDKGrPJ3y5+rcyWbBouudLO2bxs/V6NLeHAbcVv0/CaFTFTcLLeJc+K0nCcs38bAFx4ucWv7562bJqYOjUGGtea9o2WUYwUls6chuGoenPnxbEKLuyZBs4YLp5RQE+u+pC7NgTOgGlegJNyHh4/MopT2wI8PTiGDk9gZs5Dp5E4MhZh/2gZPTkPbXLyDnryRlPtOMeA83umLf7mvoFlAB6zdXHYyTZoWrBsJTi68FzJzMH3dHBwGG1gDPmWLGnTmVaCpStgcwBgWn9GA58DsB9u+9Rp9l+0cGft9+YVlxk0fho5rXrgACCknC+ld3nvzHPv2dJE5obH01jtsaKJhMwm+21YdJatlwJg+n7xBw6WDJNArba03hRKsxEc512VoN0n7Vql8UyTIdOWKTRO1DfTCqe05O6KGWl8m9nS1a+F8XHCkBrX7IGTVvYCUxV3tTcI+drv/A6Luqb9+dltXsO3ZpLVXa0qGI01BisK89tzIAAVbfD0sSIiQxhTBgs7cpgZShARlCG8WCxjOKq+4eNzhqUzCzgWKSxoz+GRQ0N44sgIhiOFc7vyyEuOl8eihmrSXsOswaI2j7/hpM4Pnfedf/cx9eImHcE+TrOLy/hTbOXo28zhE0AwUNBGgzHKG2NaqRhdVUtLcPOO3bNlEHyQe3IJ3Lq7IDWgOmSrHzPG3hlO67iGS6rNUJI+mmrL+j0dTHmXPC14cLCJLeDYxP3yhG9YS+HNApbrnFPORLurYkzr86psmSFbmi2zArktRxqfLN1sfkleaX55IhXnqw2eqTZJPrjebIDbAjYr8fnpnicXdrVd2u4JDkwNTskp+UA5hs8Z2jwBQ4SBcoyBssJZ7TmMG4PXtPn1fsORQiA4BsYjFDwByRkKkuP0aSEOFiuoaFPdzYgxHK8ojCmDobiMee0hBBqn5Xbg9Bhw7oz8hTuPBp1PVz+F4cr2abq7sq/d12W/rICVNYga+k3Ykids7JLHVV2myV3neeNjO7uDtvxaxthpWsWzyJh2EN320adeeC+MKeo43jhRSSb1baBhgTOQ9P769xKRuMAP8283Ro+R1h8ojw4v4L5/65p/P/CyrpQPzp3V8f3/ftpJWT6aeLWxYYkibdA2yFB/6D2xU9GEmzqrDotumi3TAmdaZXYiA78Z7ayA2kpCT9OzmS1t3ezzafK3Us3auK1UymnVcJYsmQSS7Umhkn9ItLvo1H8r8K45Pl/sO15RTFZ7RNVHYtqkwIFiBbuGxjEaa1S0wbg2OL0QQia2i6log4BzcMZwZHyyclw8PY9XKjGKyuAXA0U8M1hCSRkUJIfHWPWxmwS4Kk4G4BSPz+/wvdkpRnNVfq6MZAcmV/8auJzaDnAZ2X0i6GtA6ym002YAzqCb8tuItvFBo+KHhed1cy4u1XEExth5wvOWEtF2xPEeq1/W4LaP621DL/zBAGYXGONCerfC0BJSKs+E+BvG+J+TUgP7Dxx10Wr4Ua8sqZYQJ3Vx6DhxjiY33SA0PoM5OaXPSm5Ztkyztz2AbZtkBYJMWzpoZuGm6eUK+ll+mUbLJcOJ2tIVTLMgzeZZ/DJtnXysyNWhlUjuCpYAwKXPFp/e1Z5PbvprPxdZ2+NyXBsMTgS7kVghLwRCyTESa5wxLaxXha+MxzhWiaEmnrv0GENXIJGTAoFgmJXzYKgaVItK4fiIwjTJoUFT9viy99qswSkdeb8zF5wP4LcZRsyqyrNsmpq9UtrS6Ns8YMiAgVyDIS3RpTn8lMy+5Y1vNAAe7/35s2tkEPxa+kEXGCuXR0Zu23Lxom+1oEMDPQu37lcPVd/pHwTwqVVPPm+YFP+dEYfR5ikVF6/bvGyR620sAwDGoCDq749T/TlLoGFKnWpLxvjknXN7yZ2mXDfX/1Zs6ZIjqwpr5hOptnTQTKOdVlVlVbt2P5t+C4n+hG1pn8uqWtP6uvikFSxTgCf+kmU24DaGKzvaCtT7zM7JxbP89LdukmuYHJicWreF4Jyh4An4nKNNVsmPa4OyqlaXHVKg0xMYUxp/KkUwE7R6Qh8zAglDBJ9zvFKOoYmgTXWzjhrfJNjvnXd6HNMlOwvrHrbt5aq0bbDtl5WF7SzbzBkzpwtU22Yi5XyKHLZ8roBab5NBsFwGYcko9T+E5+0M8m2XOWTKcnaXPFMGV+8vfhMKKS5gnD9Fhr7mheFsGJqTQrdqR5r8DEV184zMt3Sm8GQEbm8JN+EXJmFXVwWY1K9ZhWcHn6zrnwUt29JxvllllyWXy/9dPF0ByO57orZM8sqKTS0FvwStNDrODvZxVhVp9+XWucnf/Y8gFHxGW8rdcSDxmiKA+R05hEJAMIayMZgmBUYjjfzEa5SGCMfKCkWlwQAIzpATHN2BREkZlCdei+zwBWJD8CfeECp4Ap2BRE5yBII18K0d1/7XKuBpjKHD43MwGextZ3M5XbM2l1PYuGl0nBW8jVd9/3mKzK7faXLZfBqOe5846BsVt2ulrtGcf5qMuU7H0WDvL/+Yt/q45E2Tyykfp9x8xvkTJo4+oLTqjcdL6wBa4JC5DobIeGF+RIa5ERnmRrwwHJFBWJRhWEzkw1RbMimN8L1IeH71T3qR8DzFhVApuxW5/KL2Oyt42hVS2rWxf78qW6bgteKXzXw6yy9PhF5W/6QtXXEorZJulnBs+bOgTt+ekiejtx3Js4KrLQTmTe+QIWddadLYOwrlRLWSPDRWQSg5pnkCS6bnUZwIhOPKQBtCpy9Q0YThSMETHN2hj9gQirFGTlTXNRURpnkScwsBjoxHKCmDNsnBa2t9TXY2YgwwBr4/Y6aMgAhusCvrrEHSrH/a+RqkVQ0NQMnXoKc6UisVgKu9Dmy0Yorkb/inC0+rbee2+2NP7v20Gq5k6eiKW5gAACAASURBVJBll7RqlpPBgag4+unNy85RAMzKHc9+EdXvFaXyYRTvj8fHrzEqqu6+zogTwImMgakvr9jy1PmaOHoSit1AplapEydwH0QRQAcz9HDJk/xvt9cgbRxl+dYJ29JBLwtcvNMg1ZaYmjxf7VhJs6VLP7sKdZ1rBi68yRmWJZAdNJPM04g5GeVD5s/Me7NrEdl1h9w+bvcFZoQe2iSH4AzbDw1jQXsOAPD8yDjK2qDDkzgp7yEqGeQER14w/HGsgpGYQ08sU3b6ApWJr0jGmjCr4GF2WwDe8Hqxe+/MGuQECgt86e+sBsy0KafLRsnzzRyvlalDVmCboFl/vNpMVEIu50zK1sosYorDbb5s3hQ97j5/vmsvzCRNlx62DHalYjZfsmgkibd52TkG1a9GJmk10N/yliVFAI+2qF9SRwDApovOPgDga1Z7WvCxr8MUHVqwgwvSbPiqbWn1s33XaUsHbVe7LXezAPh/ypa2Ts30sMEV05olFA5Ut3dLNmQRSCPkbGfwoA0ZVzUHTH1wHABm5wOUtcF0X+J4pDHdFygqhYFyjHFtYKi6zVtEhL3D41jQkYMAEAoGnzEcq8R4briMnGDgkuH8nnb8cWQcc9pCdATS+uRAo1y144mTIGImYzuwrEDXzE4nZMfW+DJOVNPJcFQTYdnRJ8vRsvilDZS046yM3kr/VmU8kT5ZiadZu91m2+PVXtss/U+0SPnPYMtWgmGzANiKb7qSpQHAaxWla7ptM7Mznd234TjWiI6V1SGdsdUa0Bi4BAPmt+cwM1d9tbH2TvjPDw+DCKhowlCksX+kjJLSGFcaQ5HCsUr1uUyfMRwtxyAA0zwBjzMs6MghEPaU273lWxLKRKXnh1VtOp6ms+ucbcNUGzVps/ll2l8bwJCGqb4T3YxOFs2sfnbmT7OFjXciOqHJORfvZrit8s2i5fpf07NVW2bJn0anGc3/TLZMBtRmkBZwW01ezkBrf5fcViB57Cqfa+enCPKH974+uuJX+wYNUN8RPe2hdfsTEpoIsSF4nEOw6t3y6YFEpA3mtgUYiTWOVTiKykAR0B14KCmNsiFM8wTGlMFopPH9g8erz3aOVXD5azpxSlvQYAHXJyyICMQYOBBVjh+w3ye39U7+Tpv6JH+3Mj3iKfhNIbFBWZKHLbPLEdLkzJpWJena/Fx9s3RKqzqyaKfJVAPbh9PoptFO83cXryRPW6Ys//gvW746W6bJliVL8rcrvqXRavhtR/NkZE2ec3V2KZQ0Jh+N9cvHFRog7RMUylSfxRwYj/HEkVHsGynjeCVGXnL8qRRhRuiBc44RpdEdelg0vQ2nFAJ0BRIxgBk5H5EhzAwlhiKFuYUAO4+XQCCMRhqdvkRFmykPzLuqzSENHIv1XviLLPVTHdzOjLXz9oVw2dS2Z5pTNNjWoj+hEMDdlUuSfhq/NL3gwMvykTRIs0Ha71bb0vjY4JI565q47JV1jezrnaSfRjvNls3s+l+2nCpLkq6tW5ocafzT5OSuCjOt7LUrn7Tqo477SmR2vVLROCnxCVxXVaeJcGCsAg7geCVGWRscjwxOKQQ4VlaYEUj8bnAMF85sR2TMxNs7Am2SIzKEbsYQaYMj4zFKSmNW6OHAWAWXze5ETnLsODKKn/xpGAPjMd5/2gx0BtL5TGgNjkcaw4r+iLUNGwm77JTUOysr2xnV5QTNBhdScA1OAQevPTfo3jbvBGhmBUbXdbcdO0sXVx+XXV1+ZftfmvxpsrSSMFqt5FpJQrb90vRoxq9ZQvrPZMus4Gbzt9uSx2ljOWuMA6hOydOUSguQaYN86oWrjO988fho8Zx8Z4E57lDXBnb10xMxCp5Ad87HiCpjtKLxGt/HOZ15/GG4BMEZnh4sYml3AQaE2BgcjxQ4gIIn8ZujRQAERYSZoYe85CgqjSPjGvOmBcgJDp9XP83bsBPIFJmAl0fHo+HxytMOg7WSuVwDxbZRWnXQDNyBOVc7rL9LnlWhpA0kbp1vkGnbtm34/e9/zy+44LW46iqAsRXNgqJLdpsXtmzdygFwBgajtVm5stdlkzRZa3Sb6ZsmT1qlY59zXV/bjq3I7ZLJNciTMmUVJg397unv5xJMMsYMCKav7/89W27evIV7vsdLY2NmzZo1J2rLrGCfJm9WTHMVCFmJxyT3w7QFdf12GWJKFK71VdIfeSHST5SJLs1Z64TJO+RlTQgFw4FiBXMLAR4fGMUZhbB6x7wg8Zq2AC+PVbBneByDZYUz2kMcq8To8CU0EX52ZASvlBUKHsfFJ3WAUXWHoz8Ol3Fme4hlJ7Xjx4eGsWh6DscjhZPz/hRZascE4IXIPHO8og9iqgNkVYSuaqIZuGxn2zTtAk/+ptrrkA0PradelyYyONuHh4dnnXra6W89eHCIb94Mtal/y8R5AgGGTbw6yDhT5fL4D9b+1V/Z+2Q69dJKLQ5zudul8GS5XLoTwJMpfVqttGpQG6Sua9bKgMs6l1aVZOGmVXpJGmmDNW1wN9DKBcH7GeEzAAbJmA8BOJDS5/+KLfv7+7s8z/us9Lwu6QX9qD4CdiK2TOJk6WXjuMaOza9ZQDWAez9MF2RlFpegHAD2DZfU7oHhHx6f3bE8DIR0fV+ndnf8pJwPgEET4ZS8j1fKMQoTr0R2+QJDFY6jFYXhuIiBcgzBAUNAIBj+OFLGjFDiop5pECAUfIFRpes7rR8ai8AZsG+0gqNlhbM7cqkbgZQJ+N2RkZ+9FOkRhz3SHMNV9mc5v92n9ruZA7r7JHVBwxMBWYHTFfDTZIbWtKgtF9xdAQoJfAD162kYGAyZiHN+Jqrvg2fxrdHuUrF6p9HkG0NbMdWWzezmasvS2/7tCj4uWq0MbFcwaZVvsl/tuFmSa7AlI7yBc74AgNFGz0V1r1Kb9v81WxKxJVJ610eVOAzD4Cgmn5l1gcuWLjiRsWf/zipOpsgPND64niWIS+Cm1efu9y81p/7w2Ud2FeNbTw5ETxI5+YaNZAzPj5QxGlc/enZqIcBCwTE770MZQl4InNIW4JS2AM8Nj+OlUoxT23wUlcbRssJbTu7AzKD6SOn+YoRTCj5OL4Q4FikQUX1PzRmhh4tOaq/zd8Gzo1G062jxG8+841zXGz7NHOfV4LYyIJvxqV8LBvfjW01kTKuKE0ERRghR5IJXv1xrTKiUygOA9LwiZ8xU+de++V3t39/fLxmTkkhxKaUql8tqzZo1CT6MV/cUMCCQcwD39/dzgEmAc0BXN/vt63Ph8m3btuGVo0clAVzHcbR27Vo7aNWP+/v7ORFJrbWRUqbRbKXqSeI2tWWT31njMTN4xbF60Pc9ENHxKI6fSaFRg2ZVYbOAnyVrGvxWafUlxjBHa/XtJrhZtjxROBFbZ/KSKe1p04jkuaxMWe+vh8NdTw2MPLa0M1zRmeCWrDYZY3h2uAQBhj/rqe62Pt2X6JwIgn84XsKD+47iddPzOLUtwLz2EAUp6nfWBysK+0Yr8AVDXgrsL1YQcI5500I8P1qGZMDZnTnMLQSY7kvnI01EhHECfvXK6FN/fPHlJxN6JI3YyrSklf9Jmna1kDYwXFkSE8LXDgA0PIdp65Amv4uPhUtPVSrlKypRJBlBAriSc/4ZKSWiSmUNY2wPQGCMG854EYDp7986mwlcLzh/LeD5ADsahLmH1q1b/7O1a9dMSUjcIcPGjVu6hBTvAXDRRNA8TKCH1q1b9/REMKzbcOvWrV0jI8WrPc9/I2MsJOn/bvOWrd9a2XvT3qT97rrrLj6ts2s2GLsKoNcLyYsAfn3PPZseueWWVUM1Ufr7t3Au+IWGqJOBHSCj9knpXaq07gEoMkSPDg0OHujp6ZGM88Wx1kuhqWiMeWz16r7kkg42btnS6TEx14BAWu3p6+srA9W14aGRkYUcQgrBh2644bqDALB+/XqenzZtrqroAhEVSdB+yfmCqBLPEZwPjY+P7Vy7dm3yLTRElfJhFasHOSfleV7RtmV/fz8453M1sfkgI6Un92uiPX033TTFL7dt24bjx0cXcMHCWMcDH+3rO/yFL3whLBQKnHOuOjo61IoVKxp8tb+/nwshzjCM5clQlAv8fddee239OZlVq1YObtu2bU3KZTcA+Pbt2/Hiiy93x3FlFoDDq1f3uXanwrZt2zhQHbfXXHONOX78OD9y5AgWLFgAznlmpblr1y6+ffv2/Jlnnlm66qqrUgOkMYYn4tREQeCeliV/u8A14NKmD/jIz59ftnLRyd+4aHrY7QpWh0oVMLD6Wz5lXd1MoxhrlJVGIAVeHqugw5coxhpFbXC0HKM79CAAzAgklCEcKcdgrBp0O32Jo+V4Yus3DgaGPUMljGuDee05dPhiSiX2zGhU+sIzB2/48rJ52xzGbgXSphFptFppdyWtRrpnnsk/cul75r/j8iuWXvqWZWZGR/AIY8yeEruydSuB2dWf9/f3f5gLsVVKz0SV8lv6+voeTyJv2br1SsHFRiKaSxNrrARAClGK4/jvx0tjn1m7dq3Z1L/5rUKI73HOfaPVu3p7e79b47dl69ZLOOPrGWMLJ3aRBwAIIUZipT5NWn2xr69PrVu3jufbCpdKKfuNMXV+jDHDOR/QRt968403fhUANmzo973A+7AQ4rNkTHcNl3OuALYrjuNP9K28+UcAsHFjf6Gtre2bhszyOI73AhRJ6S2qycK5OFqJyqt9z/8AgKuJSIIxcMYORVF0Hcg8VqtaN/ZvXpHP5bYCUKWx4sWrV6/eBcCsW7dOthXaX/Q82U1E915/3bUfA4ANmzYV2ts7vqHi+JIoinYJIXYBuJpVP6OsADwVR+ojfX0376/Z6777v/TfGGOfMcYUoyh67epVfYdr5/r7t8yXvnc7iN7NGMsDgDFGMcZ/FMfxp1b19e4EqkFPSu8SxvmnjTHnc845ERWNNt81ZM7jQnSpOP58VCl/ce3atQCAdevW8cK0jnczhluNMYuFENIYozjne+I4vi02+pE1fX3qnns2zA7C4IeM8XwcRV9Yvbqv/rHBbdu24fjQ8FWe531MKXW+ECJvjClKKZ5UsfqcUvGO1atXKwDYuGnTeW1thS3GmPbyePmzQei/wRhcSqRDIeQ+pdSdvTffNGW6v2XLvedLz+vTWl+ijSlIIYqci8fiOPo8Gb23r6/PrF+/nkvPP8P3/RvImOWGaDaAQcH5zljFP3YNIrt6TA6YtODoqlTqdPYPFZ/6yaGh7w7pqW/bjMYaI5FGhy8QCo7hWGFGKDF9IjiGUgBEmO5LxIbwUinC0XIMZQjFqPpZi93DZQzFGieFHpbPasfM0AMHMH0ikA6Mx1BEmNdR/fzFgWK5XmXW/oqa8Nifhne8MDr2CKYGLLtqS4JtF1e5b9NqBnYisv8a6TYEfrKXG2w6aQkxLaAmceuJwLGgUcfdtKn/NM74nVrr04wxuwF8nDHWC+BfY6VCz/NW+kFY/bzFVEIcADZs6u9hjH/eGLPIGHMAwP8Aw2oy5kdxHLd7Uq41xM4FAN8PF0sp18VxfJrWetAY83Uy9BWt9cE4jmeBcMeGDRtnATBC8ssZY1+Io6iHiAa01j/QWj9mjCkpFS+WUmzduGnTaQDAOYfSipfLZWmMWci5OCOKoj1EdFgpxaOo0iO42Eqgd2utDxhjDmilEMfxHM/zPmMM2mv6MJCJ49iPoihM2JMDgDGaR1Hkq1jV7c8Yg1JKlstln4gWA3g/GDtKRMU4jkOtzTIu2G333LOhtiGJ0VpzpVSotW64mbuhf0OP8GQ/GfNhY0zeaH1AKbWPiGCMfqfnyTvXr19ffXiE8Qu4EFuUUpcQkQQwxDmPGGcfBHAuGTMbQMH3faC6XIJ8vvB+ztlGpdQFjDFjjBkAEMVxvEQIsVVwvrQqi/CJ6DSATiOGsOZTmzZtwfDwyArP87cqpS5njBU45yMA2pXSVwohHuJcvmfdunU1H/ONMXOjKJrPBf+c1uajxugFxtBpcRy/VUi5fmN//+KaQ61fv55v2Nh/CRfiIa31jZzzWYHvSwCzlYpv9jzvn4QQPQC4lHK27/vfUEr9jSE6XwjRSURLCLhWSu86e90sbfAj0eb6bdNpGNQ/f9frSrsGxz7/6MDYYW195vaVcoyc4Khog3ZPoCf08MzgGF4cLePMjhy6Qw9doQdPVL/Scua0EGd35DA774MAlLXBgo7qFH1hZx4zQg/HK9VNhkvKIDbVnY0OjJYxWFGYlfMwEltqMIYnh8qDvxssfe7nb188ZOmVpnuyPa0aTEsi9YV6B25Wxd6MPoB6MmolMNuypa1LZ/IlG5exK4025wIwWqnbS+Xo6+NR9B2t4jsZUFZKdTNgCQBOExseExEMUd2WjLErQbSYMVZWSt0ax/HnVBx/Wan4BgAlpdQsAAsAcM/33qeUWsgYM4ZoDRn9l1FUvk5rvToIgqEwDLsZY+f19/fnOedrjNbtUsp9Rutr4qjy5yDzdmPoE5zzISKayzjv+2J/vzTG1JUTQgzGcfwxreKLtVYfkFLsmvDhgtbmXqXV22KlruCMPwIASqmljKNh3R4AjDGGiMp2exZwzpUxenNULr8jjuK/5Jzv0lpBSnmJEHLW5DVxfzFUQF4NoguJyDCGzVrry1Qcv8Vo81mAQQhxoZBy8bp1/VwIsUYpNR+A4YzfEUXRu8rl8ruI6O8YY+XqvYfJgqdciQqMs8/EcdzDOTsURZXeSiW6Qit1kxD8IIBZAvyaL37xi2CsXqAYxljitWPTw7j4bBxHPZzzfSD6WKVc+XNjzK0ADsRKdXu+9ynfD+dM+AaIyBhjwBjrMsbcq5T6GGPsEQDQcbzAk957J+0nOoPA/5zWei6AnVFUuaE8Xn6X1voTjLGjxpilytDVX/ziF0GEFcaYxQAb1Fp/qlypvE8ptQZEXzOGvm2vYWZND9PW1uA4N2WwPnNseDfj7PYF04KNr53m1/kOVRTO7MhhNFI4UK5uE/bwwSG859QutPsSQ5UYwxWFuW0BSsrg8HgMQ4QZvsTpbQEYZ9AEnNWdg+RAMTYAGGblPShDeKWsEEqB6b6ANoRhZeofU6tVmS+OK2zbO/APv3zllR0JPdKWKprZAZga9NLAVf3Z9F3LHmjAtW5gTW566+SVJl+zqXgS6niE6vwwiSuld5ExWhptwDj/p4ADjLGIAK61zjPODaH6OGxtemuMgdYo1QgFgX+xipVvjDFCys9zxu6kqnJQSuU554oI4V133QWALgAAxtgeIvOtVX19EQCsX7/+Z3EcfyyK4n2MYScRO00IsdAYY+IovhswO2655RYDAJs2bboPkG9mjH04DMOlGB8vUPXmlS+EgCHz2Kq+lV+eEO/x/v4tP5BSLhJCHqhUyutX9/UdAID+LVv7OWOXGmN8o03XpK0mZwFCCPeWgZModftyzkGEJ2Kjb12zelUZwM7Nm7ec63ne57Q2PWCsXsUi5Z6EF/jv0Er7RLR/TOtP/nVfXxEA7r5704bCNP9NWutnALZfSurUWr+VMQbO+XfK5fLfrVlTnQbfc889B6UX3Mw5m1X9enE1KQe5cAljbD4AozXduXrVqq9Vad+9x6Pgdblc7ryyKj8XBAGPGzazoZq/GC7EJYyxMzgXRaX0x1b19X6/bufNm3cLIf9NKbWEcXYBgAO1HbmEEIYI/xir+LY1q1dH6+6556u5IPwDGJvFOF9YN6sQS40xFwCA0voRMkwxxmYprY9yYw5IKbtBOEtKycHYycYYAJAMLOSgUhAGX7n++us31QROQrLKcVU69rE9sJMXvOFv19VL8dLw2Je/eeD4V14s6/oYiwxhKFIIJUdX4KGiCZfN7sDZHXnsHirh98dLCATHUKQwGimcWvAhWHX39V8fG0OsDc6YFuBgsYwXR8sY1xrTA4nBssJopBFrg4Ko7rz+QrGCyBDOaK8/6Y2jivDQS0PffXm09MU/vPuNtUX0ZJJ4NdBK1Zk+xXZX8mlB3DTZWTyNlguaBdUk3zqwxnMGoNo0UQVBsDcMwz1BEOwPg2BfGIbPtLW1PQWw32bIAc74xFQWxve8opSyLKWMPM+LgiDY5Qf+bsZxlDEmtTbVSo6xkUTu4DNnziy1Tyt8tffmGx9ftWrVCIEKAHzOGIjM4KpVq+r8V61aBc75IcYYQBPT6AnFJm5MlhtsV/3wORiDaTCAUYcwsVMU5/XNbRqWSZSqu/9k4iGCMaY0xbaMAUTFmdOn14KsYZwXqzIBjNWTo+GM51BtN8lq02hTq8wO1YJlVdbKUKzUh1RMd6zqW3mQMRZiIugqpfZi8qmFiZchJmhSIikbOg8AhBBDhvTTNfyTTjrJGKLPR3H8IQV2b19fn2KTG+I3fFRuYpoO35f7Denkh/RgDJ4kwlHGGBdCnFE1fdXgQgiltd6+ZvXqCADW3nLLkJRyF2MMxphZNVtKIeZwzmGMge95t+Ty4T+HueCf87ncg1LKJZwLMAbEcWwI9G9SeiUi6mSc3eH5/sNKm1/df/+XPt+/ecsc+znMBllrytsX12rPujnSEFB3vPN1Uf4HOz/VGcjuvzh1+ju7PY6T8x7+VIpwdmceM0KOnpwHjzMMjEc4PB7j10dH8foZbdUPnpUiHByLMCvnY7pvMKctgCLC4VIEX3BMDyQKnqi/HtgeSHCG6o2i2EBwhkWdeciJjTGPK4NvvzzyxE9efGXtACtNuauY0NtVdbZSgdr4duBzrQG7qvW0Ps4K0zEldwXwrICeVnnWcRtXTRtxiWgXgKuFEGa8NP4xxtg+xpghAjiHr7WWIHbA4tvwKVyl1AAAcCFKpfHSGkZsPzHiHBxgkIwzn3N24PTTT1ejo2O7DZnFZMxCwdmc/v7+/X19fVixYoXp37Il3795M/pWriyD6DARjRhjZgkp37Rx46avr65WbdiwcWM3VaetMGRGGKBM/YWAKbbgE4a2VeANLYnvCNWmsFJKTtXBfBAAvCDMo1YZkvOxKps/wCaDcO1LoQBMdXlj6hdDGWeDpAlE1HPfffcVbrzxxiIAvnbtWnPXXetKyMkJfK0Y88yEnF1I6E+WbAnDHAUArXWBEeYCeAIAJu6gFxOonDEjGRM105Tr7WBFADCG8gwsuXs/qsmXwgldRwDwhv0gGsWZrMyrvBuAMWa01o8bY4YadOEMRPjN2rVrzaZN/Y9rpXq5EDeQMecSUacxZhGAhZ7ndac9h+laz3Lh1ITNnI4n2x658tyB/KO7P27IdN00b+aFp7QFkJxh78g4hiIFZYCZoYdQMMwIJC6f3YmRSIMAzG7zYQjwOMO4MvAFg885xpRBpA0kYzhcijCuDIYihf1jETp8gWKs0RXI+sfUAGDMAN88OPzbh/cd6X348kX7EnrYNnBV0WlBzbZN1rTYxk3i2FWua21xsi35iFbjgHEls2a/7XZbryk6sMSgBQCt9Y8D3/9oFMdd0vfuUHH8OQPaCYYzfM9/n9YGnJtP1GSuy87Zkg0b+stE8rdxHP8wDIOVcaw6PSlvU8bcxrQ5aMh0BWFwTRzHfPDY0U/39fZiy5Z7fw7G3k9E7VJ6W+JY3blx48ZdXMqFUng3cMaeBfB3UVQ5JD1vB2NsAWfsWia9wQ0b+h/iAqGQ8uMgXFB9TCr63vTOztLg8eMFMFR3b69+QdKpv7XLfV0fIjbr7rvv7TzppPahY8eHFABljAkZY70bNmwckFLmuZCfMEZ3AwDnPL9+/fqwo6NDjY6NJehP+VRwDThjjN/V3y//ZmIZYoK79DyPP7xuHX/72rWGjPktES1njJ1mDH3ygQceuPO6664rrVu3Lt/eMf3qWMeHATwax3zI89leAD0A3iM8ubW/v/9JBRhOWMI5D6u6cc50PCEye3IimPrS8/r6++99rK/v5sMAsGHDhp4wl39rrOLv9PX2loQQk4JzVrelNmonJ26UUqdJKfvWr19/25o1a0obN24pSME/SUSdXIgRFUe7YPvr5Mdkkdaujd7PwEx1eYO+3XvzTf9YQ1u/fr2sAN1ENAAAlUrZaK2+K4T4uhBirlZmMRfiNq31ecaYv3B9l9wVDJLgqizTAofd3wDAS0PFfd8er7yvqND/4dNnXHVqzpezc9WbOLEhDFbUxFRdY0xphLJaRI2q6jdkiarfJh9VGtP96h1xTzAMDSuE1ZkcOnyJrkCi3RMIBIdILFQfVYT7Xxh89BcvHe09WBrbn6Kja+qatTbpWqZIQlZCsc+nBWBXn8mqr3pkJhzYVeW2UsmmQQMdQnV9jTNe+xxtnXYJtEMo/QXP824zxiz3ff8SpZSRUnIixj3POzSu9AMAngbYkBCiFEWRL4T4Qltb26Hi2NgVRqmfKe1tllL+ldb6csH4WzUjSCkAQIZheKizq+vbAJ5WynzVD7yLiWiF1vqtUorlWsNIITlA3BAd6N+y5Ut9vb2HN2zc9NkwDM/VWp/POPtbz5d/M7GWLavrovT1zo6OL11zzTVmU38/B+ADAKvuvN9w/R1PIxgAhjEGrTU45w96vtl97NixNwN4UohgbxzHixnnNwvGrq8mOpL1pzUYuzEIc1cOjxTfy8VkBc4nb5BUrw9REQCUUu2e531jlid/AGC1MeZlVN/0avd9/+cvT2v/FoBPxVG0Jczl3x3H8Rlg7G+jWP3F1vvuH9TGdAM015fejv7+LU/39fUObd6y9R+k4OfGcdwlpNwupLdXVPmea4yRxhhwLtYIP/+GTZv6b9XK7PdC/2sAPqi1Xi6k+Pet993/GMAKxugLGGMFBvbnAH5EpCMGAWOM5Fysvf+BB15XLpfvJENPcc63aa0/COCv/DC8aut99/+WgMVa64Wcc4BoG6u+NguqVpySMWbYhC3qwGrLG3T+/V964B9UHH9DafV0EISPKqUu5Zx/Zsu9W89RSv2QczHHk/Jthsx5SuuLAOxva2ubz4X8OQiPVOLKLxhRiQmhJpZlDtrv7CkgXQAAIABJREFUkqdNxVzTQ9f/rMFX//2bq5eak7/81IBkAzdpojuuOLn9+td3hIWAAz5H/V3vuW1+tXqaWoJXHytSGgADZ4DPGSRjEJxNiUi1QBkT8FwxKn/v0Oi3fnpg4BMvHi4d3nXt0lbW82ryp9kqK7jZ+MnKNY1fmh3t6XiSHgCW/AgarPOtzBrSpuN2YOWG6JAx9APOjWEctSmOAYD/1tdnNm++9x8B7ATQyxibHwSBVEpFxuhnjGH/DMZ2A+BS8J0AvuD7wYeIDFdxtJORKa5Zs0Zt6N/8We4FvwfQ53neLCklB5jRWu0hwj8DfDcArF69cmjjpv6P+76/RwjxHs55QQguAVbWWu8C0YPgfBAA4qiyX3D+Iel5t3HOlxFRNwAFwmFD9FAcR5tuuvGGakAEjOd5BxljnVEUDSZswTnnx8Mw3CuEPFAujycXJfczxr4bBMGVAIwxZmi8FMHzvMNRHN8a+P5njDELQQTG+WCs4u9zxsvCE9cCCBljoZTCaDKQnjzKgENxHI9MTHEBgGuwxyRjv/V8f74Uootz4aO6jLEjn297Rik9n3M+Wxt9RvUB9OO74zhaI6V3GxEWG6PPMMacITiPABwkoqdqM24Vx98V3L/N8/xPGDKzATpXSm9EKbVNCKGEEB/UWvcwxpYRqItztrdSKX/SDwLJOb9cKTWLMfZBoLruyxjbO/HsqAnDYEBp8zSAZUS0mLSZw4ndTTNooDw4/skwyPlEdKkxZgGBFhARPCFHDJkfGKPv6Ovrq90U5LUXXhhnSb8EA9vFGFtORN2Msb9mXPzKRJXHK1H0iTAItmqtlwC4OQyDDxtDviHDPc8bMGQWAtivjFmYD2QhiqIP+57/wYlpvC8976jR+rN2hdlsvdI1uFyDyhVYGgbdn65dav4EHI2//+wnDxXLv37hNdM/fflJbXOnC1ZfB6q/hYPEtnATxx4HugJvilD2ZhoAYIhQNMCPXykd/OmhoS88c3T0vp9csches7T1cgUYex2xBlkVnd3X7pM13XbRzQyAiVcjs6bkSb5pidGWJYnL40rl0ekdHY8xztB2bc6gr5HWypU3lwF8p7+//weKsR7BmCRCFEXTBm655YN1mVau7C1u3br1fzLG7ouV4uNjYwMf//jHFQB8tG9lcd26dV/1vNy3GNCjlJbgUDDm0KpVq5J3ms3EQ9p33HfffeujSqWTQD4XoqiNObR65cr6IywTbwftX7du3eowDOcYwhzOeATQ/nJ5fGDiYWwDAIaoGEXxGgPjk2LJSsYAtKEcVb7icaMYUH8b5aN9fUfv2bhpdT7MLYnjiiJgv9a6dMstt5i77rrrR10zZjzDGFsE+v/be/8ou6oqT/yz9zn3vlevKkURy3Q6nY4xhhiRFhqRQYS02gii+FtA5VcwJJUQbBoZvsiXcblYGQYdpTFqSFUFRH7YShixRVpbtDXSNI00RoZGhHRIZ2ImHWMMlUrl1Xv3nrP3/PGqKrdunXvfi6tnrZmxz1pV79579tl7n332r3N/nANW5/ekaXM7M1tQ/E0CaqmXfer9dmVIo9G4zieub+Le3ZR8m4ejXbZbPqCQxYkXIUp3AIBhfjZN0wtFdJEX71T8DgCYeHn+kU133vkUQCeJl5PZUOy822Fhn1HBttWrB1oyv3J1Y8OGocE4tj9UlZNUdQ5AT3unT4F9lcn8CETznXdbReS5NVdeCQB7bh8cXGnYnGqMPRVAFxHSNE23OZc+PvLSS7sBYPny5Y3B4TsG4ig6D0AtTZNtxpq9V1ywCgB2b9q06XIBLbPGvAnAPGbeLV5+0mymP1y7duphFROwQ0VuBpNV1d3ZcRkfr3+mWu36FYGOU9VdKvrE2rVrAeCZTXfc9QEiercx/Cci6AehDsXW8Ubjr2u17qcAgIgebTYblxtjXq+K17X0iJ/z3n+7PnZoS4bWNAPK/uVL3oDysCEnk8c9o+2bv/eLedc/s3f9w3sP/Wa/E229rtYqk8ciMu0vX0J1I070h78+fOjGf9p711mPvLCogM+ijK8Ipqiv+bp2Mvxt66YfH3ccX7LmuiWbH/rbj/xmpHGBqmZfNSmTfRHuzuiG+Q31O3Tejk4RXCdBrN1YtqNVNM6d2EQ7+kc7Bv8uy/Y8hs7/rQsDM1crKstmykqoTZBgACcDkC3nvGYPvvfz6/7H6Pidj+4d/fBpc/vev7RmFv1+LbbH8PTFOrJf6YTKmAB7xxP5Rd3t/Omvx/7mxdHG3f968OAzO3/9q2nf3ub6nO9/KDNuN73NXgvds8zLMpTRld0iCN/+mHpaO5VZZksRr6FZQRHdEO9ZnvM8lsHkYYtg8nTzcGWyDOlt0a2Gybp2bdrhKJJlkf3k24b6kL8W4inEy/+rskTuekjfyuy3E19WCm8xc0DyxtVumpZvk3caISaDTG8557UOwDP9D/z0ue1j6aZ5VT7tD3uq5yzosqf8YW93/+9XqKdKiLuYbPadjaaINIBkX4KxXaP1A7vqydO7xpLv764nj247mOz8p/OWOpQLsEwZ8zyHbjuE+pV3bGX42znOcgX6pXLuaifKWXY933ZGm6Gh4V5iXgDVeSDuE8E+qOwkS7sHrrhi+kOKifKlO++MY9W5pDTfOVdjww3DZpdzyb7cFBsAZHh4U48C/YZJnPN7JqeNWdyDg8M1E9k+Fe/SJNm/du1ah5zhDA9vihXUDwhENEmajf3ZqffQ0FDNRvHsNJ3OguKIlrVe5jZu5RUr9m7YsIGr1Vp/mqYxSDNwLKoiIG6dqzSazcbo1VdfzYODw7ExXHNOpLu7OnrppZdmxzivSyGdLAr0ZQE4dL1je8T0sQ/RK3LsWad5tKWon/lref7aJShlzrLTpBDZe5hFgiiKRkXZVFFdEd4ZZf/5r3cPttby24nvv/j1P07G++Z2RQt/r2IWdhPmHttdfaVhtgDgVeVgvfHLMcGu/Q2/e0/D7fjp2NwDuGBOKNPpNALlB6JdFprvT5nilg1otm2ohMdivHVCrX+TT8nz8GXRuIjWjPqh669nvOKVp0ZxfJOInCYiva1VihRRHO0WlU1Dw8OfHli1atoGchs3bpwdga4x1l6QpulCNq3tUYw1O4nj72zcuOmWNWtW7s3QBhs+m9lsNGzqIs0BAI8EeHx/pVK5UUUOOJEL0Xq/cZoRG2PPiyvxZ5xzsNbsPAS9BMAkLShwXqVaXccTOhUqE7Oa/QD+AzP3VqqV9Wz41ByYU9XGxAIcaDYbjzHztQAShb49juNr2PhRABfhyHuCIZ2Y4h0z9arMhvIOrh1MtoT0stNMt8wxFjmyIl461csQ/ryjLrLxPP8hmwvSzytIkbcuQj7JXL5dJxlNnkY4S33bq+RnrcVoDwDYevzmf2SKDUzr8yU4y1Dv8Yv3vaGd0y4agE6icp6vEK6jjdpFMCHH2y4zbRUKfE3cHlc7Bz1Vv379eqaurvfGlepdzWazl5mFmQ8QUV1VZqdpOt9aexOzqXzpS4M3XXXVagcAg0OblsZxdJd4OTVNUxBRYozZLyI9zrlFAK6KK/as4eFNH1i1auXUu3beS9V7mZNoAhtFQ0ObNl00sHLlE9N4J9SSZnORiPRS68uaaf0ZHh7uFZWV9Xp9karCOTOfyZwN4J5JGCXq9d4v9t4zAIgIJj6PgzEWRJj4RFEnF87gZrM5L03TRROfEc4QnLY+adw18emnAJiTpOnpIlJ3aVI0Iyuyt050oigjbecYQ3TK9K6do5nEm0/CikqRr+lM54/eFstsLs/zDIduMw3y2VT2t8yZdJp55tvno0yI+awzZgDy3AVvCEXREI0yPvPwoShaKrgCfkPnWXxlkbiMfr4+B0OY/LiHp8PlM41OnWOQ3ziuLI3iyroJZ7mPiD6TpO47DDSIaQEz3+y9P8Na+xFj/b0Atg0NDVWNNeu896cSUcLEXxfRu5Mk2cVMc9jYS6B6sfd+qbH2s4NDQ5etHhjYP6Pj3i80xt62YePQ+YcOYvcnPjEgt99+O6P1niSrqpCKQ07+ojg5Yj7Fey8A9qnqXGvNhffff/89F154oQBgAp5V1S9NLUOnegqA05g5UZWvAzQ6sdDDtC9EjDEQkQcJ+GqeX0Jrmbe+vr4EALc+V5xRQllaSNfytlA0Xp0cF+l1SDfLdDnUj3Y6VkavnfPN81OU3IX4CGXM2etl/ZvWt9CXPmUDVuYQ20WlMoMsc2ydOLM8fAhPES9FdMv6EIpIRcpV1LbdIJbxNoOGYYCZACKH8BgUlTIDmMa3jaLznHNLjTFw4j/lvXx5beu+ogDYOTx0x41s+fvMPDeuxIuHhoa2ieCMiPks57yA6CvNRnrtVWtXTU5Hd2zcuOlpG/F+IvpPInIWMy8D8FcAWu/fTrwipaqiIqdUK/EGe2x6PoCGMQYKxJMPAGl60MenBz/N1toPqOpsa+2zzrkhIroVwBkjIyOLAOwAIKtXrXoSE3sJDQ9vZFX+/4n4NGPMWOLSm9asXLUzg3dKP5gZovL8FVeseBBt9E9FgSMfuoTgygJqkZMJJTqh4+yYFjnUEK2ypKTMkeXpFfUv70uK/EIepqgudJw9L2uTd55B2Px7mJ143+xvFq4ss8z/FtHL0y3LGvN0ipxEu2hW1JdQ/0Pti64VDX4R7WybEN4iRZeJVdYBgCdWknEZuDKei/gKwjHRm1pbn+ueZHz8vj87stEZALAX/wy8fj4ReUFEnmYiGGve5pzrJeJ9Lm3ectXa1dPef12zZmVjcHj4i9ZGF0N1IZE5B8CDAECGa1CAmfdBdTMRrxKR86y1n9qwYcM6HPkeGcDUe7dTcu+m3nkA3gtAxPuvEeEhZl6rqktF8aH16wc/ffXVq6cFPRECCBERQQHOfE8+w1C1tWjB3KGhTSdn+bCRRdJ0u9asWbl/Cp64T7XjrCrkTPPXQ7ZalEXm4fJ17WyxDG8nCUz2PF9XpvPt+EdBXZFTDQWDvIyLaDAAyTcoMrBQRhVipKg+hK/TKJClXxahQqUIPt/PEC9lTrXoWva4KErnYfI02/UxoNwT32NP/ZuGM1+KFLmU7uc+97mac25pa2pqtkdxdcaTcGaMJknzxvH64a+sHli1W4g4iqP5ACDiDzDRnkAfhJTHDJunJ1bsWfDQQw9N0CYLtB64ePGfhcogAKjqf4zi+IpmszntHnzmhX3cPjyMCPa9AOYSsJdFNkN1t4h8R1URx5X3RJWpHZezAfJImf7q2gxZOufAbC6NK/GPs3+VSuVHgLx/OnTw7nJRIlFUQk6hyOizv1m4Ir3N85H9DfFbZlvtkq+83of6XGSrRXBFtLIwRU4yW0oTtew9zBAjZZkgEB7AfFZVlIGWOZN2ginjF7nfMgEVZW15Gu0yxVB9EWwef55+JwEnd30iC+LWIssBGvnzsr4G6XZ1dU0tKwZoDaTZdgJABgYGJo8ZmMrAJvHYqa/dczqjJABaD1QISDKZYqZQI03Tz0RxvEhE3m2MvbHa1bXTe5nUYZm4T9nKBFJXjbq6LlRVq4ofzCLsuHBgAEPDm77FbFaJ+JOsMSdh+s6FM+SQ2cZkqi73/m8ysfRbtpHokWVCZ+hzoH/t9CuLpwgu5FiK9LKdU862DTm6MryFsiygX2b/R+OXJktZXVmG2UFiAskDhZxdtkG7TDIk5Gxd0W/ouCwLzPLw2ziaToQV4ruIRll9YbRCubzzsEXnyGaYZjpckdzy+LKyDBkC1q5dmxhrtk2sNbhYjyyOOw1uaGiI12/Y0OKHSJIkeQEAjLWzveiSz3/+SzOyKhXp996fMvHEeed73vOeGXhVFWvWrN6bunRtZKPt3vs5zOY2QP9ocm1GzazYztYcr6qniYjz3r14QOmtGzcNnaYqNSLsAGBV8eHMtgchI5NM1jqFO7NUG0Tkvmaz+a7xZuNdjWbjXeON8Xc1m433EPBwpo/TMrIczvw4INMGufoiJzQtcAXalQXxThKNEE9lepm1yaxzCvmPdsd5vSwqoT7mz0PB6Khs3WYAijKkbEfzx8B0IYSYKcKdh8nD5ell2xdlSGWRKT94efp5XCEei+gVwRYpXUjGoWCR57UoOk40YnhMy4hCgSF/XBSNs3gAQNLUfdswvx9AX6VSXTc4OHTt6tUDY5PtNw7fUzXGXRAr6rfccsuDq1euxMahoe/ENr7aOTc7iuxnoeYyZN6B3Dg43B/H0S3e+35mM5qmyTcn64jQM3WPYcJJrRkY2D04OHhhFFe+6ZxbxGwWTb4CNFmGhoZiYrNCRKyqIorjm7Jfh3nvW4vJxvFbRapLADw/2YeJe5dTJbDy0xSxiQUg9q5aecWTBbLGket6jKrk9S5TP1VC+llUV1aCGVIGTx5fSC/L8HSil51kiGX4y/Qy1Icy+Cz+SdgiJ1sou+ynkaGBziMq8vahNL6oLs9gmZNoZ+h5/ooGMV/aOc0ixSxK28tgQ5nyjCyrAEdRCeEGG4K1FBroIgPMXwvxNgXjRX4QGfNDr/J2Ubk0iuKFQ8N3fEtEDhjDc5ncOQDOqFarO/r6Zm8FsEOAp1Vxj7X2Ku/9WVFE3x6+446veif7mLnPGnO+iJwxMdW/T1SeOkL7yCrfmTUhmYiediLXGWs3ujSdPVkxOVVWpUXG2rPT1p4ITzrXWpxiqihiIjrPe7/AGvtWtBzmER0Iv8wa1CVV7R8cGjohf51aK3yPMLB7YvELnoBnBRYNbhwam7itARAJkRHv3L4rr1xdR7GttBvHTmCKxrpIL/N2VKarIecbgg/Vd+o7iuy5rISCRVEpxZ//NDLvdcsQFjmuIq+db1vGaFnEaZdttnO4ebgiHosysdDgljnlEJ128JN0O8UN4Mh6mIF2eZmEjDF/PkN2a1cP7B8evuM6Y02vqp4qKmcR4SxjuDXNbL3g3RCRbWAkALB2YEA2Dg7dXKlUeowxF4vIKVCcwtx6d1RU0HrfUR9Kvbv5yjVrjqwKREe2I5jwLQy07pVuGBp6iClaaK292XtvVQEyRjZv3syjh8bOFpGFxphR5/zKY/uOmbbtwUsvjcRRFP+1qLxVCed/fv36O/786quP3IfMrKResD8SgMmHPnyptfF783XMjGaz8bCKrM2176nElW8SkGT9MhE3xr37JCZfqSrWrTL7bJeVZduX6X5Rm3ZOp50uteOpE9+RLaE+tLPPsjbtypE9RwqQTP7mj0NZU6hNKLKUMReimaVTFqk6iSJZ2FBUDR0frRKEstx2cKHzkEwL+SAwiBjqNSGaWs06JMfJNu3wh/iQVauueG68fvidAK6LougHzLxn4m+7MWaz9/6ilw4c+PCagYHdkzjXrB44MPLSgY958Zdbax9h5r1ENMrM+2xkf6Cia8cOJR9es2rVnixhJqobY/aY1kvy04L52oGBxDv3eWYejKN4jzFmrzDLb37zm5qqnsNs9sZR/FcE3XHBBRfIBRdcgIk/aTTGkyRp3svM+yIbLYgrlakMkZlBRE1mrjNzXVrz/awsWy/JT/AjIrUkSealaTovTdN5k8fS2o62d3y89d2qtRFbayfvey7wIosl86cqS4m4N9v93DgUZv7Z8SkZx7IZVadZafY8xE8nsyRGsW4W2WJR6STxKKpvhydfGIDkv/TppMPTGLpky4vWVqP/z1arf9ocHbn6nmVLnlv5j//DeqFNJo7rm/547ppVjzzCSc+rTjJx9RpiXqpexlT1a+nBg/fc+7bXNi5//F9Wx7N6L0sOHbzxl7Fumd9QxLOOWe+TpCepj30MxKdWZvWukzSJyTAA2u/T5IF0fPy/ffUtrxld8dM9V5i4clHzpQPX373suKcu+/E/91df1n+rqx/+Z603Py0V/nMbV85v3Y4iEHinS8Zv883xJ+99y2sdAP7oE7s+xJG9WrzfYbn7ouFTZsulW7ZZtvasqKfnGlXth3hHUfy15shLw/csO25yU6wZQs2dz5BZbpCKBrcooy7I8BnGMtiYeg6uqBThz8Pk+ZWrrrpqZOjOO78A7wadc1Ov/hBTcsDvd5/4j5+Y0d+Pf/zjjU+vX7/52Frtr7zT2KWoxRVfJ0JCpMmf//nqGRm2eD8skK+0Nt7QqcVjJ/kmqEuT5Fo25gYvHqJat9ZCFRemaQqoOGvNjNefWnu3DP6l9+7hNElBdGStyyiKcLhevz1N3X1MJOL93rxsiGgsaTZWCFFVALAoG269AqUKCIGtWgvVA7NmzRIAiKzZ4Jz/Rv5+awYpVHhHuLJURyZLmS62O26nl2XZXhamzFl3km0W4S0qnWSLocSnKDksy0QFODIlDxl2KAsLMQwVeYWKPwmkPQCEOWIv6RLVlpI3u155QlSp3S3ezVPvnlLFPBNXbjW1rt6Lf/z8F1TkD1yzcRrHlS/+QbN5iao8rSpLVFwfRJmM9kHkFBXZBpXdIJ5nbLSeuvgVq77/1E3eyx+q9yeDMBGh1ar441W8U3UA4leo6Mni/RYQhEDLTFxZot69DcD+i7//cwZhQEROAtEJ4/XfvA7A0wKZY+Noo0+adTL2O1As1TR5jczcmiAr7Ox5uyBUpvCdwguwiwEBk5mcwrYziiJ67aZpU/QHVqwQtF4cz+tI4RTpE63FextobfcwloOfMZVaecUVDkdez5mBd+LeYILp20cARzbfKjSA1atXO7TWJ5hWv3z5cgEwAmAUM8evlTGvWePQWhwmNOYz+g0Ay5cv3w1gVw4euXZZmysbnyxMfjaUt+E8j6FS5GRCeMrgs8ft9KsomSjKcIvo5es70fN8KcpUZ+DPp8Uh5W8b3VQ8xDlLxCcv//sX39psjC9T0R6dXMAgrlwI6CKfJB9zafNcSZN3+qSx1Va7VjDZfgAizkHSdKmN4lvh07kqAvEyteWCAlDF+i//h1e8M0ka54pz26GyylV6e1UEKn6SX1EQVDzU+4mtSAFA6+oaF7pG8h7x/iEA8wHE529WcGxOIGtPkSS5j43dZ5g+fMmW7ZaJe1Rlrrj0gLjmj0n9ivFDB29sHskui7LGfMAJya1MSdvBy/TrjSMrrdOM+iL8IXo5vMHzIvxl17M8tDMolNQXwYd4CxlgETwC8HnHU8RX3nll4YpsJ0+3yEmUld9FWWbPQ8Ehz1u+FPFfBjsNfz6alTmBULSZgpMk6bXV2oao1v23ttb9PRCdMOkwVeQUcW5UHH5wzxlLcPeZx+32SfKoeLeYMLFjnjGQNP0vZPgErnR/ttVWp+8KN3F83xnH7WXDj7K1PU55dn4bG8p88qKqUFGoSC3qOfYbcXfte2TMh4h5iwCjPXP/mdlGFxHRARH/RZc0H7W17ncTSz8Iu9lGnzOV6kITV7+lxL+oVGsf6v67bXGBHPLXigayTMnaObtwpDWTr7mU0imLxNPxHSntlLxMd4qUMe+I8xlSlvcyOWbhinhoNwahJKGIz9DYFGVGnTjBIllmabUz7N9VWebbhGwwL78i3oCZcg7aZ9muke0Ym/CGreVTOY5HXWP8kyB+nkCWmD5LE8teMdNWsvZ0NumbL/nxvzxE1s81bE9nY3eItjanAjPA/F3v3K85sjf7ZiNWkaenvxQHXPTjF62FzFEvp6vqmDCPqOpBVbUgWnzBlp8/BsJCcek8MG11BJiWE3GuUd9Jxr4fIttcs3kNyIx5cXOsjc5T71CZdczl4tK56v0SGHM6eXnIjY/fDdBdxtoTFHozMd/oQQ+jNSUrklHRtbJIX+TM2mUoAMAGrQ3gJlbF6aRNO/6KjvNBtozvMgdd5LDbwbfLlo6m73m8oYyw7DzknMra5Y2xSJahAPXvsjwCV3ZeFnTKcOUdfkjupZ4+HxEmf6f/EYGYwdY6iDx595sWPdJTqf6QmEYnHaZP0gcA7DGV+IsmwgPGRN8wlcppPm3enajfByImNiBjxCeNL0PkHo6imI6sM8gEBVQGooi/ypX4W2SjpQDua3b1jbikuYVAe0wUf6oW1+5nGw0Rc8279NtqvCNikDEJxN2g3t3McbyIrd1Y6em+iqP47WTMEhV9jIgazOYZAPttFF+ohP64p2c9W3MTCG8C0MfG7oKinpPZ0aT1RRlDUaAKjcEMupPf+jiROqaXdtOQUDT/bbKlTuHb4SrLrjvFGcosQvAhYyobozzOvHEX8VEmq1C7PD9F8L+LsszXF2WKWUdYlFkXBaegs8wyEYo4Rd53GqwhwMaVfzFRZStAYwBYxhzI2OfZmm0A8JUzF29Nx8cvIeYtUa3Wb+J41Kfp9ZH1//Uv37zUEfP/tNXqE0RUv+fMJWPJ6KHrTBR/3Va7nrViBKARE1WesNWqi7pqC2ylekDFXZM2G+seOGW2NPYufto3GyvJRk9HtdpcU6nsc+Pja8f/9emH7zvztUJEv2Rrtyapa7jx8c9Lkn7MVqq9USX6UwBnmij+IcYba4ZPfPn1buzQDSaKB+OeWTGAOeLcM1Gttijq7nmzrVS3JvWxNXtqL9ufk1XRVCIkx7LoHgpSIRx5ugADzCym9V1zyFCLomyI93aZRxamXdbaDne+rkiWIUPtJFMK0QuNR5HhhGSZbVN0PXstZIghHvNZThH/+XZFdb8LsgzxWOScw7YThp3hLIHpK67nU9H8oAWdJivgm43PKfAXaD3RlDTtTiQ9NHBkw1xAUveU1/pF3hgWEaiou2vZcS08qne4+uEv+1QcALChhrj0Mp+kiDy5JKItrlF/zDXGASJwHIEJ7r43LxUAeOAClkseffFRkvHHiVoLPnjn3AMTezmrl8+JS/9CXNN99U9PlEv+5hd/CdLNqbbucfokgefWkmgRk/hGY513KRPBOec/Kekhbu1fb+S8f/2Zm9gjOh9t200lQoMQitjljrGgGGNgrJ1c2i00JSqMmiU0ipx2EY4immVKnKddJMssbIh+WeDP81KEN1RfNNZ5vJ06nRB/RTIr4u/fZTmz5H1VFk+RjRVl9oUzAsoxnR+sOh55AAASN0lEQVSMfGeKDLwTAzqa4zIB5umWHWdLqG9F+Mra5a+XDUZZX8rk3in8VLsrr/3k4ksuvuiUE1+75IlazDs6aJcvRfXTrm/YsIGjKJ5DRFVmU3cu2T/xeg82bLiTq12236UNGWitms4bNgxxtRr3HTrUPJB51zIvv3Y6N1W3efNmHhurz1WVkRUrPpp/W4G/+rWv9aVJIssvu2w0X/f5wUHuiWObNDwqfd2y4iMfyW6qVsSTAODBwUHbbCauVpvV51nrq1d8NAEgm7785RqMkZWXXZbc+oVb+Ym5T8gDFzxQ1I+icQjSLPlth78jWXZAt4yXMrr/FviL9P9oytG0KdX77MWiyiLGs+2Qg80z0CnjHIApO5bccSjy5f+KonC+ZNsU0WzHV6iuKGqF8Obrs+MUwj/xwIdEFdldE0N4ftsAIBs3DnIUV85jw7cqdIUXf7MqHQ8AL7zwAqt6iPjTFfjod7/7XQYgxtIcYlpdqdieCThs3rwZ999/P2PCAd5+++0AIH/2Z3+W5UVeeOGFGRlSrVaDV7nai7wZaO0ztH79+ql2PnXvSFO3CjPlKjHxfCjdzEY/pY3mTZvuuHN+ll4eflImg4NDSxX0kTQ9holxjVF9xyRBBr0Dzn3oS0ND/bN7X37VW186u5qTZQhvVt55GyyDz/7mSzsbyR+X4Qq1y/+W6WUZfDu76MTxZuHKssQyu2NMl3+7wsCR5WaLsqGiuk4zuE48fKcRFyjHV9aHEJ12EaUdniKanfYDHVwL8RXk4+rrb1p88cUXnfRHS1+1pRrRvg5wdtK3aW0HB4dex8beZNhcvmLF8pENGze+jtmIMabfGrPQu/TZJNG9xup1lbj6k9Slu0T8fhXMj6rxoxA9w1o7N2k2H53V23v8yMhLI5VKdWGSNBsARgybBap4ZtWqK57ddMcdJ8Rx5XVJ0nxm5RVXPAMAt98+OLva1fX2ZrMxn0A7QPodEJ1tmPclTf/U2rUDye23D55MzG83hj5PxMtEZMylyZNr165NAPDGweEvQnWjjaMl3rkzI2uuB5nXee8SEb8bRAtA5KwxcWTM9jT1S5xL6mRMP6k+7728lYgWdnd3/3CsMb5dnCxixluJaDODF4yPNx/vmVWbbw33N5vNZ4S5PzbRApc2n1p1ZCfNokSkbHzaOYBQoCvSyxDOTu23Ezsq4j0Pk6dTZN9lfJSVTn1Bx6UoM8vWIQcTKvn2RZ0OHRc5qSKnPNk+H51DPIfq8wOXzW47iUrtnF4+cwjhaHftaPrHAGCJYJkAQn57irzMinjiEjgGwArM8949u2LF8tHBwcF5sY37Cdov4i/xzj3nVdcQyVwinuO82ykia0W1qoRz0iRd5r0/N02ShogO1Ov1/iiKr05TN8pkbBxVrlHFPlG5ZmjjxrnOy/WNxvhu7+W6wcHhRYODX47Z0I3OpY7ZvKy1DAJ9nIB+EX0nG5wFAMzcWkZZZAER5qrq+9jY0yb7RAyQ4ZPE+zeq6t+nzn/Ui3uHqp4P4L2RjW5V0dNV9MLxRvJBEX+9CO1T0TNE8W6AhJj/KEnT18HLOmaqQUkI6HfevzOuRGd4769zTs4WxQfh9d0i/gwFfXzTpk0W4bFkzBzzTsYtP0b58yK9PNpMrRO7yv6GnGMRTJbPUNadPy5ygqHSLhCV2XqoXbAzIUPNHxcizOHJHhc50aLBmCyh1L9sWhKachQNSB5PJ9OVTgTcadTKOulQmzz/xfRNBGOMMAfXJitrH5J3MPCRYowI8zZuHLZEZFXlLap4F0R/Ua8ffkpVdzPTSSryi6TZeAKq20lJJr4DX0xEv1LFKBH+LnXpaJKmPx1YdcUjgO71IjsbjfHHVWS/MB9PwE8HVq3aoqo/B7BENe2DojpaP/yg9/4fxHlmNieqoh8gMHMdAKvq5Fdh9TRxNQJmA+iZ7IMqLESPA7AQ0MegeKN3so+YfkngEefciDj/l8777yr0NV5lBzOciG5r7Sqpsar8Y5IkXwcwhxQ1IoBFnidCA8Ap3vtvNRrJF6B4NIrsM6q6V1Xf0EySODAeeZmXlZAdlWVu+VJmN/nzThxTUWZZpFOh9kXXy/Sy01KWQYYcd1GZ4ifvzEKZYr6uCD7PZKHh5c6LphLthJPH0Ymzy/McivKh9tnrIf5C/BbBItAujyMk9zzf0+AiywzVhIkmF5sI9bGdwRRlzwJAiPG0tdEBY806JToLRP0A/juI/rja1XUBAYuI8Bwxv8ba+DwyfBIxrDF2oYrsEtHXgAlKcEQ0l4mOHRwctMTcH0V2trU2BtFsIt4Pwhs23XnnMiI+EdAdgIyBqNrbPessG9kzo8jWnHfbCXgGhO9553cAEGPMbMP0MoAGiHFAVPcT0RwAMjQ0VGOmmlf9torsjKL4vQD2GEMHADylpM+BKCZjFhjm46F4kUB9AOYT0RIQahOyqZHhPiKKQWqhmJWKWAViZhpjY5YQcVWhpzjv3qOqe21kxcUzFnfOlzI9KrOhPOwkriI7Ctlt9rxdEC/Tz7LMNoujXWZbxme70i4hKksEi/iRycpQ1lWUtncaAYvaB5lA8SC0K6FINEkvFKHyvJTSVAC/ev1pi/e8/o0n65IlZYJt56BDzrjMyRdNwwp5jaIKyLDj1mojWbpFPJYFvSAvAwMDY17lRmP4fgIdUKX1RLiPwDcQeJRA1zWbzacAbADQS4q1AEaZzP1QfsowDcXWziNgpzFmu7HmHwSInfP1ZqP5twAcoN8m1SQy9uYoipYw0y3OpduTJGkw0TpDtFBFvkGM/Spyi7HRHAALbGzrABBX4kZcqf4MkG8y2z4A3xdFaz9xor5qXP0REcR7d5MxPMKG7mI2/UzmNGa2BDABZxFhjKD3Abqejf0wEe0mRQPAY8w2YfBaJv4kkelhNgDM6ZGxIl4eMUS20hV9DMp7GHxQVed7J9uq3vSXjGkns7BQ0Jw8Lwq8RfQmYfO0yxxsJ3qZ16O88y3Ty9D1ouSlk5leqE2Wn1DyF+Jl6pze/t3v8u91v6qfoqhKLt039q/HJdHvvciRoXmoRPX62EsHertr8M70Q4iFk7F7Tn91fflPdvfAS+LTBttKpVfSBAp2vWpHxqyfDa+sEdfvPu2Vo6uf/nXNC2HTyf31jz65q+ZF+B9+8q36G048p2rjeI6KjNxzxuJRAHLJYz9nG/X0SpJUOY4SN7p/9BT3etnas2M2VC1ZC580R+9986vrK57YY9NkvEdZR+89YzEAyKWPba+RUrXS2DEy/La3AQAufWxnlY32Qr2o11HxPjFdtV5N0ypEwJGpJ4lz1tgethbj44dGI7Iya3Sk55M3Xf320WNm7/kvN35ua9xbaaTO9EGVRWj0njMWNi7asq3HsmncvexVyapHXrT+5d09evA3Y4f2/Vxq806ew9Zad+jg3nvfdqKseOJfYufRc/ebXrk/NxChiIzc9WyZAb/usxuWfPAD712w9JXzttDMvclDAa8smy7LsEMzgTIe8yXUx9+635jZp6LAmO/LVN3m889nANj/lrcsiivVG9I0vfPgyEtPfOITnwAAfOELQ7Y7sg4Ar1izwt155z222UztlVeuaKxf/6UYiNBaYB0MwPX0WO7t7eUDBw641MF6C6GmcleXcStXrgz1r6gvIf6Rg/k/SpZt+CrqSx4+BFekl0erv0WlE/5Al//DrmWmEl/vmuO9Jqp8wzUOD5tqbTmpfhjGjLnG+M0e/vmI428QUQPMu9PDh6+t9s2+UkWfcOOH+m2te42rH05UsYdgPmW7Knf5ZsNxFI/K4bE1cf/L3yHOndg4ePD62rHHfjBtNmY3Dje+Uuvtvk3S9AQQ7/Hj9Wvi53fuSV/7ymrc27cuOXTodbZabbg0vWtM+eEedQ8QUKMokrR++Iv3/smrH77k73bOMSw3qbhr7z5zSR0AX/6TXZdGXbVzmi/95uq7/+TV+wDw5U/sOo8je606lwB4otFofqbnmGPXpY3DJ6j3QsZ8U8XvJTbXEFFDoX/vG82HQLryvGWv/tjDj76wDKBT2fLDUfcxQ268XgfT9nE3ck3sqp8C6P57lh337Ee3vDinMnfOjfVf/8/PclRdbOLKDaoaq5Mvpol/sDqr6/2qsrJ5qHHhvcsWjuaUI6S4ZYo0re4vNty15Nyzz569dPG8J7LbzZbga0cjDxtS/pCCFbUL4Q3hKysh2KL2RX0u5Gf9+vVgZixevBjnnntuEa6j5aesz53IPd+HTvB2Uv63yrINDRRcP1pZhnQ8xOe/WbEc21vUuVvY+ceT9HA/AScw8fvS8cMXsTGnRZXq9Vo/tFZcMh+sK6Jazw1seL5Pk1eqyPMifl56eOxxQ7RJ1Y6KJHPE8QGfJNfYrtp6x3RaOnZoLkfRFUT4J9ds9qpzvx+xvpfYxEnz0PuiuLrK1rqvSRb94fVQsm58fKl4v8YnzQW2Uv1Mz8jYoxphDohvVK/bqzW7FwCLSy2xLkFmERHfbJ4vadqrxKcBeAgAJG3OlbS5RUTu7375733Rje9b4JPmUjDdSVx93JvKftM89FF17jH16QY10ffAtBWKhRcAuBTUp8AfqKJKxsbqkltsV88N0Xi1D4QFgNYACBixbzaXQu1sZnurbzY/ZuIIHEfvSZNDDyVj6QdA3EPqzwLwYEAh8gMcmt4g9ysAuFatoVqLJldbD+HKlqJpU5mxlfGSxZGf4oTw56N5UVTP0+8k+z2aPk/DcXVrvc5Os5Yi3kN9Lcv8QnIp4v3/Glm2ofHbyrIItqzPocyxrG+lTpYBzE8b9X1U6brNxvFtBF2QHD60++4zF+9yzeaTbCMm5RpZ01fpnb0OoBpUHaACAEzsbLXr3VSt3oqKOVUAUZXjo57uTwI6G8CzploFFA+S4Q/4NHmVihclXdwcHfnZfcuW7CPGk6ZaXYzYWiUAqhAvDZckz5lK14gwZhNzr6lUrmemm5rjMjXlpCMLXuLiLf+8xFarwmw2mSh625SgiB0Ze1ZlVu/1af3wbmbsA5EQaE1UiW+iwy/NhipAWIKo8m62NiHo1ErdrfWYACggSWNJPKvvBhVJyBhu8dACzDyftmmj3uvT5HnfSJ9Ix8Y+xWqXmiiOSeUzUa32zuVbgkvE5Qe1aCAlD997bA+L+AMTcEUOUDL1IbzAdBpFBtxuihMyoDzfoUwjzxtysHn5tMsyJtsclSwx3dhCjq4oSwrJMuQcihxMtr5IPnncv0uy7KRkA3eInyyusmw6hBes3u/kKF7s08a96ly/Eh2w1er8Sx/bfoKtdp3u06ShxHV1frQx8tI6SZIdcfess0EsRMRevHXj43/jxg9/yjfrzxOIAd4HcM0l6XOm0jVKxoCjaD8pbbLV6gfJWBB4W1TrfuNlj21fDOBM3xh/XgWOtLXjHjPm2ErlFN8cr5HaAyp+zDXG10vavJUgraeVBCgQE9G8y/5u+1xj+d0qMl/EvQ/Aso/86IUaAICUW09asUjS5PtkIwGBVXUoOXTwVramoQQBoR/Mc0TkWgB7TaU6+5JHXzjedlWP5yiuK5RNpbqtcXDkJp8mQipntV7s47nLH9+xYIIXgNSZuLKfo+hUkCzmODqBrT1dXLpYoReBcDJZ6gsMWj4ryStA0IGde+770FPtcmkzya9iPmPAM/Uh4wpF87IspIhGOwMOZQx53sr6XGTA7TK0IrxFgSXEX6gP+b51krFncXTiDP5dlu1hQ/0I0SmqL2sjAGDVuxuZzc1KNNsY+1e+WX9KvHzbxpWvgWi/uPRGVtTBdACqNygw2qyPPRp19bxMCaPMdh9be5G45GQi7PbATVFkt/pG/Tay8c1so5vh9WeAylfOWPTwyq1738jW/so1mg/7NPlTU6n8NbPdmh4avfaet7zaLf/RL4RqtV1gvo2IR8X7W+r28GiNqiMEXE/M4r3eCuBhr95ZjixBNyiwl4wRSdOV4v2+qNp1rXXJUgBbSTFChn/sxuu3EZv1ytRLxNvUuTUKSaD4pomr+8S5B+467RW3A8Bljz1fI+Jvxd2zviEu3QOi60TQcOP1mAg3mkplrzucPmYqlRPh3bUgdqLNdYDuVPEHoLiRjV0HKHMUr5c0eTXEXOsb48+rl+uEzEJk9ufODgqmK1bbKLt69X/G3DnxSJrIaAA+lMEU0SqkUVJfhKcMV7vr7fpclAmhzfUQ3rIMO982n02V8VgG0072ncB2Svv/NVl2Yhvt5NrOBgrr/hdGJgfNmpkpbQAAAABJRU5ErkJggg==';
    const doc = new jsPDF('landscape');

    doc.addImage(imageBase64, 'PNG', 20, 10, 70, 30);
    const startY = 50;

    doc.setFontSize(12);
    doc.text(`Empleado: ${resumeData.nombre}`, 14, startY);
    doc.text(`Área: ${resumeData.area}`, 14, startY + 7);
    doc.text(`Fecha Ingreso: ${resumeData.fecha_ingreso || "27/6/2024"}`, 14, startY + 14);
    doc.text(`Observaciones: ${resumeData.observaciones || "-"}`, 14, startY +21);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Color rojo
    doc.text(resumeData.estado, 180, startY);

    // Mover el cursor a una nueva posición para comenzar la tabla
    doc.setTextColor(255, 0, 0); // Volver al color negro
    doc.setFontSize(12);
    doc.text(`Anticipo: ${resumeData.numeroAnticipos || 0}`, 180, startY + 7);

    // Definir columnas y filas
    const columns = ["Lugar a Visitar", "Objetivo Misión", "Observaciones", "Fecha Salida", "Fecha Regreso", "Descripcion Transporte", "Numero de Placa", "Tipo de Cambio", "Moneda", "Monto"];
    const rows = [
      [(lugar.Nombre) ? lugar.Nombre : selectedPais.NombrePais, resumeData.objetivo_mision, resumeData.observaciones, resumeData.fecha_salida, resumeData.fecha_regreso, resumeData.tipoTransporte, resumeData.numeroPlaca, "0.00", resumeData.moneda, resumeData.monto]
    ];

    // Añadir la tabla al PDF
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: startY + 30, 
      theme: 'grid',
    });

    // Guardar el PDF
    doc.save('table.pdf');

    // Mostrar el PDF en el navegador
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  };

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
          setFieldValue,
        }) => (          
        
            <><Header title="Sistemas de Control de Viaticos" /><form onSubmit={handleSubmit}>
              <GetTotalAnticipos onGetDatos={handleAnticipo} onGetEstado={handleEstado} />
              <br></br>
              <label className="checkbox-container">
                VIATICO POR UN PAR DE HORAS
                <input
                  type="checkbox"
                  checked={checkboxSeleccionado}
                  onChange={(e) => manejarCambioCheckbox(e, setFieldValue)}
                  color="primary" />
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
                  <NombreEmpleadoComponent onEmpleadoChange={handleEmpleadoChange} />

                  <AreaEmpleadoComponent onAreaChange={handleAreaChange} />

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
                    sx={{ gridColumn: "span 2" }} />
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
                  <Box gridTemplateColumns="repeat(4, minmax(0, 1fr))" sx={{ width: '100%', gridColumn: "span 2" }}>
                    <SelectContinentes
                      onCountryChange={handleCountryChange}
                      onLugar={handleLugar}
                      getMoneda={handleMoneda}
                      reset={reset} />
                  </Box>

                  <TipoCambioComponent getCambio={handleCambio} />

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
                    sx={{ gridColumn: "span 2" }} />

                  <TextField
                    fullWidth
                    variant="filled"
                    type="date"
                    label="Fecha Salida"
                    //onBlur={handleBlur}
                    onChange={handleChange}
                    name="fecha_salida"
                    value={(checkboxSeleccionado) ? fechaSalida : values.fecha_salida}
                    error={!!touched.fecha_salida && !!errors.fecha_salida}
                    sx={{ gridColumn: "span 2" }}
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      min: today2,
                    }}
                    disabled={checkboxSeleccionado} />

                  <TextField
                    fullWidth
                    variant="filled"
                    type="date"
                    label="Fecha de Regreso"
                    min={currentDate}
                    //onBlur={handleBlur}
                    onChange={handleChange}
                    name="fecha_regreso"
                    value={(checkboxSeleccionado) ? fechaRegreso : values.fecha_regreso}
                    error={!!touched.fecha_regreso && !!errors.fecha_regreso}
                    sx={{ gridColumn: "span 2" }}
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      min: today2,
                    }}
                    disabled={checkboxSeleccionado} />

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
                    sx={{ gridColumn: "span 2" }} />

                  <Box gridTemplateColumns="repeat(4, minmax(0, 1fr))" sx={{ width: '100%', gridColumn: "span 2" }}>
                    <TransporteComponent
                      onSelectTransport={handleTransport}
                      onSelectRegitro={handleRegistro} />
                  </Box>

                </Box>
                <Box display="flex" justifyContent="start" mt="20px">
                  <Button type="submit" color="primary" variant="contained">
                    Agregar Nuevo Detalle
                  </Button>
                </Box>
              </Box>
            </form>
            </>            
)}
        </Formik>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
        >
        <DialogTitle>Resumen de la Misión</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Nombre:</strong> {formData.nombre}<br />
            <strong>Área:</strong> {formData.area}<br />
            <strong>Lugar de Destino:</strong> {formData.pais_destino}<br />
            <strong>Objetivo de la Misión:</strong> {formData.objetivo_mision}<br />
            <strong>Fecha de Salida:</strong> {formData.fecha_salida}<br />
            <strong>Fecha de Regreso:</strong> {formData.fecha_regreso}<br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddNew} color="primary" variant="contained">
            Agregar uno nuevo
          </Button>
          <Button variant="contained" color="primary" onClick={handleGeneratePdf}>
            Generar PDF con Tabla
          </Button>
        </DialogActions>
      </Dialog>
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
  objetivo_mision: yup.string().required("required"),
  observaciones: yup.string().required("required"),
  fecha_salida: yup.string().required("required"),
  fecha_regreso: yup.string().required("required"),
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