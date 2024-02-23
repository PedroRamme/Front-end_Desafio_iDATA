import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Estilizando o campo de pesquisa
const SearchFilter = styled(TextField)({

  marginBottom: '35px'
});

const App = () => {
  // Estado para armazenar os dados originais
  const [originalData, setOriginalData] = useState([]);

  // Estado para armazenar os dados da tabela
  const [rowData, setRowData] = useState([]);

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    exportador: '',
    importador: '',
    dataEmbarque: '',
    previsaoDeEmbarque: '',
    dataChegada: '',
    previsaoDeChegada: '',
    DI: '',
    navio: '',
    master: '',
    house: '',
    fatura: '',
    freteModo: '',
    container: '',
    canalParametrizacao: '',
    origem: '',
    destino: '',
    liberadoParaFaturamento: '',
  });

  const [configJson, setConfigJson] = useState(null);

  useEffect(() => {
    fetch('/config.json')
      .then((response) => response.json())
      .then((config) => {

        setConfigJson(config.API_URL);        // Armazene a configuração em um estado local

        loadData(config.API_URL);             // Chame loadData apenas depois que configJson for definido
      });
  }, []);

  // Efeito para carregar os dados da API quando o componente é montado
  const loadData = (apiUrl) => {
    axios.get(`${apiUrl}/idata/recruitment`, // Utilizando o link do servico que deixa minha API disponivel para ser acessada atraves da internet
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

  //funcao que abre o dialogo quando clicado no botao
  const handleAddClick = () => {
    handleOpen();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Atualiza o estado do formulario
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //funcao para envio do formulario
  const handleSubmit = () => {

    const requiredFields = ['exportador', 'importador', 'DI', 'navio', 'master', 'house', 'fatura', 'freteModo', 'container', 'canalParametrizacao', 'origem', 'destino', 'liberadoParaFaturamento'];
    const invalidFields = requiredFields.filter(field => !formData[field]);

    //verificacoes de campos invalidos
    if (new Date(formData.dataEmbarque) > new Date(formData.dataChegada)) {
      window.alert('A data de embarque não pode ser maior do que a data de chegada');
      return;
    }
    if (new Date(formData.previsaoDeEmbarque) > new Date(formData.previsaoDeChegada)) {
      window.alert('A previsão de embarque não pode ser maior do que a previsão de chegada');
      return;
    }
    if (invalidFields.length > 0) {

      window.alert(`Por favor, preencha todos os campos`);
      return;
    }
    axios.post(`${configJson}/idata/recruitment`, formData, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip'
      }
    })
      .then(() => {
        loadData();
        handleClose();
      })
      .catch(error => {
        console.error('Erro ao inserir dados:', error);
      });
  };

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

  // Formata a data e o horario
  const formateDate = (params) => {
    const date = new Date(params.value);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };
  // Funcao para filtrar os dados da tabela com base no texto de pesquisa
  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    if (searchText === "") {

      setRowData(originalData);

    } else {
      // aplica a logica de filtragem 
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adicionar registro</DialogTitle>
        <DialogContent>
          {Object.keys(formData).map((key, index) => (
            <TextField
              key={index}
              margin="dense"
              id={key}
              name={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              type={key === 'dataEmbarque' || key === 'previsaoDeEmbarque' || key === 'dataChegada' || key === 'previsaoDeChegada' || key === 'liberadoParaFaturamento' ? 'datetime-local' : 'text'}
              fullWidth
              value={formData[key]}
              onChange={handleChange}
              InputLabelProps={key === 'dataEmbarque' || key === 'previsaoDeEmbarque' || key === 'dataChegada' || key === 'previsaoDeChegada' || key === 'liberadoParaFaturamento' ? { shrink: true } : {}}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Enviar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


export default App;
