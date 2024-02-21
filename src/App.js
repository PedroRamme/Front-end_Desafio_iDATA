import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';


// Estilizando o campo de pesquisa
const SearchFilter = styled(TextField)({

  marginBottom: '35px'

});

// Componente principal
const App = () => {
  // Estado para armazenar os dados originais
  const [originalData, setOriginalData] = useState([]);

  // Estado para armazenar os dados da tabela
  const [rowData, setRowData] = useState([]);

  // Efeito para carregar os dados da API quando o componente é montado
  useEffect(() => {
    axios.get('https://5523-2804-13d0-9935-bd01-a9b8-3461-adff-aeb0.ngrok-free.app/idata/recruitment', // Utilizando o link do servico que deixa minha API disponivel para ser acessada por outras maquinas
    {
      headers: {
        'ngrok-skip-browser-warning': 'skip'        // pula a pagina de instrucoes do servico
      }
    })
    .then(response => {
      setOriginalData(response.data);
      setRowData(response.data);
    })
    .catch(error => {
      console.error('Erro ao obter dados:', error);
    });
  }, []);

  // Definição das colunas da tabela
  const columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Exportador', field: 'exportador' },
    { headerName: 'Importador', field: 'importador' },
    { headerName: 'DataEmbarque', field: 'dataEmbarque', valueFormatter: params => formateDate(params) },
    { headerName: 'PrevisaoDeEmbarque', field: 'previsaoDeEmbarque', valueFormatter: params => formateDate(params) },
    { headerName: 'DataChegada', field: 'dataChegada', valueFormatter: params => formateDate(params) },
    { headerName: 'PrevisaoDeChegada', field: 'previsaoDeChegada', valueFormatter: params => formateDate(params) },
    { headerName: 'DI', field: 'di' },
    { headerName: 'Navio', field: 'navio' },
    { headerName: 'Master', field: 'master' },
    { headerName: 'House', field: 'house' },
    { headerName: 'Fatura', field: 'fatura' },
    { headerName: 'FreteModo', field: 'freteModo' },
    { headerName: 'Container', field: 'container' },
    { headerName: 'CanalParametrizacao', field: 'canalParametrizacao' },
    { headerName: 'Origem', field: 'origem' },
    { headerName: 'Destino', field: 'destino' },
    { headerName: 'LiberadoParaFaturamento', field: 'liberadoParaFaturamento', valueFormatter: params => formateDate(params) },
  ];

  // formata a data e o horario
  const formateDate = (params) => {
    const date = new Date(params.value);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };
  // Função para filtrar os dados da tabela com base no texto de pesquisa
  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    if (searchText === "") {
      // Se o campo de pesquisa estiver vazio, restaurar os dados originais
      setRowData(originalData);

    } else {
      // Caso contrario, aplicar a lógica de filtragem 
      const filteredData = originalData.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchText)
        )
      );
      setRowData(filteredData);
    }
  };

  // Renderização do componente

  return (

    <div className='cabecalho'>
      <header>
        <h1>Desafio iDATA</h1>
      </header>
      <SearchFilter

        label="Pesquisar"
        variant="outlined"
        size="medium"
        onChange={handleSearch}

      />

      <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
        />
      </div>
    </div>

  );

};


export default App;
