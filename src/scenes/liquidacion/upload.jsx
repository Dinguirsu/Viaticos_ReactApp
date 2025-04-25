import React, { useState } from 'react';
import './FileUpload.css'; // Import a CSS file for styling
import axios from 'axios';
import { Button, Box, Typography } from "@mui/material";

const FileUpload = ({ numeroLiquidacion }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setMessage('Por favor, seleccione un archivo.');
            return;
        }

        const validExtensions = {
            '.doc': 'application/vnd.ms-word',
            '.docx': 'application/vnd.ms-word',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.ms-excel',
            '.jpg': 'image/jpg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.pdf': 'application/pdf'
        };

        const fileExtension = `.${selectedFile.name.split('.').pop()}`;
        console.log(fileExtension);
        const contentType = validExtensions[fileExtension] || '';
        console.log(contentType);

        if (contentType) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('numeroLiquidacion', numeroLiquidacion);

            try {
                const response = await axios.post('http://localhost:3000/api/cargarLiquidacion', formData);
                setMessage('Archivo subido exitosamente');
                console.log(message);

            } catch (error) {
                console.error('Error al subir el archivo:', error);
                setMessage('Ocurrió un error al intentar subir el archivo.');
            }
        } else {
            setMessage('Formato de archivo no reconocido. Solo subir formatos Imagen/Word/PDF/Excel.');
        }
    };

    return (
        <Box mt="20px">
        <Typography variant="h6" mb="10px">
            Cargar Archivo
        </Typography>
        <input type="file" name="file" onChange={handleFileChange} />
        <Button
            variant="contained"
            color="primary"
            onClick={handleFileUpload}
            style={{ marginTop: '10px' }}
        >
            Guardar Liquidacion
        </Button>
        </Box>
    );
};

export default FileUpload;
