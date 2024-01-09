import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; 
import PesModel from './pages/PesModel'; 
import FichaExpedicao from './pages/FichaExpedicao';
import ConvertArq from './pages/ConvertArq';

import CancelaEnvNF from './pages/CancelaEnvNF';

import InseriNfBolsa from './pages/InseriNfBolsa';
import PesModelEnt from './pages/PesModelEnt'; 
function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pesModel" element={<PesModel />} />
          <Route path="/FichaExpedicao" element={<FichaExpedicao />} />
          <Route path="/ConvertArq" element={<ConvertArq />} />
          {/* <Route path="/ConvertArq" element={<FileConversionPage />} /> */}

          <Route path="/CancelaEnvNF" element={<CancelaEnvNF />} />

          <Route path="/InseriNfBolsa" element={<InseriNfBolsa />} />
	  <Route path="/pesModelEnt" element={<PesModelEnt />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
