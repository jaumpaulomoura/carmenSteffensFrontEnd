import React, { useState} from "react";
import { useToast, Box, Button, Input, Flex, Table, Thead, Tbody, Tr, Th, Td, TableContainer,Image } from "@chakra-ui/react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { useDropzone } from "react-dropzone";

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}



export default function FichaExpedicao() {
  const [ano, setAno] = useState("");
  const [ficha, setFicha] = useState("");
  const [valorCompleto, setValorCompleto] = useState("");
  const [resultados, setResultados] = useState([]);
  const toast = useToast();

  
  const handleImportExcel = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
  
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        const fichasByYear = {};
  
        
      } catch (error) {
        console.error("Erro ao importar Excel:", error.message);
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  const fetchResultsFromBackend = async (ano, batchFichas) => { // Correção no nome do parâmetro
    try {
      const api_url = "http://localhost:5000/api/queryFicha";
      
      const params = {
        ano: ano,
        ficha: batchFichas.join(","), // Join fichas with commas
      };
      console.log(params)
      const response = await axios.get(api_url, { params });
  
      if (response.status === 200) {
        const newResults = response.data;
        setResultados((prevResults) => [...prevResults, ...newResults]);
      } else {
        console.error("Erro na solicitação:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na solicitação:", error.message);
    }
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!ano && !ficha && !valorCompleto) {
      toast({
        title: "Preencha ao menos um campo",
        description: "Preencha o campo de ano, ficha ou ano + ficha.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    let extractedAno = "";
    let extractedFicha = "";
  
    if (valorCompleto) {
      if (valorCompleto.length === 10) {
        extractedAno = valorCompleto.substring(0, 4);
        extractedFicha = valorCompleto.substring(4).replace(/^0+/, '');
      } else if (valorCompleto.length === 4) {
        extractedAno = valorCompleto;
      } else {
        // Separar ano e ficha quando ambos estão juntos
        const fullValue = valorCompleto.replace(/^0+/, ''); // Remover zeros à esquerda
        extractedAno = fullValue.substring(0, 4);
        extractedFicha = fullValue.substring(4);
      }
    }
  
    const api_url = "http://localhost:5000/api/queryFicha";
    const params = {
      ano: ano || extractedAno,
      ficha: ficha || extractedFicha,
    };
  
    try {
      const response = await axios.get(api_url, { params });
  
      if (response.status === 200) {
        const newResults = response.data.filter(
          (newResult) =>
            !resultados.some(
              (existingResult) =>
                existingResult.ANO === newResult.ANO &&
                existingResult.FICHA === newResult.FICHA
            )
        );
  
        if (newResults.length > 0) {
          setResultados((prevResults) => [...prevResults, ...newResults]);
        } else {
          console.log("Nenhum resultado novo encontrado.");
          toast({
            title: "Resultado Duplicado",
            description: "O resultado já existe na tabela.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        console.error("Erro na solicitação:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na solicitação:", error.message);
    }
  
    setAno("");
    setFicha("");
    setValorCompleto("");
  };
  
  const { getInputProps, getRootProps } = useDropzone({
    accept: ".xlsx",
    onDrop: handleImportExcel,
  });
  const handleExportExcel = async () => {
    try {
      console.log(resultados)
      if (resultados.length === 0) {
        toast({
          title: "Nenhum resultado para exportar",
          description: "Não há resultados para exportar.",
          status: "warning",
          duration: 30000,
          isClosable: true,
        });
        return;
      }
  
      const data = resultados.map((item) => {
        return [
          item.EMPRESA,
          item.ANO,
          item.FICHA,
          item.QTDE,
          item[25],
          item[26],
          item[27],
          item[28],
          item[29],
          item[30],
          item[31],
          item[32],
          item[33],
          item[34],
          item[35],
          item[36],
          item[37],
          item[38],
          item[39],
          item[40],
          item[41],
          item[42],
          item[43],
          item[44],
          item[46],
          item.PP,
          item.P,
          item.M,
          item.G,
          item.GG,
          item.XG,
          item.XGG,
          item.XXG,
          item.UN,
          item.PLANO,
          item.PLANO_ORIGINAL,
          item.MODELO,
          item.COR,
          item.COD_COL,
          item.COLECAO,
          item.COD_LAN,
          item.LANCAMENTO,
          item.COD_CATEGORIA,
          item.CATEGORIA,
          item.COD_CLASS_ITEM,
          item.CLAS_ITEM,
          item.COD_CLASSIFICACAO,
          item.CLASSIFICACAO,
          item.TIPO_PRODUTO,
          item.FABRICA,
          item.NOME_FABRICA,
          item.FORMA,
          item.DESC_FORMA,
          item.COD_GESTOR,
          item.DESC_GESTOR,
          item.GRADE,
          item.DATA_ENTRADA,
          item.HORA_ENTRADA,
          item.USUARIO_ENTRADA,
          item.DATA_SAIDA,
          item.HORA_SAIDA,
          item.USUARIO_SAIDA,
          item.ANOPEDIDO,
          item.PEDIDO,
          item.ITEM_PED,
          item.STATUSPED,
          item.EMBARQUE,
          item.CODIGO_CLIENTE,
          item.DESC_CLI,
        ];
      });
  
      const ws = XLSX.utils.aoa_to_sheet([
        ["EMPRESA", "ANO", "FICHA", "QTDE", "25",	"26",	"27",	"28",	"29",	"30",	"31",	"32",	"33",	"34",	"35",	"36",	"37",	"38",	"39",	"40",	"41",	"42",	"43",	"44",	"46",	"PP",	"P",	"M",	"G",	"GG",	"XG",	"XGG",	"XXG",	"UN",        ,"PLANO", "PLANO_ORIGINAL", "MODELO", "COR", "COD_COL", "COLECAO", "COD_LAN", "LANCAMENTO", "COD_CATEGORIA", "CATEGORIA", "COD_CLASS_ITEM", "CLAS_ITEM", "COD_CLASSIFICACAO", "CLASSIFICACAO", "TIPO_PRODUTO", "FABRICA", "NOME_FABRICA", "FORMA", "DESC_FORMA", "COD_GESTOR", "DESC_GESTOR", "GRADE", "DATA_ENTRADA", "HORA_ENTRADA", "USUARIO_ENTRADA", "DATA_SAIDA", "HORA_SAIDA", "USUARIO_SAIDA", "ANOPEDIDO", "PEDIDO", "ITEM_PED", "STATUSPED", "EMBARQUE", "CODIGO_CLIENTE", "DESC_CLI",],
        ...data,
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Resultado");
  
      const blob = new Blob([s2ab(XLSX.write(wb, { bookType: "xlsx", type: "binary" }))], {
        type: "application/octet-stream",
      });
  
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resultado.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error.message);
    }
  };
  
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  
 
  const renderTable = () => {
    return (
      <Box m="10px" borderRadius="10px" width="99%" height="99%" border="1px solid" >
      <TableContainer width="100%">
        <Table variant='simple'>
        <Thead>
          <Tr>
          <Th>EMPRESA</Th>
          <Th>ANO</Th>
          <Th>FICHA</Th>
          <Th>QTDE</Th>
          <Th>GRADE_CORRIDA</Th>
          <Th>PLANO</Th>
          <Th>PLANO_ORIGINAL</Th>
          <Th>MODELO</Th>
          <Th>COR</Th>
          <Th>COD_COL</Th>
          <Th>COLECAO</Th>
          <Th>COD_LAN</Th>
          <Th>LANCAMENTO</Th>
          <Th>COD_CATEGORIA</Th>
          <Th>CATEGORIA</Th>
          <Th>COD_CLASS_ITEM</Th>
          <Th>CLAS_ITEM</Th>
          <Th>COD_CLASSIFICACAO</Th>
          <Th>CLASSIFICACAO</Th>
          <Th>TIPO_PRODUTO</Th>
          <Th>FABRICA</Th>
          <Th>NOME_FABRICA</Th>
          <Th>FORMA</Th>
          <Th>DESC_FORMA</Th>
          <Th>COD_GESTOR</Th>
          <Th>DESC_GESTOR</Th>
          <Th>GRADE</Th>
          <Th>DATA_ENTRADA</Th>
          <Th>HORA_ENTRADA</Th>
          <Th>USUARIO_ENTRADA</Th>
          <Th>DATA_SAIDA</Th>
          <Th>HORA_SAIDA</Th>
          <Th>USUARIO_SAIDA</Th>
          <Th>ANOPEDIDO</Th>
          <Th>PEDIDO</Th>
          <Th>ITEM_PED</Th>
          <Th>STATUSPED</Th>
          <Th>EMBARQUE</Th>
          <Th>CODIGO_CLIENTE</Th>
          <Th>DESC_CLI</Th>

          </Tr>
        </Thead>
        <Tbody>
              {resultados.map((item, index) => (
              <Tr key={index}>
              <Td>{item.EMPRESA}</Td>
              <Td>{item.ANO}</Td>
              <Td>{item.FICHA}</Td>
              <Td>{item.QTDE}</Td>
              <Td>{item.GRADE_CORRIDA}</Td>
              <Td>{item.PLANO}</Td>
              <Td>{item.PLANO_ORIGINAL}</Td>
              <Td>{item.MODELO}</Td>
              <Td>{item.COR}</Td>
              <Td>{item.COD_COL}</Td>
              <Td>{item.COLECAO}</Td>
              <Td>{item.COD_LAN}</Td>
              <Td>{item.LANCAMENTO}</Td>
              <Td>{item.COD_CATEGORIA}</Td>
              <Td>{item.CATEGORIA}</Td>
              <Td>{item.COD_CLASS_ITEM}</Td>
              <Td>{item.CLAS_ITEM}</Td>
              <Td>{item.COD_CLASSIFICACAO}</Td>
              <Td>{item.CLASSIFICACAO}</Td>
              <Td>{item.TIPO_PRODUTO}</Td>
              <Td>{item.FABRICA}</Td>
              <Td>{item.NOME_FABRICA}</Td>
              <Td>{item.FORMA}</Td>
              <Td>{item.DESC_FORMA}</Td>
              <Td>{item.COD_GESTOR}</Td>
              <Td>{item.DESC_GESTOR}</Td>
              <Td>{item.GRADE}</Td>
              <Td>{item.DATA_ENTRADA}</Td>
              <Td>{item.HORA_ENTRADA}</Td>
              <Td>{item.USUARIO_ENTRADA}</Td>
              <Td>{item.DATA_SAIDA}</Td>
              <Td>{item.HORA_SAIDA}</Td>
              <Td>{item.USUARIO_SAIDA}</Td>
              <Td>{item.ANOPEDIDO}</Td>
              <Td>{item.PEDIDO}</Td>
              <Td>{item.ITEM_PED}</Td>
              <Td>{item.STATUSPED}</Td>
              <Td>{item.EMBARQUE}</Td>
              <Td>{item.CODIGO_CLIENTE}</Td>
              <Td>{item.DESC_CLI}</Td>

            </Tr>
          ))}
        </Tbody>
        </Table>
      </TableContainer>
      </Box>
    );
  };

  

    return (
      <Box bg="#fff">
        <Flex 
        
        direction="row"
        ml="2px"
        m="5px"
        background="#283156"
        
        borderRadius="10px"
        width="99.4%"
        border="1px solid"
      >
      <Flex width="90%">  
      <form 
      
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        
        
          <Input
            m="10px"
            mt="25px"
            marginBottom="10px"
            width="180px"
            background="#fff"
            type="text"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            placeholder="Ano"
          />
          <Input
            m="5px"
            marginBottom="10px"
            width="180px"
            background="#fff"
            type="text"
            value={ficha}
            onChange={(e) => setFicha(e.target.value)}
            placeholder="Ficha"
          />
          <Input
             m="5px"
            marginBottom="10px"
            width="180px"
            background="#fff"
            type="text"
            value={valorCompleto}
            onChange={(e) => setValorCompleto(e.target.value)}
            placeholder="Ano + Ficha"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
             m="5px"
            marginBottom="10px"
            width="180px"
            colorScheme="blue"
            bg="#465687"
            color="white"
            type="submit"
          >
            Buscar Ficha
          </Button>
          
          <Button
             m="5px"
            marginBottom="10px"
            width="180px"
            colorScheme="blue"
            bg="#465687"
            color="white"
            onClick={handleExportExcel}
          >
            Exportar para Excel
          </Button>
          <div
          {...getRootProps()}
          style={{ display: 'inline-block' }} 
        >
          <input {...getInputProps()} />
          <Button
            m="5px"
            marginBottom="10px"
            width="180px"
            colorScheme="blue"
            bg="#465687"
            color="white"
          >
            Importar Excel
          </Button>
        </div>

          <Button
             m="5px"
            marginBottom="10px"
            width="180px"
            colorScheme="red"
            onClick={() => setResultados([])}
          >
            Limpar
          </Button>    
          
          
          </form>
          </Flex>
        <Flex direction="row-reverse" width="10%">
        <Image
            boxSize='2rem'
            borderRadius='full'
            src='/logoCS.png'
            alt='Logo CS'
            mt="2px"
            width="130px"
            height="100px"/>
        </Flex>


        
        </Flex>
        
        

      

      {resultados.length > 0 && (
        <div>
          {renderTable()}
        </div>
      )}
    </Box>
  );
}