import React, { useState } from "react";
import { Box, Button, Input, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight, FaStepForward, FaStepBackward, FaSearch } from "react-icons/fa"; // Importe os ícones
import { IoAddCircleOutline } from "react-icons/io5";
import { format } from 'date-fns';
export default function InseriValorBolsa() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [file, setFile] = useState(null);
  const [dataFromExcel, setDataFromExcel] = useState([]);
  const [dataWithIds, setDataWithIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 17;
  const pageCount = Math.ceil(dataWithIds.length / itemsPerPage);
  const [selectedPage, setSelectedPage] = useState(0);
  const [insercaoConcluida, setInsercaoConcluida] = useState(false);

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
          const MODELO = rowData[0];
          const MATPRIMA = rowData[1];
          const MAOOBRA22 = rowData[2];
          const RETENCAO = rowData[3];
          const PRECO = rowData[4];
          const DATAVIGENCIA = rowData[5];

          // Converter a data serial em uma data JavaScript
          const dataBase = new Date("1899-12-31"); // Defina a data base como "31/12/1899"
          const DTVIGENCIA = new Date(dataBase.getTime() + (DATAVIGENCIA * 24 * 60 * 60 * 1000)); // Converter para milissegundos

          // Formatar a data no formato desejado (DD/MM/AAAA)
          const dia = DTVIGENCIA.getDate().toString().padStart(2, '0');
          const mes = (DTVIGENCIA.getMonth() + 1).toString().padStart(2, '0');
          const ano = DTVIGENCIA.getFullYear();

          const dataFormatada = `${dia}/${mes}/${ano}`;

          return {
            MODELO: MODELO || "",
            MATPRIMA: MATPRIMA || "",
            MAOOBRA22: MAOOBRA22 || "",
            RETENCAO: RETENCAO || "",
            PRECO: PRECO || "",
            DTVIGENCIA: dataFormatada,
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
    const api_url = "http://127.0.0.1:5000/api/insereValorBolsa"; // Substitua pela URL correta da sua API
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
  const [isImageVisible, setIsImageVisible] = useState(false);

  return (
    <Box bg="#fff">
      {/* <ToastContainer
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
      ) : */}










































      <>
        <Flex
          direction="column"
          height="100vh"

        >
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
                  Inserir Valor das Bolsas
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
                  <Button
                    m="10px"
                    mt="20px"
                    marginBottom="10px"
                    width="200px"
                    colorScheme="blue"
                    bg="#465687"
                    color="white"
                    type="button"
                    onClick={() => setIsImageVisible(true)}  // Adicione esta linha
                  >
                    Visualizar Imagem
                  </Button>

                </Flex>
                {isImageVisible && (
  <>
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      bg="rgba(0, 0, 0, 0.5)"  // Defina a cor e a opacidade desejadas aqui
      zIndex="9998"
    />
    <Flex
      align="center"
      justify="center"
      mt="4"
      position="fixed"
      top="22%"
      left="44%"
      transform="translate(-14%, -33%)"
      zIndex="9999"
    >
      <Image
        src="/exemploInsereValorNfBolsa.png"
        alt="Imagem"
        position="relative"
        border="2px solid #000"
      />
   <Button
  

  onClick={() => setIsImageVisible(false)}
  mt="2"
  mr="2"
  position="absolute"
  top="0"
  right="0"
  size="sm"
  zIndex="10000"
  colorScheme="red" color="white"
 

>
  <MdOutlineClose />
</Button>


    </Flex>
  </>
)}


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
                    <th style={{ maxWidth: '5vh', textAlign: 'left' }}>MODELO</th>
                    <th style={{ maxWidth: '5vh', textAlign: 'left' }}>MATERIA PRIMA</th>
                    <th style={{ maxWidth: '5vh', textAlign: 'left' }}>MAO DE OBRA 22%</th>
                    <th style={{ maxWidth: '5vh', textAlign: 'left' }}>RETENCAO</th>
                    <th style={{ maxWidth: '5vh', textAlign: 'left' }}>PRECO</th>
                    <th style={{ maxWidth: '5vh', textAlign: 'left' }}>DATA VIGENCIA</th>
                  </tr>
                </thead>
                <tbody height="5%">
                  {filteredData.map((rowData) => (
                    <tr key={rowData.id}>
                      <td style={{ maxWidth: '5vh', textAlign: 'left' }}>{rowData.MODELO}</td>
                      <td style={{ maxWidth: '5vh', textAlign: 'left' }}>{rowData.MATPRIMA}</td>
                      <td style={{ maxWidth: '5vh', textAlign: 'left' }}>{rowData.MAOOBRA22}</td>
                      <td style={{ maxWidth: '5vh', textAlign: 'left' }}>{rowData.RETENCAO}</td>
                      <td style={{ maxWidth: '5vh', textAlign: 'left' }}>{rowData.PRECO}</td>
                      <td style={{ maxWidth: '5vh', textAlign: 'left' }}>{rowData.DTVIGENCIA}</td>
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