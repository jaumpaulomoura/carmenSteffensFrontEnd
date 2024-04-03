import React, { useState, useEffect } from "react";
import { Loading } from '../components/Loading'
import axios from "axios";
import {
  Flex,
  Box,
  Button,
  Input,
  Image,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox // Componente Checkbox corrigido
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { FaSearch } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

export default function TrocaFabrica() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [secao, setSecao] = useState("");
  const [fabrica, setFabrica] = useState("");
  const [dataFromExcel, setDataFromExcel] = useState([]);
  const [dataWithIds, setDataWithIds] = useState([]);
  const [newFabrica, setNewFabrica] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [apiDataAtuFab, setApiDataAtuFab] = useState([]);


  const handleLogin = async () => {
    // dev
    // const api_url = "http://127.0.0.1:5000/api/login";
    // prod
    const api_url = "http://192.168.12.58:5000/api/login";

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
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDataFromExcel(jsonData);
        

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

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     fetchDataFromAPI(dataWithIds);
  //   }
  // }, [isLoggedIn, dataWithIds]);

  const fetchDataFromAPI = async (dataToFetch) => {
    try {
      setLoading(true);
      // dev
      // const apiUrl = "http://127.0.0.1:5000/api/pesFichaFab";
      // prod
      const apiUrl = "http://192.168.12.58:5000/api/pesFichaFab";
      const response = await axios.post(apiUrl, dataToFetch);
  
      if (response.status === 200) {
        setApiData(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API2:", error);
    } finally {
      setLoading(false); 
      toast.success("Importação concluída com sucesso.");
    }
  };
  


  const handleCheckboxChange = (id) => {
    setSelectionModel(prevSelectionModel => {
      const isSelected = prevSelectionModel.includes(id);
      if (isSelected) {
        return prevSelectionModel.filter(item => item !== id);
      } else {
        return [...prevSelectionModel, id];
      }
    });
  };

  useEffect(() => {
    console.log("Valores selecionados:", selectionModel);
  }, [selectionModel]);


  const handleSelectAll = () => {
    if (selectAll) {
      setSelectionModel([]);
    } else {
      const allIds = apiData.map(row => row.ID);
      setSelectionModel(allIds);
    }
    setSelectAll(prevSelectAll => !prevSelectAll);
  };


  const handleNewFabrica = (e) => {
    setNewFabrica(e.target.value);
  };

  const buildArray = (selectedData, newFabrica, login) => {
    return {
      currentPageData: selectedData.map(row => ({
        EMPRESA: row.EMPRESA,
        ANO: row.ANO,
        FICHA: row.FICHA,
        SECAO: row.SECAO,
        FABRICA: row.FABRICA
      })),
      newFabrica: newFabrica,
      login: login
    };
  };






  const handleAtuFab = async () => {
    try {
      setLoading(true);
      // dev
      // const apiUrlFab = "http://127.0.0.1:5000/api/pesFichaFab/atualizaFab";
      // prod
      const apiUrlFab = "http://192.168.12.58:5000/api/pesFichaFab/atualizaFab";
      const dataToSend = buildArray(apiData.filter(row => selectionModel.includes(row.ID)), newFabrica, login);

      const responseFab = await axios.post(apiUrlFab, dataToSend);
      if (responseFab.status === 200) {
        toast.success("Dados enviados com sucesso.");
        setApiDataAtuFab(responseFab.dataAtuFab);
      }
    } catch (error) {
      console.error("Erro na solicitação para a API:", error);
      toast.error("Erro ao enviar dados para a API.");
    }finally {
      setLoading(false); 
      toast.success("Troca das fabricas concluída com sucesso.");
    }
  };

  
  const clearAllStates = () => {
    setSenha("");
    setSecao("");
    setFabrica("");
    setDataFromExcel([]);
    setDataWithIds([]);
    setNewFabrica("");
    setSelectionModel([]);
    setApiData([]);
    setSelectAll(false);
    setApiDataAtuFab([]);
  };

  return (
    <Flex direction="column" height="100vh">
      
        
           
      
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
          <Flex
          width="100%"
          height="100vh"
          direction="column"
          align="center"
          justify="center"
          bg="gray.300"
          as="form"
          >
            <Flex
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
            </Flex>
          </Flex>
        ) : (
          <Flex direction="column" height="100vh">
            {loading && <Loading />}
            <Flex
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
              <Flex direction="column" width="100%" height="100%">
                <Flex direction="row" height="20%">
                  <Text color="#fff" ml="3px">
                    Pesquisar
                  </Text>
                  <FaSearch
                    style={{ marginLeft: "5px", marginTop: "5px", color: "#fff" }}
                  />
                </Flex>
                <Flex direction="row">
                  <Input
                    ml="10px"
                    mt="5px"
                    marginBottom="10px"
                    width="100px"
                    height="30px"
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
                    height="30px"
                    background="#fff"
                    type="text"
                    value={secao}
                    onChange={(e) => setSecao(e.target.value)}
                    placeholder="Seção"
                  />
                </Flex>
                <Flex>
                  <Input
                    ml="10px"
                    mt="5px"
                    marginBottom="10px"
                    width="100px"
                    height="30px"
                    background="#fff"
                    type="text"
                    placeholder="Ano"
                  />
                  <Input
                    ml="10px"
                    mt="5px"
                    marginBottom="10px"
                    width="130px"
                    height="30px"
                    background="#fff"
                    type="text"
                    placeholder="Ficha"
                  />
                  <Input
                    ml="10px"
                    mt="5px"
                    marginBottom="10px"
                    width="180px"
                    height="30px"
                    background="#fff"
                    type="text"
                    placeholder="Ano + Ficha"
                  />
                </Flex>
              </Flex>
              <Flex direction="column" align="flex-end" width="30%" height="50%">
                <Flex>
                  <Button
                    m="10px"
                    mt="20px"
                    marginBottom="10px"
                    width="200px"
                    colorScheme="red"
                    color="white"
                    type="button"
                    onClick={clearAllStates}
                  >
                    Limpar
                  </Button>
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
                      mt="20px"
                      marginBottom="10px"
                      width="200px"
                      colorScheme="blue"
                      bg="#465687"
                      color="white"
                      type="button"
                      onClick={() => document.getElementById("fileInput").click()}
                    >
                      Importar Arquivo
                    </Button>
                  </label>
                  {loading && <p>Carregando...</p>}
                </Flex>
              </Flex>
              <Flex align="left" width="10%">
                <Image
                  FlexSize="2rem"
                  borderRadius="full"
                  src="/logoCS.png"
                  alt="Logo CS"
                  mt="2px"
                  width="130px"
                  height="100px"
                />
              </Flex>
            </Flex>
            <Flex
              m="5px"
              width="99.4%"
              height="68vh"
              direction="column"
              borderRadius="10px"
              border="1px solid"
            >
              <Flex bg="#fff">
                <Box
                  m="5px"
                  width="99.4%"
                  height="68vh"
                  direction="column"
                  borderRadius="10px"
                  border="1px solid"
                >
                  <Box width="100%" marginTop="20px" height="58vh" overflowY="scroll">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>
                            <Flex direction="column" align="center" width="25px">
                              <Flex align="center" ml="4">
                                <Checkbox isChecked={selectAll} onChange={handleSelectAll} /><br />
                              </Flex>
                              <Flex direction="column" align="center">
                                <Text ml="4">Selecionar</Text><Text ml="4"> Todos</Text>
                              </Flex>
                            </Flex>
                          </Th>
                          <Th>Empresa</Th>
                          <Th>Seção</Th>
                          <Th>Ano</Th>
                          <Th>Ficha</Th>
                          <Th>Modelo</Th>
                          <Th>Fábrica</Th>
                          <Th>Status</Th>
                          {/* <Th>Id</Th> */}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {apiData.map((row) => (
                          <Tr key={row.ID}>
                            <Td><Checkbox
                              onChange={() => handleCheckboxChange(row.ID)}
                              isChecked={selectionModel.includes(row.ID)}
                            /></Td>
                            <Td>{row.EMPRESA}</Td>
                            <Td>{row.SECAO}</Td>
                            <Td>{row.ANO}</Td>
                            <Td>{row.FICHA}</Td>
                            <Td>{row.MODELO}</Td>
                            <Td>{row.FABRICA}</Td>
                            <Td>{row.STATUS}</Td>
                            {/* <Td>{row.ID}</Td> */}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </Flex>










              <Flex justifyContent="center" alignItems="center" mt={4}></Flex>
            </Flex>
            <Flex
              direction="column"
              ml="2px"
              m="5px"
              background="#283156"
              justify="start"
              borderRadius="10px"
              width="99.4%"
              height="11%"
              border="1px solid"
            >

              <Flex direction="row">
                <IoAddCircleOutline
                  style={{ marginLeft: "5px", marginTop: "5px", color: "#fff" }}
                />
                <Text color="#fff" ml="3px">
                  Nova Fabrica
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Input
                  ml="10px"
                  mt="5px"
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
              </Flex>
            </Flex>
          </Flex>
        )}
      </Box>
    </Flex>

  );
}
