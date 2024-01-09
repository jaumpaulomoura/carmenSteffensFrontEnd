import React, { useState} from "react";
import { Box, Button, Input, Flex, Table, Thead, Tbody, Tr, Th, Td, TableContainer,Image } from "@chakra-ui/react";
import axios from "axios";
import {FaSearch } from 'react-icons/fa';

import {FiRefreshCcw } from 'react-icons/fi';



export default function FichaExpedicao() {
  const [empNf, setEmpNf] = useState("");
  const [modNf, setModNf] = useState("");
  const [nota, setNota] = useState("");
  const [resultado, setResultado] = useState([]);
  

  
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
      const api_url = "http://192.168.12.58:5000/api/canEnvNf";
      
      const params = {
        empNf: empNf,
        modNf: modNf,
        nota: nota
      };
      try {
        const response = await axios.get(api_url, { params });
  
        if (response.status === 200) {
          console.log("Resultados:", response.data);
          setResultado(response.data);
          
        } else {
          console.error("Erro na solicitação:", response.statusText);
        }
        
      } catch (error) {
        console.error("Erro na solicitação:", error.message);
      }
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        const api_url = "http://192.168.12.58:5000/api/atuaEnvNf"; // Rota de atualização
      
        // Defina os parâmetros para a atualização, assim como você fez na função de consulta
        const params = {
          empNf: empNf, // Substitua com o valor correto
          modNf: modNf, // Substitua com o valor correto
          nota: nota,   // Substitua com o valor correto
        };
      
        try {
          const response = await axios.get(api_url, { params });
      
          if (response.status === 200) {
            console.log("Atualização bem-sucedida:", response.data);
            // Faça o que for necessário após a atualização bem-sucedida
          } else {
            console.error("Erro na solicitação de atualização:", response.statusText);
          }
        } catch (error) {
          console.error("Erro na solicitação de atualização:", error.message);
        }
      };
      
            
    const renderTable = () => {
        return (
          <Box m="10px" borderRadius="10px" width="99%" border="1px solid">
            <TableContainer width="100%">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Emp.</Th>
                    <Th>Mod.</Th>
                    <Th>Nota</Th>
                    <Th>Cod.Clente</Th>
                    <Th>Tip.Cli</Th>
                    <Th>Nome Cliente</Th>
                    <Th>Dt.Emissão</Th>
                    <Th>Enviado</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {resultado.map((item, index) => (
                    <Tr key={index}>
                        <Td>{item.EMPNF}</Td>
                        <Td>{item.MODNF}</Td>
                        <Td>{item.NF}</Td>
                        <Td>{item.COD_FOR}</Td>
                        <Td>{item.TIP_CLI}</Td>
                        <Td>{item.NOME_FOR}</Td>
                        <Td>{item.DT_EMI}</Td>
                        <Td>{item.ENVIADO}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            </Box>
    );
  };
  const limparResultados = () => {
    setResultado([]);
  };
  return (
    <Box bg="#fff" >
      
      <Flex  as="form" ml="2px"m="5px"background="#283156"  borderRadius="10px" width="99,7%" border="1px solid" >
        <Flex direction="row" width="80%">
        <Input m="10px" placeholder='Empresa Nota' marginBottom="10px" width="200px" background="#fff" mt="30px"
            type="text"
            value={empNf}
            onChange={(e) => setEmpNf(e.target.value)}
            Modelo
          />
          <Input m="10px" placeholder='Modelo Nota' marginBottom="10px" width="200px" background="#fff" mt="30px"
            type="text"
            value={modNf}
            onChange={(e) => setModNf(e.target.value)}
            Custo
          />
           <Input m="10px" placeholder='NF' marginBottom="10px" width="200px" background="#fff" mt="30px"
            type="text"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            Custo
          />
       
          <Button  m="10px"  marginBottom="10px"  mt="30px"  width="200px"  colorScheme='blue'  bg="#465687"  color="white"  type="submit"  onClick={handleSubmit}  display="flex"  alignItems="center"  >
            
            <FaSearch style={{ marginRight: "5px" }} />
            Consultar
          </Button>
          <Button  m="10px"  marginBottom="10px"  mt="30px"  width="200px"  colorScheme='blue'  bg="#465687"  color="white"  type="submit"  onClick={handleUpdate}  
          display="flex"  alignItems="center"  >
            
            <FiRefreshCcw style={{ fontSize: "20px",fontWeight: "bold", marginRight: "5px" }} />
            
            Atualizar
          </Button>
          <Button m="10px"  marginBottom="10px" mt="30px" width="200px" colorScheme="red" color="white"   type="submit"
            onClick={limparResultados}
          >
            Limpar
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
