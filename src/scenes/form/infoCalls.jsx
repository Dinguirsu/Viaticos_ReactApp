import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Typography, Box } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { red } from '@mui/material/colors';

export const NombreEmpleadoComponent = ({onEmpleadoChange}) => {
  const [Empleado, setNombreEmpleado] = useState('');
  const usuario = 'admin'; // El parámetro que quieres pasar

  useEffect(() => {
    const fetchNombreEmpleado = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/NombreEmpleado/${usuario}`);
        setNombreEmpleado(response.data.Empleado);
        onEmpleadoChange(response.data);
      } catch (error) {
        console.error('Error fetching the employee name:', error);
      }
    };

    fetchNombreEmpleado();
  }, []);
  return ([]);
};

export const AreaEmpleadoComponent = ({onAreaChange}) => {
    const [Area, setAreaEmpleado] = useState('');
    const usuario = 'admin'; // El parámetro que quieres pasar
  
    useEffect(() => {
      const fetchAreaEmpleado = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/AreaEmpleado/${usuario}`);
          setAreaEmpleado(response.data.Area);
          onAreaChange(response.data.Area);
        } catch (error) {
          console.error('Error fetching the employee area name:', error);
        }
      };
  
      fetchAreaEmpleado();
    }, []);
    return ([]);
  };

export const TipoEmpleadoComponent = ({onTipoEmpleado}) => {
  const [Tipo, setTipoEmpleado] = useState([]);
  const usuarioId = 100; // El parámetro que quieres pasar

  useEffect(() => {
    const fetchTipoEmpleado = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/TipoEmpleado/${usuarioId}`);
        setTipoEmpleado(response.data.TipoCargo);
        onTipoEmpleado(response.data.CodigoTipoCargo)
      } catch (error) {
        console.error('Error fetching the type employee name:', error);
      }
    };

    fetchTipoEmpleado();
  }, []);
  return (
      <TextField
        hidden
        fullWidth
        variant="filled"
        type="text"
        label="Tipo Empleado"
        value={Tipo}
        name="tipo_empleado"
        sx={{ gridColumn: "span 2" }}
        InputLabelProps={{
          shrink: true
        }}
      />
  );
};

export const SelectContinentes = ({onCountryChange, onLugar, getMoneda, reset}) => {
  const [continentes, setContinentes] = useState([]);
  const [selectedPais, setSelectedPais] = useState(null);
  const [isPaisDisabled, setIsPaisDisabled] = useState(true);
  const [selectedContinente, setSelectedContinente] = useState(null);

  const handleContinenteChange = (event, newValue) => {
    setSelectedContinente(newValue);
    if (newValue) {
      setIsPaisDisabled(false);
    } else {
      setIsPaisDisabled(true);
    }
  };

  useEffect(() => {
    const fetchContinente = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/continentes`);        
        setContinentes(response.data);

      } catch (error) {
        console.error('Error fetching the Continent name:', error);
      }
    };

    fetchContinente();
  }, []);

  useEffect(() => {
    if (reset) {
      setSelectedContinente(null);
      setIsPaisDisabled(true);
    }
  }, [reset]);

  return (
    <div>
      <Autocomplete
        options={continentes}
        getOptionLabel={(option) => option.NombreContinente}
        onChange={handleContinenteChange}
        renderInput={(params) => 
        <TextField
          {...params}  
          fullWidth   
          variant="filled"
          type="text"
          label="Seleccione un Continente"
          name="continente"
          sx={{
            '& .MuiInputBase-input': {
              color: 'white', // Cambia este color al que prefieras
            },
            '& .MuiFormLabel-root': {
              color: 'white', // Cambia el color del label cuando no está enfocado
            },
            '& .MuiFormLabel-root.Mui-focused': {
              color: 'white', // Cambia el color del label cuando está enfocado
            },
            '& .MuiInput-underline:before': {
              borderBottomColor: 'white', // Color de la línea antes de enfocarse
            },
            '& .MuiInput-underline:hover:before': {
              borderBottomColor: 'white', // Color de la línea al pasar el cursor
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'white', // Color de la línea después de enfocarse
            },
          }}
        />}
      />
      {selectedContinente &&(    
        <CountrySelector 
          continente={selectedContinente} 
          onCountryChange={onCountryChange}
          onLugar={onLugar}
          disabled={isPaisDisabled}
          getMoneda={getMoneda}
          reset={reset}
        />
      )}      
  </div>
  );
};

export const CountrySelector = ({ continente, disabled, onCountryChange, onLugar, getMoneda, reset}) => {
  const [paises, setPaises] = useState([]);
  const [selectedPais, setSelectedPais] = useState(null);
  const [isDeptoDisabled, setIsDeptoDisabled] = useState(true);

  useEffect(() => {
    const fetchPaises = async () => {
      if (continente) {
        try {
          const response = await axios.get(`http://localhost:3000/api/pais/${continente.CodigoContinente}`);
          setPaises(response.data);
        } catch (error) {
          console.error('Error fetching the countries:', error);
        }
      }
    };

    fetchPaises();
  }, []);

  useEffect(() => {
    if (reset) {
      setSelectedPais(null);
      setIsDeptoDisabled(true);
    }
  }, [reset]);

  const handleChange = (event, newValue) => {
    setSelectedPais(newValue);
    onCountryChange(newValue);
    if (newValue && newValue.CodigoPais === 'HN') {
      setIsDeptoDisabled(false);
      getMoneda("1")
      onLugar(newValue.NombrePais);
    } else {
      setIsDeptoDisabled(true);
      getMoneda("2");
      onLugar(newValue.NombrePais);
    }
  };

  return (
    <div>
      <br></br>
      <Autocomplete
        disabled = {disabled}
        onChange={handleChange}
        options={paises}
        getOptionLabel={(option) => option.NombrePais}
        renderInput={(params) => 
          <TextField
              {...params}
              fullWidth
              variant="filled"
              type="text"
              label="Seleccione un País"
              name="pais_destino"
              sx={{
                '& .MuiInputBase-input': {
                  color: 'white', // Cambia este color al que prefieras
                },
                '& .MuiFormLabel-root': {
                  color: 'white', // Cambia el color del label cuando no está enfocado
                },
                '& .MuiFormLabel-root.Mui-focused': {
                  color: 'white', // Cambia el color del label cuando está enfocado
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: 'white', // Color de la línea antes de enfocarse
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: 'white', // Color de la línea al pasar el cursor
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'white', // Color de la línea después de enfocarse
                },
              }}
          />
        }
      />
      {selectedPais && selectedPais.CodigoPais === 'HN'  && (
        <Box gridTemplateColumns="repeat(2, minmax(0, 1fr))" sx={{ gridColumn: "span 2"}} >
          <DeptoSelector
            disabled={isDeptoDisabled} 
            pais={selectedPais}
            onLugar={onLugar}
            reset={reset}
          />
        </Box>
      )}
    </div>
  );
};

export const DeptoSelector = ({ pais, disabled, onLugar, reset}) => {
  const [departamento, setDepartamento] = useState([]);
  const [selectdepto, setSelectedDepto] = useState(null);
  const [isMuniDisabled, setIsMuniDisabled] = useState(true);
  useEffect(() => {
    const fetchPaises = async () => {
      if (pais && pais.CodigoPais === 'HN') {
        try {
          const response = await axios.get(`http://localhost:3000/api/departamentos`);
          setDepartamento(response.data);
        } catch (error) {
          console.error('Error fetching the countries:', error);
        }
      }
    };

    fetchPaises();
  }, []);

  useEffect(() => {
    if (reset) {
      setSelectedDepto(null);
      setIsMuniDisabled(true);
    }
  }, [reset]);

  const handleChange = (event, newValue) => {
    setSelectedDepto(newValue);
    if (newValue) {
      setIsMuniDisabled(false);
      onLugar(newValue);
    } else {
      setIsMuniDisabled(true);
    }
  };

  return (
    <div>
      <br></br>
      <Autocomplete
        disabled = {disabled}
        onChange={handleChange}
        options={departamento}
        getOptionLabel={(option) => option.Nombre}
        renderInput={(params) =>         
          <TextField
              {...params}
              fullWidth
              variant="filled"
              type="text"
              label="Seleccione un Departamento"
              name="departamento"
              sx={{ gridColumn: "span 2",
                '& .MuiInputBase-input': {
                  color: 'white', // Cambia este color al que prefieras
                },
                '& .MuiFormLabel-root': {
                  color: 'white', // Cambia el color del label cuando no está enfocado
                },
                '& .MuiFormLabel-root.Mui-focused': {
                  color: 'white', // Cambia el color del label cuando está enfocado
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: 'white', // Color de la línea antes de enfocarse
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: 'white', // Color de la línea al pasar el cursor
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'white', // Color de la línea después de enfocarse
                },
               }}
          />
        }
      />
      {selectdepto && (
        <MuniSelector 
          depto={selectdepto} 
          onLugar={onLugar}
          reset={reset}
        />
      )}
    </div>
  );
};

export const MuniSelector = ({ depto, disabled, onLugar, reset }) => {
  const [municipio, setMunicipio] = useState([]);
  const [SelectedMuni, setSelectedMuni] = useState(null);

  useEffect(() => {
    const fetchMunicipio = async () => {
      if (depto) {
        try {
          const response = await axios.get(`http://localhost:3000/api/municipio/${depto.IDDept}`);
          setMunicipio(response.data);
        } catch (error) {
          console.error('Error fetching the countries:', error);
        }
      }
      else{
        setMunicipio([]);
      }
    };

    fetchMunicipio();
  }, []);

  useEffect(() => {
    if (reset) {
      setSelectedMuni(null);
    }
  }, [reset]);

  const handleChange = (event, newValue) => {
    setSelectedMuni(newValue);
    setSelectedMuni(newValue);
    if (onLugar && newValue) {
      onLugar(newValue);
    }
  };

  return (
    <div>
      <br></br>
      <Autocomplete
        onChange={handleChange}
        disabled = {disabled}
        options={municipio}
        getOptionLabel={(option) => option.Nombre}
        renderInput={(params) =>         
          <TextField
              {...params}
              fullWidth
              variant="filled"
              type="text"
              label="Seleccione un Municipio"
              name="municipio"
              sx={{ gridColumn: "span 2" ,
                '& .MuiInputBase-input': {
                  color: 'white', // Cambia este color al que prefieras
                },
                '& .MuiFormLabel-root': {
                  color: 'white', // Cambia el color del label cuando no está enfocado
                },
                '& .MuiFormLabel-root.Mui-focused': {
                  color: 'white', // Cambia el color del label cuando está enfocado
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: 'white', // Color de la línea antes de enfocarse
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: 'white', // Color de la línea al pasar el cursor
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'white', // Color de la línea después de enfocarse
                },
              }}
          />
        }
      />
    </div>
  );
};

export const TransporteComponent = ({onSelectTransport, onSelectRegitro}) => {
  const [Transporte, setTransporte] = useState([]);
  const [selectedTransporte, setSelectedTransporte] = useState(null);

  useEffect(() => {
    const fetchTransporte = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/transporte`);
        setTransporte(response.data);
      } catch (error) {
        console.error('Error fetching the type transport:', error);
      }
    };

    fetchTransporte();
  }, []);

  const handleChange = (event, newValue) => {
    setSelectedTransporte(newValue);
    onSelectTransport(newValue);
  };
  return (
    <div>
      <Autocomplete
        options={Transporte}
        getOptionLabel={(option) => option.DescripcionTransporte}
        onChange={handleChange}
        renderInput={(params) => 
          <TextField
            {...params}  
            fullWidth       
            variant="filled"
            type="text"
            label="Seleccione el Medio de Transporte"
            name="transporte"
          />
        }
      />
      {selectedTransporte && selectedTransporte.IDTransporte === 1  && (
        <PlacaVehiculoComponent
          onSelectRegitro={onSelectRegitro}
        />
      )}
    </div>
  );
};

export const PlacaVehiculoComponent = ({onSelectRegitro}) => {
  const [Placa, setPlacaVehiculo] = useState([]);
  const [Registro, setRegistroVehiculo] = useState('');

  useEffect(() => {
    const fetchPlacaVehiculo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/placa`);
        setPlacaVehiculo(response.data);
      } catch (error) {
        console.error('Error fetching the type placa:', error);
      }
    };

    fetchPlacaVehiculo();
  }, []);

  const handleChange = (event, newValue) => {
    setRegistroVehiculo(newValue);
    if (onSelectRegitro) {
      onSelectRegitro(newValue);
    }
  };
  return (
    <div>
      <br></br>
      <Autocomplete
        onChange={handleChange}
        options={Placa}
        getOptionLabel={(option) => option.NoPlaca}
        renderInput={(params) => 
        <TextField
          {...params}  
          fullWidth       
          variant="filled"
          type="text"
          label="Seleccione Nº de Placa"
          name="Numero_Placa"
        />}
      />
    </div>
  );
};

export const GetTotalAnticipos = ({onGetDatos, onGetEstado}) => {
  const [Anticipos, setTotalAnticipos] = useState('');
  const [Estado, setEstado] = useState('');

  useEffect(() => {
    const fetchTotalAnticipos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/totalAnticipos`);
        setTotalAnticipos(response.data[0].total);
        const totalAnticipos = response.data[0].total;
        onGetDatos(response.data[0].total + 1);
        await enviarTotalAlBackend(totalAnticipos);
      } catch (error) {
        console.error('Error fetching the employee name:', error);
      }
    };

    const enviarTotalAlBackend = async (total) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/obtenerEtapa/${total}`)
        setEstado(response.data[0].CodigoEtapa);
        onGetEstado(response.data[0].Etapa);
      } catch (error) {
        console.error('Error enviando el total al backend:', error);
      }
    };

    fetchTotalAnticipos();
  }, []);

  return (
    <Box gridTemplateColumns="repeat(4, minmax(0, 1fr))" sx={{ width: '13%', gridColumn: "span 2" }}>
      <Typography variant="body1">Autorizacion de Anticipo No. :</Typography>
        <Typography variant="subtitle1" sx={{ bgcolor: '#333', padding: '8px', borderRadius: '4px' }}>
          {Anticipos + 1}
      </Typography>
      
        <Typography hidden variant="subtitle1" sx={{ bgcolor: '#333', padding: '8px', borderRadius: '4px' }}>
          {Estado}
      </Typography>
    </Box>
  );
};

export const postAnticiposGastoViaje = async (data) => {
  try {
    const response = await axios.post('http://localhost:3000/api/ingresoFormulario', data);
    return response.data;
  } catch (error) {
    console.error('Error posting anticipos detalle mision:', error);
    throw error;
  }
};

export const postAnticiposDetalleMision = async (data) => {
  try {
    const response = await axios.post('http://localhost:3000/api/ingresoFormularioDetalle', data);
    return response.data;
  } catch (error) {
    console.error('Error posting anticipos detalle mision:', error);
    throw error;
  }
};

export const TipoCambioComponent = ({getCambio}) => {
  const [Cambio, setTipoCambio] = useState('');

  useEffect(() => {
    const fetchCambioDivisa = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/obtenerCambioDolar`);
        const cotizacion = response.data[0].CotizacionDolarVenta; // Valor por defecto si es undefined
        setTipoCambio(cotizacion);
        getCambio(cotizacion);
      } catch (error) {
        console.error('Error fetching divisa:', error);
      }
    };

    fetchCambioDivisa();
  }, []);
  return ([]);
};

export const GetCodigoZonaViaticoHN = async (NombreMunicipio) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/obtenerCodigoZonaViaticoHN/${NombreMunicipio}`);
    return response.data[0].CodigoZonaViaticos; // Valor por defecto si es undefined
  } catch (error) {
    console.error('Error fetching Codigo:', error);
  }
};

export const GetCodigoZonaViatico = async (NombrePais) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/obtenerCodigoZonaViatico/${NombrePais}`);
    return response.data[0].CodigoZona; // Valor por defecto si es undefined
  } catch (error) {
    console.error('Error fetching Codigo:', error);
  }
};

export const GetMontoViaticoLempiras = async (data) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/obtenerMontoViaticoLempiras`, {
      params: data
    });
    return response.data[0].Monto
  } catch (error) {
    console.error('Error fetching divisa:', error);
  }
};

export const GetMontoViaticoDolares = async (data) => {
  try {
    const response = await axios.get('http://localhost:3000/api/obtenerMontoViaticoDolares', {
      params: data
    });
    return response.data[0].Monto
  } catch (error) {
    console.error('Error fetching divisa:', error);
  }
};