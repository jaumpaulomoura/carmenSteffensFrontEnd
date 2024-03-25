import React, { useState } from "react";
import { Box, Button, Input, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight, FaStepForward, FaStepBackward, FaSearch } from "react-icons/fa"; // Importe os ícones
import { IoAddCircleOutline } from "react-icons/io5";
import { format } from 'date-fns';
export default function InseriNfBolsa() {
  
  const [dataFromExcel, setDataFromExcel] = useState([]);
  const [dataWithIds, setDataWithIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 17;
  const pageCount = Math.ceil(dataWithIds.length / itemsPerPage);
  const [selectedPage, setSelectedPage] = useState(0);
  const [insercaoConcluida, setInsercaoConcluida] = useState(false);


  const handleFileUpload = async (selectedFile) => {
    console.log("Iniciando handleFileUpload");
    if (!selectedFile) {
      toast.error("Selecione um arquivo para importar.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        console.log("Lendo o arquivo");
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          range: 1,
        });
        if (jsonData.length === 0) {
          toast.error("O arquivo está vazio ou não contém dados na segunda linha.");
          return;
        }
        setDataFromExcel(jsonData);
        console.log("Arquivo processado com sucesso.");
        toast.success("Importação concluída com sucesso.");

        const dataWithIds = jsonData.map((rowData) => {
          const anoPed = rowData[0];
          const pedido = rowData[1];
          const condPag = rowData[2];
        
          return {
            anoPed,
            pedido,
            condPag,
          };
        });

        setDataWithIds(dataWithIds);
      };
      reader.readAsBinaryString(selectedFile);
    } catch (error) {
      console.error("Erro durante a importação do arquivo:", error);
      toast.error("Erro durante a importação do arquivo.");
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    setSelectedPage(selected);
  };

  const filteredData = dataWithIds.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleSelectPage = () => {
    setCurrentPage(selectedPage);
  };

  const goToFirstPage = () => {
    setCurrentPage(0);
    setSelectedPage(0);
  };

  const goToLastPage = () => {
    setCurrentPage(pageCount - 1);
    setSelectedPage(pageCount - 1);
  };


  const enviarJsonParaApi = async () => {
    const api_url = "http://127.0.0.1:5000/api/importVenc"; // Substitua pela URL correta da sua API
    const jsonDataToSend = dataWithIds;

    try {
      const response = await axios.post(api_url, jsonDataToSend);

      if (response.status === 200) {

        setInsercaoConcluida(true); // Atualize o estado para mostrar a mensagem
      } else {
        toast.error("Erro ao enviar o JSON para a API.");
      }
    } catch (error) {
      toast.error("Erro ao enviar o JSON para a API: " + error.message);
    }
  };



  const limparResultados = () => {
    setDataFromExcel([]);
    setDataWithIds([]);
    setCurrentPage(0); // Opcional: Redefina a página atual para a primeira página
    setSelectedPage(0);
  }
  return (
    <Box bg="#fff">
      <>
        <Flex direction="column" height="100vh">
          {insercaoConcluida && (
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
          )}
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

            <Flex direction="column" width="89%" height="100%">



              <Flex height="18%">
                <Text color="#fff" ml="3px" >
                  Inserir NF Bolsas
                </Text>
                {/* <FaSearch style={{ marginLeft: "5px", marginTop:"5px", color:"#fff"}} /> */}
                <IoAddCircleOutline style={{ marginLeft: "5px", marginTop: "5px", color: "#fff" }} />
              </Flex>







              <Flex direction="row" width="100%" height="100%">

                <Flex direction="row" align="flex-start" width="100%" height="100%">


                  <label htmlFor="fileInput" className="custom-file-input"  >
                    <input
                      type="file"
                      id="fileInput"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      accept=".xlsx, .xls"
                      style={{ display: "none" }}
                    />
                    <Button
                      m="10px" mt="20px" marginBottom="10px" width="200px"
                      colorScheme="blue"
                      bg="#465687"
                      color="white"
                      type="button"
                      onClick={() => document.getElementById("fileInput").click()}
                    >
                      Importar Arquivo
                    </Button>
                    <Button
                      m="10px" mt="20px" marginBottom="10px" width="200px"
                      colorScheme="blue"
                      bg="#465687"
                      color="white"
                      type="button"
                      onClick={enviarJsonParaApi}
                    >
                      Inserir Dados
                    </Button>
                  </label>
                  <Button m="10px" mt="20px" marginBottom="10px" width="200px" colorScheme="red" color="white" type="submit"
                    onClick={() => window.location.reload(false)}
                  >
                    Limpar
                  </Button>
                </Flex>

              </Flex>
            </Flex>
            <Flex align="left" width="10%">
              <Image
                boxSize='2rem'
                borderRadius='full'
                src='/logoCS.png'
                alt='Logo CS'
                mt="2px"
                width="130px"
                height="100px" />
            </Flex>
          </Flex>

          <Flex m="5px"
            width="99.4%"
            height="68vh"
            direction="column"
            // align="center"
            // justify="center"
            borderRadius="10px"
            border="1px solid">
            <Box width="80%" marginTop="20px" height="100vh" >
              <table width="100%" style={{ maxHeight: "30px", overflowY: "auto" }}>
                <thead height="5%" >
                  <tr >
                    <th style={{ maxWidth: '5vh', textAlign: 'left' }}>Ano Pedido</th>
                    <th style={{ maxWidth: '5vh', textAlign: 'left' }}>Pedido</th>
                    <th style={{ maxWidth: '5vh', textAlign: 'left' }}>Condição de Pagamento</th>
                  </tr>
                </thead>
                <tbody height="5%">
                  {filteredData.map((rowData) => (
                    <tr key={rowData.id}>
                      <td style={{ maxWidth: '5vh', textAlign: 'left' }}>{rowData.anoPed}</td>
                      <td style={{ maxWidth: '5vh', textAlign: 'left' }}>{rowData.pedido}</td>
                      <td style={{ maxWidth: '5vh', textAlign: 'left' }}>{rowData.condPag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            <Flex align="center" justify="center" mt="4">
              <Button
                variant="ghost"
                size="sm"
                colorScheme="blue"
                onClick={() => setCurrentPage(currentPage - 1)}
                isDisabled={currentPage === 0}
              >
                <FaAngleLeft />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                colorScheme="blue"
                onClick={goToFirstPage}
                isDisabled={currentPage === 0}
              >
                <FaStepBackward />
              </Button>
              <Text mx="2" fontSize="sm">
                Página {currentPage + 1} de {pageCount}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                colorScheme="blue"
                onClick={() => setCurrentPage(currentPage + 1)}
                isDisabled={currentPage === pageCount - 1}
              >
                <FaAngleRight />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                colorScheme="blue"
                onClick={goToLastPage}
                isDisabled={currentPage === pageCount - 1}
              >
                <FaStepForward />
              </Button>
            </Flex>



          </Flex>


        </Flex>
      </>

    </Box>
  );
}