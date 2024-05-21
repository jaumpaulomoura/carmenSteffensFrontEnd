import React, { useState, useEffect } from "react";

import axios from "axios";

import { Link } from 'react-router-dom';

import {
  Flex,
  Button,
  Input,
  Image,
  Text,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    // Verificar se o login é um dos usuários permitidos
    const allowedUsers = ['ADMINISTRADOR', 'JP_MOURA', 'PEDRODP', 'RA_BARROS'];
    if (!allowedUsers.includes(login)) {
      toast.error("Usuário não autorizado");
      return;
    }
  
    // Se o login for um dos usuários permitidos, então chamar a API de login
    const api_url = "http://127.0.0.1:5000/api/login";
  
    const credentials = {
      login: login,
      senha: senha,
    };
  
    try {
      const response = await axios.post(api_url, credentials);
      console.log("Resposta do servidor:", response);
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
  

  return (
    <Flex>
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
        ) : (
        <Flex direction="column" bg="#212529" width="100%" minHeight="100vh" color="white">
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
            <Button as={Link} to="/InseriValorBolsa" bg="#ACACAC" m="5px" width="270px">
              Inseri Valor das Bolsas
            </Button>
            <Button as={Link} to="/consultBancas" bg="#ACACAC" m="5px" width="270px">
              Consulta Bancas
            </Button>
            <Button as={Link} to="/atualizaNcm" bg="#ACACAC" m="5px" width="270px">
              Atualiza Ncm
            </Button>
            <Button as={Link} to="/pedModel" bg="#ACACAC" m="5px" width="270px">
              Pesquisa Modelo Entrada
            </Button>
            <Button as={Link} to="/grupoPecista" bg="#ACACAC" m="5px" width="270px">
              Grupo dos Pecista
            </Button>
            <Button as={Link} to="/recalculoPecista" bg="#ACACAC" m="5px" width="270px">
              Recalculo dos Pecista
            </Button>
            <Button as={Link} to="/importVenc" bg="#ACACAC" m="5px" width="270px">
              Importador de Vencimento
            </Button>
            <Button as={Link} to="/atuBolsa" bg="#ACACAC" m="5px" width="270px">
              Automação Bolsa
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
