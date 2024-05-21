import { Box, Button, Input, Flex, Image, Text, Stack, Badge, Select, Checkbox, TableContainer, Table, Th, Tr, Td, Tbody, Thead, Center } from "@chakra-ui/react";
import { TbReplace, TbReportAnalytics, TbSearch, TbCalculator } from 'react-icons/tb';
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ImportaTitulos() {
  const [emp, setemp] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [vIni, setvIni] = useState("");
  const [vFin, setvFin] = useState("");
  const [eIni, seteIni] = useState("");
  const [eFin, seteFin] = useState("");
  const [bordero, setbordero] = useState("");
  const [prefixos, setprefixos] = useState("");
  const [tipTit, settipTit] = useState("");
  const [showCadastro, setShowCadastro] = useState(false);
  const [resultado, setResultado] = useState([]);
  const [empCli, setEmpCli] = useState("")
  const [codCli, setCodCli] = useState("")
  const [FI15NOME, setFI15NOME] = useState("")
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [soma, setSoma] = useState(0);

  const handleCadastroClick = () => {
    setShowCadastro(true);
  };

  const handleFecharCadastro = () => {
    setShowCadastro(false);
  };

  const handleEmpChange = async (e) => {
    const newValue = e.target.value;
    setemp(newValue);

    const fetchEmpresa = async (empValue) => {
      const api_url = "http://localhost:5000/api/importaTitulo/empresa";
      const paramsEmp = {
        emp: empValue,
      };

      try {
        const response = await axios.get(api_url, { params: paramsEmp });

        if (response.status === 200) {
          console.log("Resultados:", response.data);
          if (response.data.length > 0) {
            const novaEmpresa = response.data[0].EMPRESA;
            setEmpresa(novaEmpresa);
            console.log("Nova empresa:", novaEmpresa);
          }
        } else {
          console.error("Erro na solicitação:", response.statusText);
        }
      } catch (error) {
        console.error("Erro na solicitação:", error.message);
      }
    };

    fetchEmpresa(newValue);
  };



  const handleCliChange = async (e) => {
    const newValue = e.target.value;
    setCodCli(newValue);

    const fetchCli = async (codCliValue) => {
      const api_url = "http://localhost:5000/api/importaTitulo/consultarCli";
      const paramsCli = {
        empCli: codCliValue, // Usando codCliValue para consultar o cliente
        codCli: codCliValue, // Usando codCliValue para consultar o cliente
      };

      try {
        const response = await axios.get(api_url, { params: paramsCli });

        if (response.status === 200) {
          console.log("Resultados:", response.data);
          if (response.data.length > 0) {
            const novoCliente = response.data[0].CLIENTE; // Certifique-se de usar 'CLIENTE' em maiúsculas
            setEmpCli(novoCliente); // Atualiza o valor do cliente
            setFI15NOME(response.data[0].FI15NOME); // Atualiza o nome do cliente
            console.log("Novo Cliente:", novoCliente);
          }
        } else {
          console.error("Erro na solicitação:", response.statusText);
        }
      } catch (error) {
        console.error("Erro na solicitação:", error.message);
      }
    };

    fetchCli(newValue);
  };

  const handleSubmitImpTit = async (e) => {
    e.preventDefault();
    const api_url = "http://localhost:5000/api/importaTitulo";

    const params = {
      emp: emp,
      vIni: vIni,
      vFin: vFin,
      eIni: eIni,
      eFin: eFin,
      bordero: bordero,
      prefixos: prefixos,
      tipTit: tipTit,
    };

    try {
      const response = await axios.get(api_url, { params });

      if (response.status === 200) {
        console.log("Resultados:", response.data);

        const dataWithIds = response.data.map((item, index) => {
          return { ...item, id: index + 1 };
        });

        setResultado(dataWithIds);
      } else {
        console.error("Erro na solicitação:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na solicitação:", error.message);
    }
  };

  const renderTable = () => {
    return (
      <Box borderRadius="10px" width="100%" height="100%"  >
        <TableContainer height="400px" overflowY="scroll" >
          <Table variant='simple' height="100%">

            <Thead height="100%">
              <Tr height="100%">
                <Th>Sel</Th>
                <Th>Doc</Th>
                <Th>Desdob</Th>
                <Th>Nome_loja</Th>
                <Th>Vencimento</Th>
                <Th>Valor</Th>
                <Th>Data Digitacao</Th>
                <Th>Cod. Empresa</Th>
                <Th>Tipo de Titulo</Th>
                <Th>Num. Titulo/Documento</Th>
                <Th>Desdobramento</Th>
                <Th>Cod. Prefixo</Th>
                <Th>Emp. Cliente</Th>
                <Th>Tipo de cadastro</Th>
                <Th>Cod. Cliente</Th>
                <Th>Emp. Matriz</Th>
                <Th>Tipo Cad. Cli/For</Th>
                <Th>Cod. Matriz</Th>
                <Th>Data Emissão</Th>
                <Th>Data Vencimento</Th>
                <Th>Data Digitacao</Th>
                <Th>Ult. Desdob</Th>
                <Th>Vista / Apresentacao</Th>
                <Th>Qtd. Comprovantes</Th>
                <Th>Cod. Moeda</Th>
                <Th>Emp. Cad. Bordero</Th>
                <Th>Nº Bordero</Th>
                <Th>Conta</Th>
                <Th>Cod. Banco</Th>
                <Th>Cod. Operação</Th>
                <Th>Num. Titulo</Th>
                <Th>Valor Titulo</Th>
                <Th>Valor Abatimento</Th>
                <Th>% Desconto Ant.</Th>
                <Th>Diario % Desc</Th>
                <Th>Qtd. Dias Limite Pag</Th>
                <Th>Valor Correc. Pg. Tit.</Th>
                <Th>Historio do Titulo</Th>
                <Th>Prox. Seq. Lanc</Th>
                <Th>Ult. Sequencia</Th>
                <Th>Situação Cob.</Th>
                <Th>Nº Nota Fiscal</Th>
                <Th>Bloqueado</Th>
                <Th>Emp. Representante</Th>
                <Th>Cod. Representante</Th>
                <Th>Dt. Venc. Original</Th>
                <Th>Tipo Bordero</Th>
                <Th>Cod. Barras</Th>
                <Th>Emp. da NF</Th>
                <Th>Modelo da NF</Th>
                <Th>Resp. Rep</Th>
                <Th>Valor. Outras Moedas</Th>
                <Th>Ident. Integração</Th>
              </Tr>
            </Thead>
            <Tbody height="100%">

              {resultado.map((item, index) => (
                <Tr key={index} height="100%">
                  <Td>
                    <Checkbox
                      isChecked={itensSelecionados.some((selectedItem) => selectedItem.id === item.id)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </Td>
                  <Td>{item.NUMERO_TITULO}</Td>
                  <Td>{item.DESDOBRO}</Td>
                  <Td>{item.NOME_LOJA}</Td>
                  <Td>{item.DATA_VENCIMENTO}</Td>
                  <Td>{item.VALOR_TITULO}</Td>
                  <Td>{item.DATA_DIGITACAO}</Td>
                  <Td>{item.CODIGO_EMPRESA}</Td>
                  <Td>{item.TIPO_TITULO}</Td>
                  <Td>{item.NUMERO_TITULO}</Td>
                  <Td>{item.DESDOBRO}</Td>
                  <Td>{item.PREFIXO}</Td>
                  <Td>{item.EMPRESA_CLIENTE}</Td>
                  <Td>{item.TIPO_CADASTRO}</Td>
                  <Td>{item.CODIGO_CLIENTE}</Td>
                  <Td>{item.EMPRESA_MATRIZ}</Td>
                  <Td>{item.TIPO_CADASTRO_CLI}</Td>
                  <Td>{item.CODIGO_MATRIZ}</Td>
                  <Td>{item.DATA_EMISSAO}</Td>
                  <Td>{item.DATA_VENCIMENTO}</Td>
                  <Td>{item.DATA_DIGITACAO}</Td>
                  <Td>{item.ULTIMO_DESDOBRO}</Td>
                  <Td>{item.VISTA_APRESENTACAO}</Td>
                  <Td>{item.QTD_COMPROVANTES_REC}</Td>
                  <Td>{item.CODIGO_MOEDA}</Td>
                  <Td>{item.EMPRESA_BORDERO}</Td>
                  <Td>{item.NUMERO_BORDERO}</Td>
                  <Td>{item.CONTA}</Td>
                  <Td>{item.CONTA_BANCO}</Td>
                  <Td>{item.CODIGO_OPERACAO}</Td>
                  <Td>{item.NUM_TIT_BANCO}</Td>
                  <Td>{item.VALOR_TITULO}</Td>
                  <Td>{item.VALOR_ABATIMENTO}</Td>
                  <Td>{item.DESCONTO_PAGAMENTO}</Td>
                  <Td>{item.DIARIO_MENSAL}</Td>
                  <Td>{item.QTD_DIAS_LIMITE}</Td>
                  <Td>{item.VALOR_CORRECAO}</Td>
                  <Td>{item.HISTORICO}</Td>
                  <Td>{item.PROXIMA_SEQUENCIA}</Td>
                  <Td>{item.ULTIMA_SEQUENCIA}</Td>
                  <Td>{item.SITUACAO_COBRANCA}</Td>
                  <Td>{item.NOTA_FISCAL}</Td>
                  <Td>{item.BLOQUEADO}</Td>
                  <Td>{item.EMPRESA_REPRESENTANTE}</Td>
                  <Td>{item.REPRESENTANTE}</Td>
                  <Td>{item.DATA_VENCIMENTO_ORIGINAL}</Td>
                  <Td>{item.TIPO_BORDERO}</Td>
                  <Td>{item.CODIGO_BARRAS}</Td>
                  <Td>{item.EMPRESA_NF}</Td>
                  <Td>{item.MODELO_NOTA}</Td>
                  <Td>{item.RESPONSABILIDADE_REP}</Td>
                  <Td>{item.VR_OUTRAS_MOEDAS}</Td>
                  <Td>{item.IDENTIFICADOR_INTEGRACAO}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  };






  const handleGerarTXT = () => {
    // Verifica se há dados a serem exportados
    if (resultado.length === 0) {
      alert("Nenhum dado disponível para exportação.");
      return;
    }

    // Formata os dados para o formato TXT
    const textoFormatado = resultado.map((item) => {
      // Formate cada linha conforme necessário
      return `${item.NUMERO_TITULO}\t${item.DESDOBRO}\t${item.NOME_LOJA}\t${item.VALOR_TITULO}\n`;
    }).join('');

    // Cria um Blob com o texto formatado
    const blob = new Blob([textoFormatado], { type: 'text/plain' });

    // Cria um URL temporário para o Blob
    const url = URL.createObjectURL(blob);

    // Cria um link para fazer o download do arquivo TXT
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dados.txt';

    // Simula o clique no link para iniciar o download
    document.body.appendChild(link);
    link.click();

    // Remove o link e revoga o URL temporário
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCheckboxChange = (item) => {
    const selectedIndex = itensSelecionados.findIndex((selectedItem) => selectedItem.id === item.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(itensSelecionados, item);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(itensSelecionados.slice(1));
    } else if (selectedIndex === itensSelecionados.length - 1) {
      newSelected = newSelected.concat(itensSelecionados.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        itensSelecionados.slice(0, selectedIndex),
        itensSelecionados.slice(selectedIndex + 1)
      );
    }

    console.log("itensSelecionados antes:", itensSelecionados);
    console.log("Novos itensSelecionados:", newSelected);

    setItensSelecionados(newSelected);
  };


  const handleMarcarTodos = () => {
    // Filtra apenas os itens que ainda não estão selecionados
    const novosSelecionados = resultado.filter((item) => !itensSelecionados.some((selectedItem) => selectedItem.id === item.id));
    // Concatena os novos itens selecionados com os itens já selecionados
    const novosItensSelecionados = [...itensSelecionados, ...novosSelecionados];
    console.log("Novos itens selecionados (Marcar todos):", novosItensSelecionados);
    setItensSelecionados(novosItensSelecionados);
  };

  const handleDesmarcarTodos = () => {
    setItensSelecionados([]);
    console.log("Itens selecionados antes (Desmarcar todos):", itensSelecionados);
  };
  useEffect(() => {
    const novaSoma = itensSelecionados.reduce((acc, item) => {
      
      if (!isNaN(item.VALOR_TITULO)) {
        return acc + parseFloat(item.VALOR_TITULO); 
      }
      return acc;
    }, 0);
    setSoma(novaSoma);
  }, [itensSelecionados]); 

  const formatarDinheiro = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  return (
    <Box bg="#fff" >

      <Flex as="form" ml="2px" m="5px" background="#283156" borderRadius="10px" height="30%" width="99,7%" border="1px solid" >
        <Flex direction="column" width="30%">
          <Text as="h3" m="6px" color="white">Dados de origem</Text>
          <Flex>

            <Input
              height="28px"
              m="7px"
              placeholder="Emp"
              width="70px"
              background="#fff"
              type="text"
              value={emp}
              onChange={handleEmpChange}
              onKeyPress={(empValue) => {
                if (empValue.key === "Enter") {
                  empValue.preventDefault();
                  handleEmpChange(empValue);
                }
              }}
            />
            <Input
              height="28px"
              m="7px"
              value={empresa} // Usando o estado 'empresa' diretamente aqui
              width="330px"
              background="white"
              color="black"
              type="text"
              disabled
            />

          </Flex>
          <Flex>
            <Select placeholder='Tipo Título' m="7px" width="200px" height="28px" colorScheme='blue' bg="#fff" color="gray.500"
              value={tipTit}
              onChange={(e) => settipTit(e.target.value)}>
              <option colorFont="black" value='P' >Pagar</option>
              <option value='R'>Receber</option>
            </Select>

            <Input height="28px" m="7px" placeholder='Borderô' width="200px" background="#fff"
              type="text"
              value={bordero}
              onChange={(e) => setbordero(e.target.value)}

            />
          </Flex>
          <Flex>
            <Input height="28px" m="7px" width="200px" background="#fff"
              type="text"
              value={vIni}
              onChange={(e) => setvIni(e.target.value)}
              placeholder="Vencimento Inicial"
            />
            <Input height="28px" m="7px" width="200px" background="#fff"
              type="text"
              value={vFin}
              onChange={(e) => setvFin(e.target.value)}
              placeholder="Vencimento Final"
            />
          </Flex>
          <Flex>
            <Input height="28px" m="7px" width="200px" background="#fff"
              type="text"
              value={eIni}
              onChange={(e) => seteIni(e.target.value)}
              placeholder="Emissão Inicial"
            />
            <Input height="28px" m="7px" width="200px" background="#fff"
              type="text"
              value={eFin}
              onChange={(e) => seteFin(e.target.value)}
              placeholder="Emissão Final"
            />
          </Flex>
          {/* <Button m="7px"    width="200px" colorScheme='blue' bg="#465687" color="white"   type="submit" 
            // onClick={handleSubmit}
            > 
              Buscar Modelo
            </Button>
            <Button m="7px"    width="200px" colorScheme='blue' bg="#465687" color="white"   type="submit"
            // onClick={handleExportExcel}
          >
            Exportar para Excel
          </Button> */}
        </Flex>
        <Flex direction="column" width="30%">
          <Flex direction="column" justify="center" height="50%" m="20px" mt="40px" border="1px solid" borderRadius="10px" borderColor="#fff">
            <Text as="h4" ml="20px" color="#fff">Trocar data digitação</Text>
            <Flex ml="30px" direction="row" alignItems="center">
              <Input height="28px" m="7px" placeholder='Data' width="200px" background="#fff"
                type="text"
              //   value={custo}
              //   onChange={(e) => setCusto(e.target.value)}
              />


              <Button m="7px" width="200px" colorScheme='blue' bg="#465687" color="white" type="submit"
              // onClick={handleExportExcel}
              >
                <TbReplace /> Trocar
              </Button>
            </Flex>
            <Flex justify="center">
              <Stack m="7px" spacing={5} direction='row'>
                <Checkbox colorScheme='gray.700' color="#fff" defaultChecked>
                  Cliente
                </Checkbox>
                <Checkbox colorScheme='gray.700' color="#fff" defaultChecked>
                  Bordero
                </Checkbox>
              </Stack>
            </Flex>

          </Flex>
          <Flex>
            <Input
              height="28px"
              m="7px"
              placeholder="Cod CLiente"
              width="25%"
              background="#fff"
              type="text"
              value={codCli}
              onChange={handleCliChange}
              onKeyPress={(codCliValue) => {
                if (codCliValue.key === "Enter") {
                  codCliValue.preventDefault();
                  handleCliChange(codCliValue);
                }
              }}
            />

            <Input
              height="28px"
              m="7px"
              value={FI15NOME}
              width="330px"
              background="white"
              color="black"
              type="text"
              disabled
            />

            <Button m="7px" width="30%" colorScheme='blue' bg="#465687" color="white" type="submit"
            // onClick={handleExportExcel}
            >Marcar Cliente</Button>
          </Flex>
        </Flex>


        <Flex direction="row" width="30%">
          <Flex direction="column" width="33,33%">
            <Input height="28px" m="10px" mt="40px" placeholder='Banco' width="90%" background="#fff"
              type="text"
            //   value={custo}
            //   onChange={(e) => setCusto(e.target.value)}
            />
            <Input height="28px" m="10px" placeholder='Operação' width="90%" background="#fff" color="gray.500"
              type="text"
            //   value={custo}
            //   onChange={(e) => setCusto(e.target.value)}
            />
            <Input height="28px" m="10px" placeholder='Prefixo' width="90%" background="#fff" color="gray.500"
              type="text"
              value={prefixos}
              onChange={(e) => setprefixos(e.target.value)}
            />
          </Flex>
          <Flex direction="column" width="33,33%">
            <Button m="7px" mt="40px" width="90%" colorScheme='blue' bg="#465687" color="white" type="submit"
            // onClick={handleExportExcel}
            >Marcar Banco/Op</Button>
            <Button m="7px" width="90%" colorScheme='blue' bg="#465687" color="white" type="submit"
            // onClick={handleExportExcel}
            >Marcar Prefixo</Button>
            <Button m="7px" width="90%" colorScheme='blue' bg="#465687" color="white" type="submit"
            // onClick={handleExportExcel}
            >Desmarcar Prefixo</Button>
          </Flex>
          <Flex direction="column" width="34%">
            <Button m="7px" mt="40px" width="90%" colorScheme='blue' bg="#465687" color="white" type="submit"
            // onClick={handleExportExcel}
            ><TbReportAnalytics />Relatório</Button>
            <Button m="7px" width="90%" colorScheme='blue' bg="#465687" color="white" type="submit"
              onClick={handleSubmitImpTit}
            ><TbSearch />Consultar</Button>
          </Flex>
        </Flex>



        <Flex direction="row-reverse" width="10%">
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
      <Flex>
        <Flex m="7px" borderRadius="10px" width="80%" height="400px" border="1px solid" >

          {resultado.length > 0 && renderTable()}
        </Flex>

        <Flex direction="column" align="center" width="20%">
          <Button m="7px" mt="20px" width="70%" colorScheme='blue' bg="#6DC53D" color="white" type="submit"
            onClick={handleMarcarTodos}
          >Marcar</Button>
          <Button m="7px" width="70%" colorScheme='blue' bg="#FF4133" color="white" type="submit"
            onClick={handleDesmarcarTodos}
          >Desmarcar</Button>
          <Text mt="100px" > Total Marcados </Text>
          <input
      height="28px"
      m="7px"
      value={formatarDinheiro(soma)}
      width="50%"
      background="#fff"
      borderColor="gray.700"
      type="text"
      disabled
    />
          <Button m="7px" width="70%" colorScheme='blue' bg="#465687" color="white" type="submit"
          // onClick={handleExportExcel}
          ><TbCalculator />Calcular</Button>

        </Flex>
      </Flex>
      <Flex as="form" ml="2px" m="5px" background="#283156" borderRadius="10px" height="30%" width="99,7%" border="1px solid" >
        <Flex direction="column" width="99%">
          <Text as="h3" m="6px" color="white">Dados de destino</Text>
          <Flex>
            <Input height="28px" m="7px" placeholder='Prefixo' width="200px" background="#fff"
              type="text"
            //   value={custo}
            //   onChange={(e) => setCusto(e.target.value)}
            />
          </Flex>
          <Flex>
            <Input height="28px" m="7px" placeholder='Conta' width="200px" background="#fff"
              type="text"
            //   value={custo}
            //   onChange={(e) => setCusto(e.target.value)}
            />
            <Input height="28px" m="7px" placeholder='Banco' width="100px" background="#fff" color="gray.500"
              type="text"
            //   value={custo}
            //   onChange={(e) => setCusto(e.target.value)}
            />
            <Input height="28px" m="7px" value='' width="300px" background="#fff" color="gray.500"
              type="text" disabled=""
            //   value={custo}
            //   onChange={(e) => setCusto(e.target.value)}
            />
          </Flex>
          <Flex>
            <Input height="28px" m="7px" placeholder='Operação Bancaria' width="100px" background="#fff" color="gray.500"
              type="text"
            //   value={custo}
            //   onChange={(e) => setCusto(e.target.value)}
            />
            <Input height="28px" m="7px" value='' width="300px" background="#fff" color="gray.500"
              type="text" disabled=""
            //   value={custo}
            //   onChange={(e) => setCusto(e.target.value)}
            />
          </Flex>
          <Flex direction="row" align="center">
            <Text ml="7px" color="#fff" >Historico</Text>
            <Input height="28px" m="7px" placeholder='' value='TIT. A RECEBER BORDERO  BANCO ' width="400px" background="#fff" border="1px solid"
              type="text"
            //   value={custo}
            //   onChange={(e) => setCusto(e.target.value)}
            />

          </Flex>
        </Flex>
      </Flex>
      <Flex >
        <Flex width="50%" align="left">
          <Center>
            <Button m="7px" width="200px" colorScheme='blue' bg="#465687" color="white" type="submit" onClick={handleCadastroClick}
            // onClick={handleExportExcel}
            >De Cli para Forn</Button>
            {showCadastro && (
              <Box
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="white"
                padding="20px"
                borderRadius="10px"
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
              >
                {/* Conteúdo do cadastro aqui */}
                <Text m='5px'>Cadastro de Para</Text>
                <Flex>
                  <Flex direction='column' border="1px solid" borderRadius='10px'>
                    <Text m='2'>Cliente Atual</Text>
                    <Flex>

                      <Input
                        height="28px"
                        m="7px"
                        placeholder="Cod Cliente"
                        width="110px"
                        background="#fff"
                        type="text"
                        value={empCli}
                        onChange={handleCliChange}
                      />
                      <Input
                        height="28px"
                        m="7px"
                        placeholder="Cod Cliente"
                        width="110px"
                        background="#fff"
                        type="text"
                        value={codCli}
                        onChange={handleCliChange}
                      />
                    </Flex>
                    <Input
                      height="28px"
                      m="7px"
                      value={FI15NOME} // Usando o estado 'empresa' diretamente aqui
                      width="220px"
                      background="white"
                      color="black"
                      type="text"
                      disabled
                      placeholder="Nome"
                    />
                  </Flex>
                  <Flex ml='5px' direction='column' border="1px solid" borderRadius='10px'>
                    <Text m='2'>Cliente Destino</Text>
                    <Flex>
                      <Input width="110px" m='2' placeholder="Codigo" />
                      <Input width="110px" m='2' placeholder="Empresa" />
                    </Flex>
                    <Input
                      height="28px"
                      m="7px"
                      // value={empresa} // Usando o estado 'empresa' diretamente aqui
                      width="220px"
                      background="white"
                      color="black"
                      type="text"
                      disabled
                      placeholder="Nome"
                    />
                  </Flex>

                </Flex>
                <Flex mt='5px' border="1px solid" borderRadius='5px'>
                  Table
                </Flex>
                <Flex justifyContent='space-between'>
                  <Button
                    mt="10px"
                    colorScheme="blue"
                    bg="#6DC53D"
                    color="white"
                  // onClick={handleFecharCadastro}
                  >
                    Inserir
                  </Button>
                  <Button
                    mt="10px"
                    colorScheme="blue"
                    bg="#FF4133"
                    color="white"
                  // onClick={handleFecharCadastro}
                  >
                    Remover
                  </Button>
                  <Button
                    mt="10px"
                    colorScheme="blue"
                    bg="#465687"
                    color="white"
                  // onClick={handleFecharCadastro}
                  >
                    Limpar
                  </Button>
                  <Button
                    mt="10px"
                    colorScheme="blue"
                    bg="#FF4133"
                    color="white"
                    onClick={handleFecharCadastro}
                  >
                    Fechar Cadastro
                  </Button>
                </Flex>
              </Box>
            )}

          </Center>
          <Button m="7px" width="200px" colorScheme='blue' bg="#465687" color="white" type="submit"
          // onClick={handleExportExcel}
          >Prefixos</Button>
        </Flex>
        <Flex width="50%" justifyContent="flex-end">
          <Button
            m="7px"
            width="200px"
            colorScheme='blue'
            bg="#465687"
            color="white"
            onClick={handleGerarTXT} // Adiciona o evento onClick para chamar a função handleGerarTXT
          >
            Gerar TXT
          </Button>

          <Button m="7px" width="200px" colorScheme='blue' bg="#FF4133" color="white" type="submit"
          // onClick={handleExportExcel}
          >Limpar</Button>
        </Flex>
      </Flex>
    </Box>

  )
}

