import React, { useState, useEffect } from "react";
import {
  Box,Table,Thead,Tr,Th,Tbody,Td,Input,Button,Flex
} from "@chakra-ui/react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function ConsultaBancas() {
  const [apiData, setApiData] = useState([]);
  const [dataIni, setDataIni] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [prestador, setPrestador] = useState("");
  const [secao, setSecao] = useState("");
  const [usuario, setUsuario] = useState("");
  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = "http://127.0.0.1:5000/api/consultBancas";
      const params = {
        dataIni: dataIni,
        dataFim: dataFim,
        prestador: prestador,
        secao: secao,
        usuario: usuario
      };

      
      const response = await axios.get(apiUrl, { params });

      if (response.status === 200) {
        setApiData(response.data);
        console.log(apiData)
      } 
    } catch (error) {
      console.error("Erro ao buscar dados da API2:", error);
    }
  };
  // useEffect(() => {
  //   fetchDataFromAPI();
    
  // }, [ apiData]);
   // Função para agrupar os dados


   const sumData = (data) => {
    const summaryData = {};
  
    data.forEach((item) => {
      const key = `${item.PRESTADORES} - ${item.SECAO} - ${item.USUARIO_ENV}` ;
      if (!summaryData[key]) {
        summaryData[key] = { FICHA: 0, NOTAS: 0 };
      }
      if (item.CLASS === "FICHA") {
        summaryData[key].FICHA += item.QTDE;
      } else if (item.CLASS === "NOTAS") {
        summaryData[key].NOTAS += item.QTDE;
      }
    });
  
    return summaryData;
  };
 
  return (
    <Flex bg="gray.200" height="100vh">
    <Box bg="gray.200" width="100%">
      <Input  height="28px"  m="7px"   width="200px" background="#fff" 
        type="text"
        value={dataIni}
        onChange={(e) => setDataIni(e.target.value)}
        placeholder="Data Inicial"
      />
      <Input  height="28px"  m="7px"   width="200px" background="#fff" 
        type="text"
        value={dataFim}
        onChange={(e) => setDataFim(e.target.value)}
        placeholder="Data Final"
      />
      <Button m="7px"    width="200px" colorScheme='blue' bg="#465687" color="white"   type="submit"
        onClick={fetchDataFromAPI}
          >Buscar
      </Button>

      <Table variant="simple">
  <Thead>
    <Tr key="select-all">
      {/* <Th w="7px"></Th> */}
      <Th>PRESTADOR</Th>
      <Th>SEÇÃO</Th>
      <Th>USUARIO</Th>
      <Th>QUANTIDADE DE FICHA</Th>
      <Th>QUANTIDADE DE NOTAS</Th>
      <Th>ANÁLISE</Th>
    </Tr>
  </Thead>
  <Tbody>
    {Object.entries(sumData(apiData)).map(([key, values], index) => {
      const [prestador, secao, usuario_env] = key.split(" - ");
      const analise = values.FICHA + values.NOTAS;
      return (
        <Tr key={index}>
          {/* <Td> <Box color={analise == 0 ? "green" : "red"}   display="inline-block" p={1} borderRadius="md">{index + 1}</Box></Td> */}
          <Td><Box color={analise == 0 ? "green" : "red"}   display="inline-block" p={1} borderRadius="md">{prestador}</Box></Td>
          <Td><Box color={analise == 0 ? "green" : "red"}   display="inline-block" p={1} borderRadius="md">{secao}</Box></Td>
          <Td><Box color={analise == 0 ? "green" : "red"}   display="inline-block" p={1} borderRadius="md">{usuario_env}</Box></Td>
          <Td><Box color={analise == 0 ? "green" : "red"}   display="inline-block" p={1} borderRadius="md">{values.FICHA}</Box></Td>
          <Td><Box color={analise == 0 ? "green" : "red"}   display="inline-block" p={1} borderRadius="md">{values.NOTAS}</Box></Td>
          <Td><Box color={analise == 0 ? "green" : "red"}   display="inline-block" p={1} borderRadius="md">{analise}</Box></Td>
        </Tr>
      );
    })}
  </Tbody>
</Table>
    </Box>
</Flex>  
)}