import React, { useState, useEffect } from "react";
import axios from 'axios';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { Text, Flex, Button, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { format, parse } from 'date-fns'; // Importando a função de formatação e parseISO
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const animatedComponents = makeAnimated();

const RecalculoPecista = () => {
  const [selectedOptionsEmp, setSelectedOptionsEmp] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedDateIni, setSelectedDateIni] = useState(null);
  const [selectedDateFinal, setSelectedDateFinal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedValues, setEditedValues] = useState(tableData.map(() => ({})));



  registerLocale("ptBR", ptBR);
  setDefaultLocale("ptBR");

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (tableData.length > 0) {
      // console.log("Dados atualizados:", tableData);
    }
  }, [tableData]);

  const optionsEmp = [
    { value: "31", label: "31 - MIGUELETTI" },
    { value: "32", label: "32 - MARCELA BELUCCI" },
    { value: "54", label: "54 - SPECIAL" },
  ];

  const BuscaDados = async () => {
    try {
      const formattedDateIni = selectedDateIni ? format(new Date(selectedDateIni), 'dd/MM/yyyy') : null; // Formatar a data inicial
      const formattedDateFinal = selectedDateFinal ? format(new Date(selectedDateFinal), 'dd/MM/yyyy') : null; // Formatar a data final

      // URL da API para buscar os dados principais
      const api_url_dados = "http://localhost:5000/api/grupoPecista/consulPec";

      // Parâmetros da requisição para buscar os dados principais
      const paramsProducao = {
        dt_ini: formattedDateIni,
        dt_final: formattedDateFinal,
      };

      // Fazer a requisição para buscar os dados principais
      const responseProducao = await axios.get(api_url_dados, {
        params: paramsProducao,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (responseProducao.status === 200) {
        // Dados principais obtidos com sucesso
        const data = responseProducao.data.map(async (item) => {
          // Parâmetros da requisição para buscar os dados de ponto para este colaborador
          const paramsPonto = {
            empresa: item.PECEMP,
            dataPontoIni: formattedDateIni,
            dataPontoFinal: formattedDateFinal,
            codCol: item.PECCODCOL,

          };

          // Fazer a requisição para buscar os dados de ponto para este colaborador
          const responsePonto = await axios.get("http://localhost:5000/api/grupoPecista/ponto", {
            params: paramsPonto,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (responsePonto.status === 200) {
            const pontoData = responsePonto.data;

            // Retornar os dados principais juntamente com os dados de ponto para este colaborador
            return {
              ...item,
              PECDATA: item.PECDATA ? format(parse(item.PECDATA, "EEE, dd MMM yyyy HH:mm:ss 'GMT'", new Date()), 'dd/MM/yyyy') : null,
              HORA_DIA: pontoData.length > 0 ? pontoData[0].HORA_DIA : null,
              HORA_TRAB_MEDIA: pontoData.length > 0 ? pontoData[0].HORA_TRAB_MEDIA : null,
              porcentagemTrabalhada: (pontoData.length > 0 && pontoData[0].HORA_TRAB_MEDIA && pontoData[0].HORA_DIA)
                ? (pontoData[0].HORA_TRAB_MEDIA / pontoData[0].HORA_DIA) * 100
                : null,


            };
          } else {
            throw new Error("Erro ao buscar dados de ponto para o colaborador");
          }
        });

        // Atualizar o estado com os dados obtidos
        const updatedTableData = await Promise.all(data);
        setTableData(updatedTableData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEnviarDados = () => {
    setShowModal(true);
  };

  const handleConfirmEnviarDados = () => {
    setShowModal(false);
  };
  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    setEditedValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = {
        ...updatedValues[index],
        [name]: value,
      };
      return updatedValues;
    });

    // Atualize o estado tableData com os novos valores inseridos nos inputs
    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData[index] = {
        ...updatedTableData[index],
        [name]: value,
      };
      return updatedTableData;
    });
  };

  useEffect(() => {
    // Função para calcular a porcentagem trabalhada
    const calculatePercentage = (horaDia, horaTrabMedia) => {
      if (horaDia && horaTrabMedia) {
        return (horaTrabMedia / horaDia) * 100;
      }
      return null;
    };

    // Atualiza a porcentagem trabalhada para cada item na tabela
    setTableData(prevTableData => {
      return prevTableData.map(item => ({
        ...item,
        porcentagemTrabalhada: calculatePercentage(item.HORA_DIA, item.HORA_TRAB_MEDIA)
      }));
    });
  }, [editedValues]);

























  const calcularProducao = async () => {
    try {
      const orderArray = tableData.slice().sort((a, b) => b.porcentagemTrabalhada - a.porcentagemTrabalhada);

      for (const newData of orderArray) {
        console.log("Novos dados do colaborador:", newData);

        const PECGRUPO = newData.PECGRUPO;
        let PECPRODGRU =0; 
        let PECPRODIND= newData.PECPRODIND;// Inicializa com o valor atual de PECPRODGRU


        console.log("Calculando a produção do grupo:", PECGRUPO);

        let PECPRODGRUProducaoInd = 0;

        tableData.forEach(item => {
          PECPRODGRUProducaoInd += newData.FUNCAO === 'C' ? item.PECPRODGRU * 0.3 : item.PECPRODGRU * 0.4;
        });
        console.log("Produção  do grupo:", PECPRODGRU)
        console.log("Produção individual do grupo:", PECPRODGRUProducaoInd);

        const countByGroup = {};
        tableData.forEach(item => {
          countByGroup[item.PECGRUPO] = (countByGroup[item.PECGRUPO] || 0) + 1;
        });
        console.log("Contagem de colaboradores por grupo:", countByGroup);

        if (countByGroup[PECGRUPO] < 3) {
          const countC = tableData.filter(item => item.PECGRUPO === PECGRUPO && item.FUNCAO === 'C').length;
          const countP = tableData.filter(item => item.PECGRUPO === PECGRUPO && item.FUNCAO === 'P').length;

          if (countC === 2) {
            console.log("Duas pessoas na função 'C' encontradas.");
            const PECPRODGRUPerColab = PECPRODGRU / countByGroup[PECGRUPO];
            console.log("Produção por colaborador:", PECPRODGRUPerColab);
            for (let i = 0; i < tableData.length; i++) {
              const item = tableData[i];
              if (item.PECGRUPO === PECGRUPO) {
                if (item.FUNCAO === 'C') {
                  item.PECPRODGRU = PECPRODGRUPerColab;
                  item.PECPRODIND = PECPRODIND;
                }
              }
            }
          } else if (countC === 1 && countP === 1) {
            console.log("Uma pessoa na função 'C' e uma na função 'P' encontradas.");
            const PECPRODGRUP = PECPRODGRU * 0.6;
            const PECPRODGRUC = PECPRODGRU * 0.4;
            console.log("Produção do grupo para C:", PECPRODGRUC);
            console.log("Produção do grupo para P:", PECPRODGRUP);
            for (let i = 0; i < tableData.length; i++) {
              const item = tableData[i];
              if (item.PECGRUPO === PECGRUPO) {
                if (item.FUNCAO === 'C') {
                  item.PECPRODGRU = PECPRODGRUC;
                  item.PECPRODIND = PECPRODIND;
                } else if (item.FUNCAO === 'P') {
                  item.PECPRODGRU = PECPRODGRUP;
                  item.PECPRODIND = PECPRODIND;
                }
              }
            }
          }

          setTableData((prevTableData) => {
            const updatedTableData = prevTableData.map((item) => {
              const dataIndex = orderArray.findIndex((newData) => newData.PECCODCOL === item.PECCODCOL);
              if (dataIndex !== -1) {
                const newData = orderArray[dataIndex];
                // Atualiza os dados do colaborador com os valores corretos
                return {
                  ...item,
                  PECPRODGRU: newData.PECPRODGRU,
                  PECPRODIND: newData.PECPRODIND,
                };
              }
              return item;
            });
            return updatedTableData;
          });
        } else {
          for (let i = 0; i < newData.porcentagemTrabalhada.length; i++) {
            if (newData.porcentagemTrabalhada[i] < 100) {
              let PECPRODGRUReceber = 0;

              for (const item of tableData) {
                const percentual = newData.FUNCAO === 'C' ? 0.3 : 0.4;
                const valor = item.PECPRODGRU * percentual;
                PECPRODGRUReceber += valor;
              }

              PECPRODGRUReceber *= newData.porcentagemTrabalhada[i] / 100;


              const desconto = PECPRODGRUProducaoInd - PECPRODGRUReceber;

              PECPRODGRU = PECPRODGRUReceber;
              newData.PECPRODGRU = PECPRODGRU;
              newData.PECPRODIND = PECPRODIND;

              for (const colab of tableData) {
                if (colab.PECGRUPO === newData.PECGRUPO && colab.PECCODCOL !== newData.PECCODCOL) {
                  let percentual;
                  if (colab.FUNCAO === 'C') {
                    percentual = 0.3;
                  } else {
                    percentual = 0.4;
                  }
                  if (percentual !== undefined) {
                    const valorReceber = desconto * percentual;
                    colab.PECPRODGRU += valorReceber;
                  }
                }
              }
            } else {
              let PECPRODGRU = 0; // Inicializado com 0
              let PECPRODIND = newData.PECPRODIND; // P

              for (const item of tableData) {
                const percentual = newData.FUNCAO === 'C' ? 0.3 : 0.4;
                const valor = item.PECPRODGRU * percentual;
                PECPRODIND += valor;
              }

            }
          }

          // Configura os dados atualizados na tabela.
          setTableData((prevTableData) => {
            const updatedTableData = [...prevTableData];
            const dataIndex = updatedTableData.findIndex((item) => item.PECCODCOL === newData.PECCODCOL);
            if (dataIndex !== -1) {
              updatedTableData[dataIndex].PECPRODGRU = PECPRODGRU;
              updatedTableData[dataIndex].PECPRODIND = PECPRODIND;
            }
            return updatedTableData;
          });
        }
      }
    } catch (error) {
      console.error("Erro ao calcular a produção:", error.message);
    }
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
              selected={selectedDateIni}
              onChange={(date) => setSelectedDateIni(date)}
              dateFormat="dd/MM/yyyy"
              isClearable
              placeholderText="Selecione uma data Inicial"
              popperPlacement="right-start"
              customInput={<input style={{ background: '#fff', border: '1px solid ', borderRadius: 'none' }} />}
              locale="ptBR"
            />
            <DatePicker
              selected={selectedDateFinal}
              onChange={(date) => setSelectedDateFinal(date)}
              dateFormat="dd/MM/yyyy"
              isClearable
              placeholderText="Selecione uma data Final"
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
          </Flex>
        </Flex>
        <Flex direction="column" justifyContent="flex-end" mr="50px" >
          <Button ml="20px" colorScheme="blue" bg="#465687" color="white" onClick={BuscaDados}>
            Buscar Dados
          </Button>
          <Button ml="20px" mt="10px" colorScheme="blue" bg="#465687" color="white" onClick={calcularProducao}>
            Recalcular
          </Button>
          <Button ml="20px" mt="10px" colorScheme="blue" bg="#465687" color="white" onClick={handleEnviarDados}>
            Atualizar Dados
          </Button>

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
              <Th>Data</Th>
              <Th>Grupo</Th>
              <Th>Nome Colaborador</Th>
              <Th>Função</Th>
              <Th>Hr Jornada</Th>
              <Th>Hr Trabalhada</Th>
              <Th>%</Th>
              <Th>Prod Grupo</Th>
              <Th>Prod Ind</Th>
              <Th>Horas Paradas</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((item, index) => (
              <Tr key={index}>
                <Td>{item.PECEMP}</Td>
                <Td>{item.PECDATA}</Td>
                <Td>{item.PECGRUPO}</Td>
                <Td>{item.FP02NOM}</Td>
                <Td>{item.FUNCAO}</Td>
                <Td>
                  <Input
                    bg="white"
                    border="1px solid gray"
                    borderRadius="md"
                    p="2"
                    w="100px"
                    name="HORA_DIA"
                    value={editedValues[index]?.HORA_DIA || item.HORA_DIA || ""}
                    onChange={(event) => handleInputChange(event, index)}
                  />


                </Td>
                <Td>
                  <Input
                    bg="white"
                    border="1px solid gray"
                    borderRadius="md"
                    p="2"
                    w="100px"
                    name="HORA_TRAB_MEDIA"
                    value={editedValues[index]?.HORA_TRAB_MEDIA || (typeof item.HORA_TRAB_MEDIA === 'number' ? item.HORA_TRAB_MEDIA.toFixed(4) : "")}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                </Td>
                <Td>{item.porcentagemTrabalhada ? item.porcentagemTrabalhada.toFixed(4) : ""}</Td>

                <Td>
                  <Input
                    bg="white"
                    border="1px solid gray"
                    borderRadius="md"
                    p="2"
                    w="100px"
                    name="PECPRODGRU"
                    value={editedValues[index]?.PECPRODGRU || (typeof item.PECPRODGRU === 'number' ? item.PECPRODGRU.toFixed(4) : "")}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                </Td>
                <Td>
                  <Input
                    bg="white"
                    border="1px solid gray"
                    borderRadius="md"
                    p="2"
                    w="100px"
                    name="PECPRODIND"
                    value={editedValues[index]?.PECPRODIND || (typeof item.PECPRODIND === 'number' ? item.PECPRODIND.toFixed(4) : "")}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                </Td>

                <Td>
                  <Input
                    bg="white"
                    border="1px solid gray"
                    borderRadius="md"
                    p="2"
                    w="100px"
                    name="PECHRPAR"
                    value={
                      editedValues[index]?.PECHRPAR ||
                      (typeof item.PECHRPAR === 'number' ? item.PECHRPAR.toFixed(4) : "")
                    }
                    onChange={(event) => handleInputChange(event, index)}
                  />

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
      {console.log('a', tableData)}
    </Box>
  );
};

export default RecalculoPecista;
