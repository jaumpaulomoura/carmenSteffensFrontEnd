import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Image,Text,
} from "@chakra-ui/react";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { FaSearch } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

export default function TrocaFabrica() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [secao, setSecao] = useState("");
  const [fabrica, setFabrica] = useState("");
  const [dataFromExcel, setDataFromExcel] = useState([]);
  const [dataWithIds, setDataWithIds] = useState([]);
  const [newFabrica, setNewFabrica] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);

  const [apiData, setApiData] = useState([]);
  const [apiDataAtuFab, setApiDataAtuFab] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);


  const handleLogin = async () => {
    const api_url = "http://127.0.0.1:5000/api/login";
    const credentials = {
      login: login,
      senha: senha,
    };

    try {
      const response = await axios.post(api_url, credentials);

      if (response.status === 200) {
        setIsLoggedIn(true);
        toast.success("Login bem-sucedido");
      } else {
        toast.error("Erro ao fazer login: Credenciais inválidas");
      }
    } catch (error) {
      toast.error("Erro ao fazer login: Credenciais inválidas");
    }
  };

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo para importar.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDataFromExcel(jsonData);
        toast.success("Importação concluída com sucesso.");

        const dataWithIds = jsonData.map((rowData, index) => ({
          empresa: rowData[0],
          ano: rowData[1],
          ficha: rowData[2],
          fabrica: fabrica || null,
          secao: secao || null,
        }));

        setDataWithIds(dataWithIds);

        fetchDataFromAPI(dataWithIds);
      };
      reader.readAsBinaryString(selectedFile);
    } catch (error) {
      console.error("Erro durante a importação do arquivo:", error);
      toast.error("Erro durante a importação do arquivo.");
    }
  };

  useEffect(() => {
    if (isLoggedIn ) {
      fetchDataFromAPI(dataWithIds);
    }
  }, [isLoggedIn, dataWithIds]);

  const fetchDataFromAPI = async (dataToFetch) => {
    try {
      const apiUrl = "http://127.0.0.1:5000/api/pesFichaFab";
      const response = await axios.post(apiUrl, dataToFetch);

      if (response.status === 200) {
        setApiData(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API2:", error);
    }
  };


  const handleNewFabrica = (e) => {
    setNewFabrica(e.target.value);
  };
  const handleAtuFab = async () => {
    try {
      const apiUrlFab = "http://127.0.0.1:5000/api/pesFichaFab/atualizaFab";
      const dataToSend = {
        selectedRowIds: selectionModel,
        newFabrica: newFabrica,
        login: login,
      };

      console.log('IDs selecionados:', selectionModel); // Adicione esta linha para verificar os IDs

      // Adiciona os IDs ao array selectedRowIds
      setSelectedRowIds(prevSelectedIds => [...prevSelectedIds, ...selectionModel]);

      const responseFab = await axios.post(apiUrlFab, dataToSend);
      if (responseFab.status === 200) {
        toast.success("Dados enviados com sucesso.");
        setApiDataAtuFab(responseFab.dataAtuFab);
      }

      console.log('Resposta da API:', responseFab);
    } catch (error) {
      console.error("Erro na solicitação para a API:", error);
      toast.error("Erro ao enviar dados para a API.");
    }
  };
  return (
    
      <Box bg="#fff">
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {!isLoggedIn ? (
          <Box
            width="100%"
            height="100vh"
            direction="column"
            align="center"
            justify="center"
            bg="gray.300"
            as="form"
          >
            <Box
              direction="column"
              justify="center"
              align="center"
              as="form"
              borderRadius="10px"
              background="white"
              padding="15px"
              width="400px"
              boxShadow="0 0 40px rgba(0,0,0,.05)"
            >
              <Image src="/csLogo.png" maxWidth="250px" />
              <Text as="h1" fontSize="18px" fontWeight="400" textAlign="center">
                Acesso ao sistema
              </Text>
              <Input
                m="10px"
                placeholder="Login"
                marginBottom="10px"
                width="100%"
                background="#fff"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value.toUpperCase())}
              />
              <Input
                m="10px"
                placeholder="Senha"
                marginBottom="10px"
                width="100%"
                background="#fff"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
              <Button
                m="10px"
                marginBottom="10px"
                width="100%"
                colorScheme="blue"
                bg="#465687"
                color="white"
                type="button"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Text
                fontSize="16px"
                fontWeight="400"
                textAlign="center"
                marginTop="20px"
              >
                Versão: 0.0.1
              </Text>
            </Box>
          </Box>
        ) : 
        (
          <Box direction="column" height="100vh">
            <Box
              direction="row"
              ml="2px"
              m="5px"
              background="#283156"
              justify="end"
              borderRadius="10px"
              width="99.4%"
              height="17%"
              border="1px solid"
            >
              <Box direction="column" width="69%" height="100%">
                <Box direction="row" height="18%">
                  {/* <Text color="#fff" ml="3px">
                    Pesquisar
                  </Text> */}
                  <FaSearch style={{ marginLeft: "5px", marginTop: "5px", color: "#fff" }} />
                </Box>
                <Box direction="row">
                  <Input
                    ml="10px"
                    mt="5px"
                    marginBottom="10px"
                    width="100px"
                    height="100%"
                    background="#fff"
                    type="text"
                    value={fabrica}
                    onChange={(e) => setFabrica(e.target.value)}
                    placeholder="Fábrica"
                  />
                  <Input
                    ml="10px"
                    mt="5px"
                    marginBottom="10px"
                    width="100px"
                    height="100%"
                    background="#fff"
                    type="text"
                    value={secao}
                    onChange={(e) => setSecao(e.target.value)}
                    placeholder="Seção"
                  />
                </Box>
                <Box>
                  <Input
                    ml="10px"
                    mt="10px"
                    marginBottom="10px"
                    width="100px"
                    height="100%"
                    background="#fff"
                    type="text"
                    placeholder="Ano"
                  />
                  <Input
                    ml="10px"
                    mt="10px"
                    marginBottom="10px"
                    width="130px"
                    height="100%"
                    background="#fff"
                    type="text"
                    placeholder="Ficha"
                  />
                  <Input
                    ml="10px"
                    mt="10px"
                    marginBottom="10px"
                    width="180px"
                    height="100%"
                    background="#fff"
                    type="text"
                    placeholder="Ano + Ficha"
                  />
                </Box>
              </Box>
              <Box direction="column" align="flex-end" width="30%" height="100%">
                <Box direction="column" align="flex-end" width="30%" height="50%">
                  <Button
                    m="10px"
                    mt="20px"
                    marginBottom="10px"
                    width="200px"
                    colorScheme="red"
                    color="white"
                    type="submit"
                    onClick={() => window.location.reload(false)}
                  >
                    Limpar
                  </Button>
                </Box>
                <Box direction="column" align="flex-end" width="30%" height="50%">
                  <label htmlFor="fileInput" className="custom-file-input">
                    <Input
                      type="file"
                      id="fileInput"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      accept=".xlsx, .xls"
                      style={{ display: "none" }}
                    />
                    <Button
                      m="10px"
                      marginBottom="10px"
                      width="200px"
                      height="100%"
                      colorScheme="blue"
                      bg="#465687"
                      color="white"
                      type="button"
                      onClick={() => document.getElementById("fileInput").click()}
                    >
                      Importar Arquivo
                    </Button>
                  </label>
                </Box>
              </Box>
              <Box align="left" width="10%">
                <Image
                  boxSize="2rem"
                  borderRadius="full"
                  src="/logoCS.png"
                  alt="Logo CS"
                  mt="2px"
                  width="130px"
                  height="100px"
                />
              </Box>
            </Box>
            <Box
              m="5px"
              width="99.4%"
              height="68vh"
              direction="column"
              borderRadius="10px"
              border="1px solid"
            >
              <Box bg="#fff">
                <Box
                  m="5px"
                  width="99.4%"
                  height="68vh"
                  direction="column"
                  borderRadius="10px"
                  border="1px solid"
                >
                  <Box width="100%" marginTop="20px" height="58vh" overflowY="scroll">
                    <DataGrid
                      rows={apiData}
                      columns={[
                        { field: 'EMPRESA', header: 'Empresa', width: 90 },
                        { field: 'SECAO', header: 'Seção', type: 'number', width: 90 },
                        { field: 'ANO', header: 'Ano', type: 'number', width: 90 },
                        { field: 'FICHA', header: 'Ficha', type: 'number', width: 90 },
                        { field: 'MODELO', header: 'Modelo', width: 150 },
                        { field: 'FABRICA', header: 'Fábrica', type: 'number', width: 90 },
                        { field: 'STATUS', header: 'Status', type: 'number', width: 150 },
                        { field: 'ID', header: 'Id', type: 'number', width: 150 },
                      ]}
                      pageSize={9}
                      checkboxSelection
                      disableSelectionOnClick
                      onSelectionModelChange={(selectionModel) => {
                        console.log('Modelo de Seleção Alterado:', selectionModel);
                        setSelectionModel(selectionModel);
                        console.log('Estado de seleção atualizado:', selectionModel);
                      }}
                      getRowId={(row) => (row.ID ? row.ID.toString() : '')}
                    />
                  </Box>
                </Box>
              </Box>
              <Box justifyContent="center" alignItems="center" mt={4}>
              </Box>
            </Box>
            <Box
              direction="column"
              ml="2px"
              m="5px"
              background="#283156"
              justify="start"
              borderRadius="10px"
              width="99.4%"
              height="10%"
              border="1px solid"
            >
              <Box direction="row">
                {/* <Text color="#fff" ml="3px">
                  Nova Fabrica
                </Text> */}
                <IoAddCircleOutline style={{ marginLeft: "5px", marginTop: "5px", color: "#fff" }} />
              </Box>
              <Box justify="space-between">
                <Input
                  ml="10px"
                  mt="10px"
                  marginBottom="10px"
                  width="180px"
                  background="#fff"
                  type="text"
                  placeholder="Nova fabrica"
                  value={newFabrica}
                  onChange={handleNewFabrica}
                />
                <Button
                  m="10px"
                  marginBottom="10px"
                  width="200px"
                  colorScheme="blue"
                  bg="#465687"
                  color="white"
                  type="button"
                  onClick={handleAtuFab}
                >
                  Enviar Dados
                </Button>
              </Box>
            </Box>
          </Box>
        )
        }
      </Box>
  )
}