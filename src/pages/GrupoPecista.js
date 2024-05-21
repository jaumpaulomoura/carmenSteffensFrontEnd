import React, { useState, useEffect } from "react";
import axios from 'axios';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { Text,Flex, Button, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { format } from 'date-fns';
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const animatedComponents = makeAnimated();

const GrupoPecista = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [selectedOptionsEmp, setSelectedOptionsEmp] = useState(null);
  const [selectedOptionsGru, setSelectedOptionsGru] = useState(null);
  const [selectedOptionsCol, setSelectedOptionsCol] = useState([]);
  const [dataFromAPICol, setDataFromAPICol] = useState([]);
  const [dataFromAPIGru, setDataFromAPIGru] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  registerLocale("ptBR", ptBR);
  setDefaultLocale("ptBR");
  const handleLogin = async () => {
    const allowedUsers = ['ADMINISTRADOR', 'JP_MOURA', 'PEDRODP', 'RA_BARROS'];
    if (!allowedUsers.includes(login)) {
      toast.error("Usuário não autorizado");
      return;
    }  
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
  const optionsEmp = [
    { value: "31", label: "31 - MIGUELETTI" },
    { value: "32", label: "32 - MARCELA BELUCCI" },
    { value: "54", label: "54 - SPECIAL" },
  ];

  const optionsGru = dataFromAPIGru.map((grupo) => ({
    value: grupo.CODCORTADOR,
    label: `${grupo.CODCORTADOR}`
  }));

 const optionsCol = dataFromAPICol.map((colaborador) => ({
  value: colaborador.COD_COL,
  label: colaborador.COLABORADOR ? colaborador.COLABORADOR.trim() : '', 
  funcao: colaborador.FUNCAO,
}));

  const handleSelectGru = (selected) => {
    setSelectedOptionsGru(selected[0]);
  };

  const handleSelectCol = (selected) => {
    setSelectedOptionsCol(selected);
  };

  const handleSelectEmp = async (selected) => {
    const selectedEmpresaValue = selected[0] ? selected[0].value : null;
    await fetchDataCol(selectedEmpresaValue); 
  };

  const fetchDataCol = async (empresa) => {
    //  dev
    // const api_url_colaborador = "http://localhost:5000/api/grupoPecista/colaborador";
  // prod
    const api_url_colaborador = "http://192.168.12.58:5000/api/grupoPecista/colaborador";
    console.log('empresa', empresa)
    try {
      const response = await axios.post(api_url_colaborador, { empresa }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setDataFromAPICol(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados da API (colaborador):", error);
    }
  };

  useEffect(() => {
    if (selectedOptionsEmp && selectedOptionsEmp.length > 0) {
      fetchDataCol(selectedOptionsEmp[0].value);
    }
  }, [selectedOptionsEmp]);

  useEffect(() => {
    const fetchDataGru = async () => {
      try {
        //  dev
        // const response = await fetch("http://localhost:5000/api/grupoPecista/grupo");
        // prod
        const response = await fetch("http://192.168.12.58:5000/api//grupoPecista/grupo");
        const dataGru = await response.json();
        setDataFromAPIGru(dataGru);
      } catch (error) {
        console.error("Erro ao buscar dados da API (grupo):", error);
      }
    };
    fetchDataGru();
  }, []);

  const adicionarColaboradores = async (selectedColaboradores) => {
    const formattedDate = format(selectedDate, 'dd/MM/yyyy');
    const updatedTableData = [];
  
    try {
      const gruposSelecionados = selectedOptionsGru.map(opcao => opcao.value);
      const empSelecionados = selectedOptionsEmp.map(opcao => opcao.value);
  
      for (const colaborador of selectedColaboradores) {
        const isDuplicateColaborador = tableData.some(item =>
          item.codCol === colaborador.value
        );
  
        if (isDuplicateColaborador) {
          toast.error(`O colaborador ${colaborador.label} já está presente na tabela.`);
          continue;  
        }
  
        for (const grupo of gruposSelecionados) {
          
          const isDuplicateGrupo = tableData.some(item =>
            item.codCol === colaborador.value &&
            item.grupo === grupo
          );
  
          if (isDuplicateGrupo) {
            toast.error(`O colaborador ${colaborador.label} já está no grupo ${grupo}.`);
            continue; 
          }
          // dev
          // const api_url_producao = "http://localhost:5000/api/grupoPecista/prod";
          // prod
          const api_url_producao = "http://192.168.12.58:5000/api/grupoPecista/prod";
          
          const paramsProducao = {
            data: formattedDate,
            grupo: grupo,
          };
  
          const responseProducao = await axios.get(api_url_producao, {
            params: paramsProducao,
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (responseProducao.status === 200) {
            const dadosProducao = responseProducao.data;
            const totalVLRTotal = dadosProducao.reduce((acc, item) => {
              return acc + item.VLRTOTAL;
            }, 0);
  
            const newDataPonto = {
              emp: empSelecionados,
              codCol: colaborador.value,
              grupo: grupo,
              formattedDate: formattedDate,
              totalVLR: 0,
              vlrTotal: totalVLRTotal,
              customValue: '',
              nomeCol: colaborador.label,
              funcaoCol: colaborador.funcao,
            };
  
            updatedTableData.push(newDataPonto);
          } else {
            console.error("Erro na solicitação de produção para o grupo", grupo, ":", responseProducao.statusText);
            toast.error(`Erro na solicitação de produção para o grupo ${grupo}.`);
          }
        }
      }
      await setTableData((prevTableData) => [...prevTableData, ...updatedTableData]);
      // toast.success("Colaboradores adicionados com sucesso!");
      return Promise.resolve();
    } catch (error) {
      console.error("Erro na solicitação:", error.message);
      toast.error("Erro ao adicionar colaboradores. Por favor, tente novamente.");
    }
  };
  
  
  

  
  const handleEnviarDados = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmEnviarDados = async () => {
    try {
      const arrayApi = tableData.map(item => ({
        PECEMP: Number(item.emp[0]),
        PECCODCOL: Number(item.codCol),
        PECGRUPO: Number(item.grupo),
        PECDATA: item.formattedDate,
        PECPRODGRU: Number(item.vlrTotal ? item.vlrTotal.toFixed(4) : ""),
        PECPRODIND: 0,
        PECHRPAR: Number(item.customValue)
      }));
      //dev
      // const apiUrl = 'http://localhost:5000/api/insereDadosTab';
      // prod
      const apiUrl = 'http://192.168.12.58:5000/api/insereDadosTab';
      const response = await axios.post(apiUrl, arrayApi);
      toast.success("Dados inseridos com sucesso!");
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      toast.error("Erro ao enviar dados. Por favor, tente novamente.");
    }
    setShowModal(false);
  };

  const handleCustomValueChange = (value, index) => {
    const newData = [...tableData];
    newData[index].customValue = value;
    setTableData(newData);
  };

  const deleteColaborador = (index) => {
    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData.splice(index, 1);
      return updatedTableData;
    });
  };


  

 
  return (
    <Box
      bg="#fff"
      p={4}
      m={0}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
    >
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
        <Flex
          ml="2px"
          m="5px"
          background="#283156"
          borderRadius="10px"
          width="99.4%"
          h="20vh"
          border="1px solid"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
          flexWrap="wrap"
        >
          <Flex direction="column" mt="5px" flex="1" maxHeight='100vh' >
            <Flex ml="20px">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText="Selecione uma data"
                popperPlacement="right-start"
                customInput={<input style={{ background: '#fff', border: '1px solid ', borderRadius: 'none' }} />} 
                locale="ptBR"
              />
            </Flex>

            <Flex ml="20px" mt="10px">
              <Select
                isMulti
                options={optionsEmp}
                className="select"
                isClearable={true}
                isSearchable={true}
                isDisabled={false}
                isLoading={false}
                isRtl={false}
                onChange={setSelectedOptionsEmp}
                closeMenuOnSelect={false}
                placeholder="Selecione uma Empresa"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: '300px',
                    background: '#fff',
                  }),
                }}
                autoWidth
              />
              <Select
                onChange={(selected) => setSelectedOptionsGru(selected)}
                isMulti
                options={optionsGru}
                className="select"
                isClearable={true}
                isSearchable={true}
                isDisabled={false}
                isLoading={false}
                isRtl={false}
                closeMenuOnSelect={false}
                placeholder="Selecione um Grupo"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: '300px',
                    marginLeft: '5px',
                    background: '#fff',
                  }),
                }}
                autoWidth
              />
            </Flex>
            <Flex ml="20px" mt="10px" >
              <Select
                isMulti
                options={optionsCol}
                onChange={setSelectedOptionsCol}
                className="select"
                isClearable={true}
                isSearchable={true}
                isDisabled={false}
                isLoading={false}
                isRtl={false}
                closeMenuOnSelect={false}
                placeholder="Selecione um Colaborador"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: '605px',
                    background: '#fff',
                  }),
                }}
                autoWidth
              />
            </Flex>
          </Flex>
          <Flex direction="column" justifyContent="flex-end" mr="50px" >
            <Button ml="20px" colorScheme="blue" bg="#465687" color="white" onClick={() => adicionarColaboradores(selectedOptionsCol)}>Adicionar Colaboradores e Ponto</Button>
            {/* <Button ml="20px" mt="10px" colorScheme="blue" bg="#465687" color="white" onClick={calcularProducao}>Calcular Produção</Button> */}
            <Button ml="20px" mt="10px" colorScheme="blue" bg="#465687" color="white" onClick={handleEnviarDados}>Enviar Dados</Button>
          </Flex>
          <Flex alignItems="center">
            <Image
              boxSize='2rem'
              borderRadius='full'
              src='/logoCS.png'
              alt='Logo CS'
              mt="2px"
              width="130px"
              height="100px"
            />
          </Flex>
        </Flex>
      )}
      
      {/* Tabela de dados */}
      <Box
        bg="gray.100"
        borderRadius="md"
        border="1px solid"
        ml="2px"
        mt="1125px"
        m="5px"
        maxHeight="calc(100vh - 300px)"
        overflow="auto"
      >
        <Table variant="simple" mt="4">
          <Thead>
            <Tr>
              <Th>Emp</Th>
              <Th>Grupo</Th>
              <Th>Nome Colaborador</Th>
              <Th>Função</Th>
              <Th>Prod Grupo</Th>
              <Th>Horas Paradas</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((item, index) => (
              <Tr key={index}>
                <Td>{item.emp}</Td>
                <Td>{item.grupo}</Td>
                <Td>{item.nomeCol}</Td>
                <Td>{item.funcaoCol}</Td>
                <Td>{item.vlrTotal ? item.vlrTotal.toFixed(4) : ""}</Td>
                <Td>
                  <Input
                    bg="white"
                    value={item.customValue}
                    onChange={(e) => handleCustomValueChange(e.target.value, index)}
                    border="1px solid gray"
                    borderRadius="md"
                    p="2"
                    w="80px"
                  />
                </Td>
                <Td>
                  <Button colorScheme="red" size="sm" onClick={() => deleteColaborador(index)}>Deletar</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal de confirmação */}
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal} size="md" isCentered>
          <ModalOverlay />
          <ModalContent bg="white" borderRadius="md" p={4}>
            <ModalHeader>Confirmação</ModalHeader>
            <ModalBody isCentered>
              Deseja realmente inserir os dados?
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleConfirmEnviarDados} bg="green" color="white" colorScheme="blue" mr={3}>
                Sim
              </Button>
              <Button onClick={handleCloseModal} bg="red" color="white" colorScheme="gray">
                Não
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default GrupoPecista;
