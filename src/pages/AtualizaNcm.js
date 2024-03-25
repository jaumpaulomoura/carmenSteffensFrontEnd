import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

// Crie um tema do Material-UI
const muiTheme = createTheme({
  palette: {
    mode: 'light', // ou 'dark' dependendo do seu caso
  },
});

export default function MeuDataGrid() {
  const [dataWithIds, setDataWithIds] = React.useState([]); // Adicione o estado necessário
  const [apiData, setApiData] = React.useState([]); // Adicione o estado necessário

  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = "http://127.0.0.1:5000/api/pesFichaFab";
      const dataToFetch = dataWithIds;
      
      const response = await axios.post(apiUrl, dataToFetch);

      if (response.status === 200) {
        setApiData(response.data);
        // Execute outras ações após a atualização do estado aqui, se necessário.
      } 
    } catch (error) {
      console.error("Erro ao buscar dados da API2:", error);
      // Adicione tratamento de erro, se necessário.
    }
  };

  React.useEffect(() => {
    fetchDataFromAPI();
    // Adicione outras dependências do useEffect, se necessário
  }, [dataWithIds]);

  // Defina as colunas aqui
  const columns = [
    { field: 'Empresa', headerName: 'Empresa', width: 70 },
    { field: 'Seção', headerName: 'Seção',type: 'number', width: 130 },
    { field: 'Ano', headerName: 'Ano', type: 'number',width: 130 },
    { field: 'Ficha', headerName: 'Ficha', type: 'number', width: 90 },
    { field: 'Modelo', headerName: 'Modelo', width: 90 },
    { field: 'Fabrica', headerName: 'Fabrica', type: 'number', width: 90 },
    { field: 'Status', headerName: 'Status', type: 'number', width: 90 },
  ];

  return (
    // Forneça o tema ao ThemeProvider do Material-UI
    <ThemeProvider theme={muiTheme}>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={apiData} // Use apiData como fonte de dados
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </ThemeProvider>
  );
}
