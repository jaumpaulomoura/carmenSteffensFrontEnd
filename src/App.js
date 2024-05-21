import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; 
import PesModel from './pages/PesModel'; 
import FichaExpedicao from './pages/FichaExpedicao';
import ConvertArq from './pages/ConvertArq';
import ImportaTitulos from './pages/ImportaTitulos';
import CancelaEnvNF from './pages/CancelaEnvNF';
import TrocaFabrica from './pages/TrocaFabrica';
import InseriNfBolsa from './pages/InseriNfBolsa';
import InseriValorBolsa from './pages/InseriValorBolsa';
import ConsultaBancas from './pages/consultBancas';
import AtualizaNcm from './pages/AtualizaNcm';
import PesModelEnt from './pages/PesModel'; 
import GrupoPecista from './pages/GrupoPecista'; 
import RecalculoPecista from './pages/RecalculoPecista'; 
import AtuBolsa from './pages/AtuBolsa'; 
const theme = extendTheme({});
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pesModel" element={<PesModel />} />
          <Route path="/FichaExpedicao" element={<FichaExpedicao />} />
          <Route path="/ConvertArq" element={<ConvertArq />} />
          {/* <Route path="/ConvertArq" element={<FileConversionPage />} /> */}
          <Route path="/ImportaTitulos" element={<ImportaTitulos />} />
          <Route path="/CancelaEnvNF" element={<CancelaEnvNF />} />
          <Route path="/TrocaFabrica" element={<TrocaFabrica />} />
          <Route path="/InseriNfBolsa" element={<InseriNfBolsa />} />
          <Route path="/InseriValorBolsa" element={<InseriValorBolsa />} />
          <Route path="/ConsultBancas" element={<ConsultaBancas />} />
          <Route path="/AtualizaNcm" element={<AtualizaNcm />} />
          <Route path="/pesModel" element={<PesModelEnt />} />
          <Route path="/grupoPecista" element={<GrupoPecista />} />
          <Route path="/grupoPecista" element={<GrupoPecista />} />
          <Route path="/recalculoPecista" element={<RecalculoPecista />} />
          <Route path="/atuBolsa" element={<AtuBolsa />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
