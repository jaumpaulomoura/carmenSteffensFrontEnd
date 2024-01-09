import React from "react";
import { Box,Button,Input,Flex, Menu, MenuButton, MenuList, MenuItem,Image,} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
// import '../../public/logoCS.png'


export default function ConvertArq() {
//   const [custo, setCusto] = useState("");
 

    


  return (
    <Box bg="#fff" >
      
      <Flex  as="form" ml="2px"m="5px"background="#283156"  borderRadius="10px" width="99%.7" border="1px solid" >
        <Flex direction="row" width="80%">
        <Input m="10px"  marginBottom="10px" mt="30px" width="200px"  background="#fff"
          type="text"
        //   value={custo}
        //   onChange={(e) => setCusto(e.target.value)}
        placeholder="Banco"
        />
       
        <Input m="12px"  marginBottom="10px" mt="30px" width="200px" background="#fff"
          type="text"
        //   value={dataFinal}
        //   onChange={(e) => setDataFinal(e.target.value)}
          placeholder="Conta"
        />
         <Menu >
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} m="12px"   marginBottom="10px" mt="30px" width="200px">
            Layout
        </MenuButton>
        <MenuList bg="blue.50" color="black">
            <MenuItem bg="blue.50" color="black">Banco do Brasil</MenuItem>
            <MenuItem bg="blue.50" color="black">Brasil Invest</MenuItem>
            <MenuItem bg="blue.50" color="black">Bradesco</MenuItem>
            <MenuItem bg="blue.50" color="black">Bradesco Simples</MenuItem>
            <MenuItem bg="blue.50" color="black">Itau</MenuItem>
            <MenuItem bg="blue.50" color="black">Itau R9</MenuItem>
            <MenuItem bg="blue.50" color="black">Safra</MenuItem>
            <MenuItem bg="blue.50" color="black">Santander</MenuItem>
            <MenuItem bg="blue.50" color="black">Sofisa</MenuItem>
        </MenuList>
        </Menu>
        <Button m="10px"  marginBottom="10px" mt="30px" width="200px" colorScheme='blue'  bg="#465687" color="white"   type="submit" 
        // onClick={handleSubmit}
        >
          Importar
        </Button>
        <Button m="10px"  marginBottom="10px" mt="30px" width="200px" colorScheme='blue' padding="15px" bg="#465687" color="white"   type="submit"  >
        Gerar Arquivo
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
        
   
    </Box>
  );
}
