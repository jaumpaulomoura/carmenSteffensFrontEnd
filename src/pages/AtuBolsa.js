import { useState, useEffect } from 'react';
import { Input, Text, Checkbox, CheckboxGroup, Wrap, Box, Button, Flex, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { format } from 'date-fns';
import axios from 'axios';
import { ptBR } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const AtuBolsa = () => {
  const [dataInicial, setDataInicial] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [results, setResults] = useState([]);
  const [resultsNf, setResultsNf] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [summaryView, setSummaryView] = useState('date');
  const [mergedResults, setMergedResults] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [prestadoresFiltrados, setPrestadoresFiltrados] = useState([prestadores]);
  const [prestadorSelecionado, setPrestadorSelecionado] = useState('todos');

  const toast = useToast();


  const handleViewChange = (view) => {
    setSummaryView(view);
  };
  const fetchDatanf = async () => {
    setLoading(true);
    try {
      const formattedDataInicial = format(dataInicial, 'dd/MM/yyyy');
      const formattedDataFinal = format(dataFinal, 'dd/MM/yyyy');
      const apiUrlNf = "http://localhost:5000/api/autBolsaNf";
      const paramsNf = {
        data_inicial: formattedDataInicial,
        data_final: formattedDataFinal
      };

      const responseNf = await axios.get(apiUrlNf, { params: paramsNf });

      if (responseNf.status === 200) {
        const formattedResultsNf = responseNf.data.map(item => ({
          ...item,
          DATA_REF: format(new Date(item.DATA_REF), 'dd/MM/yyyy')
        }));
        setResultsNf(formattedResultsNf);
      } else {
        console.error("Erro ao buscar dados da API2 - status:", responseNf.status);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API2:", error.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchData = async () => {
    setLoading(true);
    try {
      const formattedDataInicial = format(dataInicial, 'dd/MM/yyyy');
      const formattedDataFinal = format(dataFinal, 'dd/MM/yyyy');
      const apiUrl = "http://localhost:5000/api/autBolsa";
      const params = {
        data_inicial: formattedDataInicial,
        data_final: formattedDataFinal
      };

      const response = await axios.get(apiUrl, { params });

      if (response.status === 200) {
        const formattedResults = response.data.map(item => ({
          ...item,
          DATA_ENV_FICHA: format(new Date(item.DATA_ENV_FICHA), 'dd/MM/yyyy'),
          DATA_BX_FICHA: format(new Date(item.DATA_BX_FICHA), 'dd/MM/yyyy'),
          DTENTREGA: format(new Date(item.DTENTREGA), 'dd/MM/yyyy'),
          COMP: format(new Date(item.COMP), 'dd/MM/yyyy'),
          PAGTO: format(new Date(item.PAGTO), 'dd/MM/yyyy'),
        }));

        setResults(formattedResults);



      }
    } catch (error) {
      console.error("Erro ao buscar dados da API2:", error);
    }
    setLoading(false);
  };


  const mergeResults = (formattedResultsNf, formattedResults) => {
    const mergedResults = [];

    formattedResultsNf.forEach(itemNf => {
      const matchingItems = formattedResults.filter(item =>
        itemNf.PRESTADOR === item.PRESTADOR &&
        itemNf.DATA_REF === item.DATA_ENV_FICHA &&
        itemNf.NOTAS === item.NF &&
        itemNf.MOD_REF === item.MODELO
      );

      if (matchingItems.length > 0) {
        const totalFichas = matchingItems.reduce((total, currItem) => total + currItem.QTDE_FICHAS, 0);
        mergedResults.push({
          PRESTADOR: itemNf.PRESTADOR,
          DATA_REF: itemNf.DATA_REF,
          NF: itemNf.NOTAS,
          MODELO: itemNf.MOD_REF,
          QTDE_FICHAS_FETCHDATA: totalFichas,
          QTDE_FICHAS_FETCHDATANF: itemNf.QTDE
        });
      } else {
        mergedResults.push({
          PRESTADOR: itemNf.PRESTADOR,
          DATA_REF: itemNf.DATA_REF,
          NF: itemNf.NOTAS,
          MODELO: itemNf.MOD_REF,
          QTDE_FICHAS_FETCHDATANF: itemNf.QTDE,
          QTDE_FICHAS_FETCHDATA: 0
        });
      }
    });

    return mergedResults;
  };



  const exportToExcel = () => {
    try {
      if (results.length === 0) {
        toast({
          title: "Nenhum resultado para exportar",
          description: "Não há resultados para exportar.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const columnOrder = [
        "COD_PREST", "PRESTADOR", "ANO_FICHA", "FICHAS", "DATA_ENV_FICHA", "HORA_ENV_FICHA", "USUARIO_ENV",
        "DATA_BX_FICHA", "HORABX_FICHA", "USUARIO_BX", "PLANO", "SECAO", "MODELO", "QTDE_FICHAS", "VLRUNIT",
        "VLRTOTAL", "VLRMATPRIMA", "RETENÇÃO", "VLRDEP", "NF", "STATUS", "DTENTREGA", "ITEM", "QTD_NF",
        "CODPRO61", "MOD4DIG", "PEDFORN", "VLRDESC", "VLRACRES", "VLRFRETE", "VLROUTRAS", "QTD2", "UNIT", "OP",
        "CFOP", "SEQ", "DESC", "ACRES", "IPI", "ICMS", "DESCITEM", "CCUSTO", "GRUPODESP", "CODDESP", "VLRICMS",
        "COMP", "PAGTO", "FECHAMENTO"
      ];
      const reorderedResults = prestadoresFiltrados.map(item =>
        columnOrder.map(column => item[column])
      );

      const ws = XLSX.utils.aoa_to_sheet([columnOrder, ...reorderedResults]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Resultado");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "Bolsas dinamica.xlsx");
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error.message);
    }
  };
  const getSummaryDate = () => {
    const sortedResults = mergedResults.sort((a, b) => {

      if (a.PRESTADOR < b.PRESTADOR) return -1;
      if (a.PRESTADOR > b.PRESTADOR) return 1;

      if (a.DATA_REF < b.DATA_REF) return -1;
      if (a.DATA_REF > b.DATA_REF) return 1;
      return 0;
    });

    const summary = sortedResults.reduce((acc, item) => {
      const key = `${item.PRESTADOR}-${item.DATA_REF}`;
      if (!acc[key]) {
        acc[key] = { ...item, QTDE_NF: item.QTDE_FICHAS_FETCHDATANF || 0, QTDE_FICHAS: item.QTDE_FICHAS_FETCHDATA || 0 };
      } else {
        acc[key].QTDE_NF += item.QTDE_FICHAS_FETCHDATANF || 0;
        acc[key].QTDE_FICHAS += item.QTDE_FICHAS_FETCHDATA || 0;
      }
      return acc;
    }, {});

    return Object.values(summary);
  };

  const getSummaryNf = () => {
    const sortedResults = mergedResults.sort((a, b) => {

      if (a.PRESTADOR < b.PRESTADOR) return -1;
      if (a.PRESTADOR > b.PRESTADOR) return 1;

      if (a.DATA_REF < b.DATA_REF) return -1;
      if (a.DATA_REF > b.DATA_REF) return 1;

      if (a.NF < b.NF) return -1;
      if (a.NF > b.NF) return 1;
      return 0;
    });

    const summary = sortedResults.reduce((acc, item) => {
      const key = `${item.DATA_REF}-${item.PRESTADOR}-${item.NF}`;
      if (!acc[key]) {
        acc[key] = { ...item, QTDE_NF: item.QTDE_FICHAS_FETCHDATANF || 0, QTDE_FICHAS: item.QTDE_FICHAS_FETCHDATA || 0 };
      } else {
        acc[key].QTDE_NF += item.QTDE_FICHAS_FETCHDATANF || 0;
        acc[key].QTDE_FICHAS += item.QTDE_FICHAS_FETCHDATA || 0;
      }
      return acc;
    }, {});

    return Object.values(summary);
  };

  const getSummaryModelo = () => {
    const sortedResults = mergedResults.sort((a, b) => {

      if (a.PRESTADOR < b.PRESTADOR) return -1;
      if (a.PRESTADOR > b.PRESTADOR) return 1;

      if (a.DATA_REF < b.DATA_REF) return -1;
      if (a.DATA_REF > b.DATA_REF) return 1;

      if (a.NF < b.NF) return -1;
      if (a.NF > b.NF) return 1;

      if (a.MODELO < b.MODELO) return -1;
      if (a.MODELO > b.MODELO) return 1;
      return 0;
    });

    const summary = sortedResults.reduce((acc, item) => {
      const key = `${item.DATA_REF}-${item.PRESTADOR}-${item.NF}-${item.MODELO}`;
      if (!acc[key]) {
        acc[key] = { ...item, QTDE_NF: item.QTDE_FICHAS_FETCHDATANF || 0, QTDE_FICHAS: item.QTDE_FICHAS_FETCHDATA || 0 };
      } else {
        acc[key].QTDE_NF += item.QTDE_FICHAS_FETCHDATANF || 0;
        acc[key].QTDE_FICHAS += item.QTDE_FICHAS_FETCHDATA || 0;
      }
      return acc;
    }, {});

    return Object.values(summary);
  };


  const renderSummaryTable = () => {
    switch (summaryView) {
      case 'date':
        return (

          <table style={{ marginTop: '10px', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Prestador</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Data Referência</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Quantidade de Notas</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Quantidade de Fichas</th>
              </tr>
            </thead>
            <tbody>
              {getSummaryDate().map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.PRESTADOR.split(' ')[0]}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.DATA_REF}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.QTDE_NF}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.QTDE_FICHAS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'nf':
        return (
          <table style={{ marginTop: '10px', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Prestador</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Data Referência</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>NF</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Quantidade de Notas</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Quantidade de Fichas</th>
              </tr>
            </thead>
            <tbody>
              {getSummaryNf().map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.PRESTADOR.split(' ')[0]}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.DATA_REF}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.NF}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.QTDE_NF}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.QTDE_FICHAS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'modelo':
        return (
          <table style={{ marginTop: '10px', width: '100%', borderCollapse: 'collapse' }} overflowY="scroll">
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Prestador</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Data Referência</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>NF</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Modelo</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Quantidade de Notas</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Quantidade de Fichas</th>
              </tr>
            </thead>
            <tbody overflowY="scroll">
              {getSummaryModelo().map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.PRESTADOR.split(' ')[0]}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.DATA_REF}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.NF}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.MODELO}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.QTDE_NF}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.QTDE_FICHAS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };




  useEffect(() => {
    setPrestadores(results);
    setPrestadoresFiltrados(results);
  }, [results]);


  const handlePrestadorChange = (values) => {
    setPrestadorSelecionado(values);
    filtrarPrestadores(values);
  };
  const filtrarPrestadores = (prestadoresSelecionados) => {
    if (prestadoresSelecionados.includes('todos')) {
      setPrestadoresFiltrados(prestadores);
    } else {
      const prestadoresFiltrados = prestadores.filter(item => prestadoresSelecionados.includes(item.PRESTADOR));
      setPrestadoresFiltrados(prestadoresFiltrados);
    }
  };

  const prestadoresUnicos = prestadores.reduce((acc, current) => {
    if (!acc.some(p => p.PRESTADOR === current.PRESTADOR)) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <Box p={2}>

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
        <Flex direction="column" ml="5px" mt="2px" maxHeight="100vh">
          <Text as="h1" fontSize="xx-large" color="white" mb={4}>
            Automação das Bolsas
          </Text>
          <Flex mr="10px">
            <Flex direction="column" h="90%" w="40vh">
              <Flex align="center" mb="10px">
                <Text w="22%" mr="3px" color="white">
                  Data inicial:
                </Text>
                <DatePicker
                  selected={dataInicial}
                  onChange={(date) => setDataInicial(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecione uma data inicial"
                  customInput={
                    <input
                      style={{
                        background: '#EDF2F7',
                        border: '1px solid',
                        borderRadius: '5px',
                        width: '100%',
                      }}
                    />
                  }
                  locale={ptBR}
                />
              </Flex>
              <Flex align="center" mb="10px">
                <Text w="22%" mr="3px" color="white">
                  Data final:
                </Text>
                <DatePicker
                  selected={dataFinal}
                  onChange={(date) => setDataFinal(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecione uma data final"
                  customInput={
                    <input
                      style={{
                        background: '#EDF2F7',
                        border: '1px solid',
                        borderRadius: '5px',
                        width: '100%',
                      }}
                    />
                  }
                  locale={ptBR}
                />
              </Flex>
            </Flex>
            <Flex
            mt="12px"
              ml="-20px"
              direction="row"
              justifyItems="flex-start"
              bg="gray.100"
              h="90%"
              w="50%"
              borderRadius="md"
            >
              <CheckboxGroup
                ml="3px"
                colorScheme="blue"
                value={prestadorSelecionado}
                onChange={handlePrestadorChange}
                h="100%"
                w="100%"
              >
                <Wrap ml="3px" h="100%" w="100%" spacing={2}>
                  <Checkbox value="todos">Todos</Checkbox>
                  {prestadoresUnicos.map((prestador, index) => (
                    <Checkbox key={index} value={prestador.PRESTADOR}>
                      {prestador.PRESTADOR.split(' ')[0]}
                    </Checkbox>
                  ))}
                </Wrap>
              </CheckboxGroup>
            </Flex>
            <Input bg="gray.100" w="30%" ml="5px" placeholder="Exceção de Nf" />
          </Flex>
        </Flex>


        <Flex direction="column" justifyContent="flex-end" mr="50px" >
          <Button
            ml="20px"
            colorScheme="blue"
            bg="#465687"
            color="white"
            onClick={async () => {
              setLoading(true);
              try {
                const [dataResults, nfResults] = await Promise.all([fetchData(), fetchDatanf()]);
                await mergeResults(dataResults, nfResults);
              } catch (error) {
                console.error("Erro ao buscar dados:", error);
              } finally {
                setLoading(false);
              }
            }}
            isLoading={loading}
          >
            Buscar
          </Button>



          <Button mt="10px"
            ml="20px"
            colorScheme="blue"
            bg="#465687"
            color="white"
            onClick={exportToExcel}
            isDisabled={results.length === 0}
            _disabled={{ bg: "#465687", color: "#fff" }}
          >
            Exportar para Excel
          </Button>
          <Button
            mt="10px"
            ml="20px"
            colorScheme="green"
            onClick={() => {
              try {
                setLoading(true);

                const merged = mergeResults(resultsNf, results);
                setMergedResults(merged);


                onOpen();


                onOpen();
              } catch (error) {
                console.error("Erro ao mesclar resultados:", error);
              } finally {
                setLoading(false);
              }
            }}
          >
            Resumo
          </Button>

        </Flex>


      </Flex >

      <Box>
        {loading && <p>Carregando...</p>}
        {!loading && results.length > 0 && (
          <ReactTable
            data={prestadoresFiltrados}
            columns={[
              { Header: 'COD_PREST', accessor: 'COD_PREST' },
              { Header: 'PRESTADOR', accessor: 'PRESTADOR' },
              { Header: 'ANO_FICHA', accessor: 'ANO_FICHA' },
              { Header: 'FICHAS', accessor: 'FICHAS' },
              { Header: 'DATA_ENV_FICHA', accessor: 'DATA_ENV_FICHA' },
              { Header: 'HORA_ENV_FICHA', accessor: 'HORA_ENV_FICHA' },
              { Header: 'USUARIO_ENV', accessor: 'USUARIO_ENV' },
              { Header: 'DATA_BX_FICHA', accessor: 'DATA_BX_FICHA' },
              { Header: 'HORABX_FICHA', accessor: 'HORABX_FICHA' },
              { Header: 'USUARIO_BX', accessor: 'USUARIO_BX' },
              { Header: 'PLANO', accessor: 'PLANO' },
              { Header: 'SECAO', accessor: 'SECAO' },
              { Header: 'MODELO', accessor: 'MODELO' },
              { Header: 'QTDE_FICHAS', accessor: 'QTDE_FICHAS' },
              { Header: 'VLRUNIT', accessor: 'VLRUNIT' },
              { Header: 'VLRTOTAL', accessor: 'VLRTOTAL' },
              { Header: 'VLRMATPRIMA', accessor: 'VLRMATPRIMA' },
              { Header: 'RETENÇÃO', accessor: 'RETENÇÃO' },
              { Header: 'VLRDEP', accessor: 'VLRDEP' },
              { Header: 'NF', accessor: 'NF' },
              { Header: 'STATUS', accessor: 'STATUS' },
              { Header: 'DTENTREGA', accessor: 'DTENTREGA' },
              { Header: 'ITEM', accessor: 'ITEM' },
              { Header: 'QTD_NF', accessor: 'QTD_NF' },
              { Header: 'CODPRO61', accessor: 'CODPRO61' },
              { Header: 'MOD4DIG', accessor: 'MOD4DIG' },
              { Header: 'PEDFORN', accessor: 'PEDFORN' },
              { Header: 'VLRDESC', accessor: 'VLRDESC' },
              { Header: 'VLRACRES', accessor: 'VLRACRES' },
              { Header: 'VLRFRETE', accessor: 'VLRFRETE' },
              { Header: 'VLROUTRAS', accessor: 'VLROUTRAS' },
              { Header: 'QTD2', accessor: 'QTD2' },
              { Header: 'UNIT', accessor: 'UNIT' },
              { Header: 'OP', accessor: 'OP' },
              { Header: 'CFOP', accessor: 'CFOP' },
              { Header: 'SEQ', accessor: 'SEQ' },
              { Header: 'DESC', accessor: 'DESC' },
              { Header: 'ACRES', accessor: 'ACRES' },
              { Header: 'IPI', accessor: 'IPI' },
              { Header: 'ICMS', accessor: 'ICMS' },
              { Header: 'DESCITEM', accessor: 'DESCITEM' },
              { Header: 'CCUSTO', accessor: 'CCUSTO' },
              { Header: 'GRUPODESP', accessor: 'GRUPODESP' },
              { Header: 'CODDESP', accessor: 'CODDESP' },
              { Header: 'VLRICMS', accessor: 'VLRICMS' },
              { Header: 'COMP', accessor: 'COMP' },
              { Header: 'PAGTO', accessor: 'PAGTO' },
              { Header: 'FECHAMENTO', accessor: 'FECHAMENTO' },
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            previousText="Anterior"
            nextText="Próximo"
            loadingText="Carregando..."
            noDataText="Nenhum dado encontrado"
            pageText="Página"
            ofText="de"
            rowsText="linhas"
          />
        )}
        {!loading && results.length === 0 && <p>Nenhum resultado encontrado.</p>}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resumo por Data e Prestador</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="70vh" overflowY="auto">
            <Button mr={2} onClick={() => handleViewChange('date')}>Por Data</Button>
            <Button mr={2} onClick={() => handleViewChange('nf')}>Por NF</Button>
            <Button onClick={() => handleViewChange('modelo')}>Por Modelo</Button>

            {renderSummaryTable()}
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </ModalContent>
      </Modal>




    </Box >
  );
};

export default AtuBolsa;
