import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';  

const Dashboard = () => {
    const usuario = 615;
    const [anticipos, setAnticipos] = useState([]);  

    useEffect(() => {
        const fetchAnticipos = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/obtenerAnticiposByIDEmpleado/${usuario}`);  
            setAnticipos(response.data);  
        } catch (error) {
            console.error('Error fetching anticipos:', error);
        }
        };

        fetchAnticipos();
    }, []
    );

  return (
    <>
      <Typography variant="h4" gutterBottom align="center" style={{ marginTop: '30px' }}>
        Mis Anticipos
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numero Autorizacion</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Área</TableCell>
              <TableCell>Fecha de Ingreso</TableCell>
              <TableCell>Etapa</TableCell>
              <TableCell>Lugar a Visitar</TableCell>
              <TableCell>Monto Anticipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {anticipos.map((anticipo, index) => (
              <TableRow key={index}>
                <TableCell>{anticipo.NumeroAutorizacion}</TableCell>
                <TableCell>{anticipo.Empleado}</TableCell>
                <TableCell>{anticipo.Area}</TableCell>
                <TableCell>{anticipo.FechaIngreso}</TableCell>
                <TableCell>{anticipo.Etapa}</TableCell>
                <TableCell>{anticipo.LugarAVisitar}</TableCell>
                <TableCell>{anticipo.MontoAnticipo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Dashboard;
