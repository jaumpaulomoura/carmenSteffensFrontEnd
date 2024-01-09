import React from 'react';
import { Link } from 'react-router-dom';
import { Text, Button, Flex } from '@chakra-ui/react';

export default function Home() {
  return (<Flex direction="column" bg="#212529" width="100%" minHeight="100vh" color="white">
      <Flex>
        <Text m="5px" as="h1">Rotinas Adicionais</Text>
      </Flex>
      <Flex direction="column">
        <Button as={Link} to="/pesModel" bg="#ACACAC" m="5px" width="270px">
          Pesquisa Modelo
        </Button>
        <Button as={Link} to="/FichaExpedicao" bg="#ACACAC" m="5px" width="270px">
          Ficha Expedição
        </Button>
        <Button as={Link} to="/convertArq" bg="#ACACAC" m="5px" width="270px">
          Converter arquivos do financeiro
        </Button>
        <Button as={Link} to="/ImportaTitulos" bg="#ACACAC" m="5px" width="270px">
          Importa Títulos
        </Button>
        <Button as={Link} to="/CancelaEnvNF" bg="#ACACAC" m="5px" width="270px">
          Cancelar Envio NF
        </Button>
        <Button as={Link} to="/TrocaFabrica" bg="#ACACAC" m="5px" width="270px">
          Trocar Fábrica
        </Button>
        <Button as={Link} to="/InseriNfBolsa" bg="#ACACAC" m="5px" width="270px">
          Inseri Notas de Bolsas
        </Button>
        <Button as={Link} to="/pesModelEnt" bg="#ACACAC" m="5px" width="270px">
          Pesquisa Modelo Entrada
        </Button>
      </Flex>
    </Flex>
  );
}
