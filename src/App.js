import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { TextField, Button } from '@mui/material';
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

  useEffect(() => {
    loadData();
  }, []);
  // Efeito para carregar os dados da API quando o componente é montado
  const loadData = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/idata/recruitment`, // Utilizando o link do servico que deixa minha API disponivel para ser acessada atraves da internet
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
  }; 

  
  const handleAddClick = () => {
    const newRecord = {
      exportador: `Exportador ${Math.floor(Math.random() * 100)}`,
      importador: `Importador ${Math.floor(Math.random() * 100)}`,
      dataEmbarque: new Date().toISOString(),
      previsaoDeEmbarque: new Date().toISOString(),
      dataChegada: new Date().toISOString(),
      previsaoDeChegada: new Date().toISOString(),
      di: `${Math.floor(Math.random() * 1000000)}`,
      navio: `Navio ${Math.floor(Math.random() * 10)}`,
      master: `Master ${Math.floor(Math.random() * 10)}`,
      house: `House ${Math.floor(Math.random() * 10)}`,
      fatura: `Fatura ${Math.floor(Math.random() * 1000)}`,
      freteModo: ["Aereo", "Maritimo"][Math.floor(Math.random() * 2)],
      container: `Container ${Math.floor(Math.random() * 1000)}`,
      canalParametrizacao: ["CanalA", "CanalB", "CanalC"][Math.floor(Math.random() * 3)],
      origem: `Origem ${Math.floor(Math.random() * 5)}`,
      destino: `Destino ${Math.floor(Math.random() * 5)}`,
      liberadoParaFaturamento: new Date().toISOString(),
    };

    axios.post(`${process.env.REACT_APP_API_URL}/idata/recruitment`, newRecord, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip'
      }
    })
    .then(() => {
      loadData(); // Recarrega os dados para incluir o novo registro
    })
    .catch(error => {
      console.error('Erro ao inserir dados:', error);
    });
  };

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
      <Button variant="contained" onClick={handleAddClick} style={{ margin: "10px", }}>+</Button>
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
