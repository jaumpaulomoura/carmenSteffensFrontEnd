import { useState } from "react";
import { Box,Button,Input,Flex,Table, Thead, Tbody, Tr, Th, Td,TableContainer, Image, } from "@chakra-ui/react";
import axios from "axios";
import InputMask from "react-input-mask";


export default function PesModel() {
  const [modelo, setModelo] = useState("");
  const [custo, setCusto] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [resultado, setResultado] = useState([]);
  const [resultadoTotal, setResultadoTotal] = useState(0);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const api_url = "http://localhost:5000/api/queryEnt";
    // const api_url = "http://localhost:5000/api/queryEnt";
    const params = {
      modelo: modelo,
      dataInicial: dataInicial,
      dataFinal: dataFinal,
      custo: custo,
    };

    try {
      const response = await axios.get(api_url, { params });

      if (response.status === 200) {
        console.log("Resultados:", response.data);
        setResultado(response.data);
        const total = calcularTotal(response.data);
        setResultadoTotal(total);
      } else {
        console.error("Erro na solicitação:", response.statusText);
      }
      
    } catch (error) {
      console.error("Erro na solicitação:", error.message);
    }
  };
  const handleExportExcel = async () => {
    try {
      const exportParams = {
        modelo: modelo,
        dataInicial: dataInicial,
        dataFinal: dataFinal,
        custo: custo,
      };
  
      const response = await axios.get("http://localhost:5000/api/exportEnt/excel", {
        params: exportParams,
        responseType: "blob",
      });
  
      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
  
        const url = window.URL.createObjectURL(blob);
  
        const link = document.createElement("a");
        link.href = url;
        link.download = "resultado.xlsx";
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Erro ao exportar para Excel:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error.message);
    }
  };

  const renderTable = () => {
    return (
      <Box m="10px" borderRadius="10px" width="40%" border="1px solid">
        <TableContainer width="100%">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Modelo</Th>
                <Th>Tamanho</Th>
                <Th>Quantidade</Th>
              </Tr>
            </Thead>
            <Tbody>
              {resultado.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.PC23MODELO}</Td>
                  <Td>{item.TAMANHO}</Td>
                  <Td>{item.TOTAL}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <TableContainer width="100%">
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td fontWeight="bold">Total: </Td>
                <Td></Td>
                <Td fontWeight="bold">{resultadoTotal}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  
  function calcularTotal(resultados) {
    let total = 0;
  
    resultados.forEach((item) => {
      total += item.TOTAL;
    });
  
    return total;
  }
const limparResultados = () => {
  setResultado([]);
};
  

  return (
    <Box bg="#fff" >
      
      <Flex  as="form" ml="2px"m="5px"background="#283156"  borderRadius="10px" width="99,7%" border="1px solid" >
        <Flex direction="row" width="80%">
        <Input m="10px" placeholder='Modelo' marginBottom="10px" width="200px" background="#fff" mt="30px"
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            Modelo
          />
          <Input m="10px" placeholder='Seção' marginBottom="10px" width="200px" background="#fff" mt="30px"
            type="text"
            value={custo}
            onChange={(e) => setCusto(e.target.value)}
            Custo
          />
          <InputMask
            mask="99/99/9999" // Define a máscara de data (dd/mm/yyyy)
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                m="10px"
                marginBottom="10px"
                width="200px"
                background="#fff"
                mt="30px"
                type="text"
                placeholder="Data Inicial"
              />
            )}
          </InputMask>

          <InputMask
            mask="99/99/9999" // Define a máscara de data (dd/mm/yyyy)
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                m="12px"
                marginBottom="10px"
                width="200px"
                background="#fff"
                mt="30px"
                type="text"
                placeholder="Data Final"
              />
            )}
          </InputMask>
          
          <Button m="10px"  marginBottom="10px" mt="30px" width="200px" colorScheme='blue' bg="#465687" color="white"   type="submit" onClick={handleSubmit}> 
            Buscar Modelo
          </Button>
          <Button m="10px"  marginBottom="10px" mt="30px" width="200px" colorScheme="red" color="white"   type="submit"
            onClick={limparResultados}
          >
            Limpar
          </Button>

          <Button m="10px"  marginBottom="10px" mt="30px" width="200px" colorScheme='blue' bg="#465687" color="white"   type="submit"
          onClick={handleExportExcel}
        >
          Exportar para Excel
        </Button>
        </Flex>
        <Flex direction="row-reverse"width="20%">
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
        
      {resultado.length > 0 && renderTable()} 
    </Box>
  );
}

