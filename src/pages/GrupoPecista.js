import React, { useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Table, Thead, Tr, Th, Td, Tbody } from "@chakra-ui/react";
import { format } from 'date-fns';

const animatedComponents = makeAnimated();

const GrupoPecista = () => {
  const [selectedOptionsEmp, setSelectedOptionsEmp] = useState(null);
  const [selectedOptionsGru, setSelectedOptionsGru] = useState(null);
  const [selectedOptionsCol, setSelectedOptionsCol] = useState([]);
  const [dataFromAPICol, setDataFromAPICol] = useState([]);
  const [dataFromAPIGru, setDataFromAPIGru] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tableFilledForCurrentGroup, setTableFilledForCurrentGroup] = useState(false);

  const optionsEmp = [
    { value: "31", label: "31 - MIGUELETTI IND COM BOLSAS E VESTUARIO EIRELI " },
    { value: "32", label: "32 - MARCELA BELUCCI INDUSTRIA E COM DE CALCADOS EIRELI" },
    { value: "54", label: "54 - SPECIAL IND E COM CALCADOS EIRELI" },
  ];

  const optionsGru = dataFromAPIGru.map((grupo) => ({
    value: grupo.CODCORTADOR,
    label: `${grupo.CODCORTADOR} - ${grupo.CORTADOR.trim()}`
  }));

  const optionsCol = dataFromAPICol.map((colaborador) => ({
    value: colaborador.MATRICULA,
    label: colaborador.COLABORADOR.trim(),
    funcao: colaborador.FUNCAO,
  }));

  useEffect(() => {
    const fetchDataCol = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/grupoPecista/colaborador");
        const dataCol = await response.json();
        setDataFromAPICol(dataCol);
      } catch (error) {
        console.error("Erro ao buscar dados da API (colaborador):", error);
      }
    };

    fetchDataCol();
  }, []);

  useEffect(() => {
    const fetchDataGru = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/grupoPecista/grupo");
        const dataGru = await response.json();
        setDataFromAPIGru(dataGru);
      } catch (error) {
        console.error("Erro ao buscar dados da API (grupo):", error);
      }
    };

    fetchDataGru();
  }, []);

  const handleSelectEmp = (selected) => {
    // console.log("Empresa selecionada:", selected);
    setSelectedOptionsEmp(selected[0]); // Ajuste aqui para pegar o primeiro elemento
  };

  const handleSelectGru = (selected) => {
    // console.log("Grupo selecionado:", selected);
    setSelectedOptionsGru(selected[0]); // Ajuste aqui para pegar o primeiro elemento
  };


  const handleSelectCol = (selected) => {
    // console.log("Colaborador selecionado:", selected);
    setSelectedOptionsCol(selected);
  };

  const handleDeleteRow = (indexToDelete) => {
    console.log('Botão Excluir clicado');
    console.log('Chamando handleDeleteRow');

    setTableData((prevTableData) => {
      const deletedRow = prevTableData[indexToDelete];

      // Verifica se a linha a ser excluída pertence ao grupo atual
      console.log('Row to delete:', deletedRow);
      console.log('Selected Group:', selectedOptionsGru);

      if (deletedRow.gru === deletedRow.gru) {
        // Filtra a tabela removendo a linha a ser excluída
        const updatedTableData = prevTableData.filter((item, index) => index !== indexToDelete);

        console.log('Updated Table Data:', updatedTableData);

        // Recalcula a produção total e individual após a exclusão
        recalculateProduction(updatedTableData, deletedRow.gru);

        return updatedTableData;
      }

      return prevTableData;
    });
  };




  const recalculateProduction = (tableData, groupLabel) => {
    // Recalcula a produção total do grupo após a exclusão da linha
    const producaoTotalGrupo = tableData.reduce((total, item) => (item.gru === groupLabel ? (parseFloat(item.producaoTotalGrupo) || 0) : total), 0);

    // Recalcula a produção individual após a exclusão da linha
    const colaboradoresTotais = tableData.filter((col) => col.gru === groupLabel).length || 1;
    const producaoIndividual = producaoTotalGrupo / colaboradoresTotais || 0;

    // Atualiza os dados recalculados para a tabela
    const updatedTableData = tableData.map((item) => ({
      ...item,
      producaoTotalGrupo: item.gru === groupLabel ? producaoTotalGrupo : item.producaoTotalGrupo,
      producaoIndividual: item.gru === groupLabel ? producaoIndividual : item.producaoIndividual,
    }));

    setTableData(updatedTableData);
  };




  // const updateProductionForGroup = (newColaborador) => {
  //   setTableData((prevTableData) => {
  //     const updatedTableData = [...prevTableData];

  //     // Verifica se o grupo já existe na tabela
  //     const groupExists = updatedTableData.some((item) => item.gru === selectedOptionsGru.label);

  //     if (groupExists) {
  //       // Atualiza a produção total do grupo após adicionar o novo colaborador
  //       const producaoTotalGrupo = updatedTableData.reduce((total, item) => total + (parseFloat(item.producaoTotalGrupo) || 0), 0) + parseFloat(newColaborador[0].producaoIndividual);

  //       // Calcula a produção individual após adicionar o novo colaborador
  //       const colaboradoresTotais = updatedTableData.filter((col) => col.gru === selectedOptionsGru.label).length + 1;
  //       const producaoIndividual = producaoTotalGrupo / colaboradoresTotais || 0;

  //       // Atualiza os dados recalculados para a tabela
  //       updatedTableData.forEach((item) => {
  //         if (item.gru === selectedOptionsGru.label) {
  //           item.producaoTotalGrupo = producaoTotalGrupo;
  //           item.producaoIndividual = producaoIndividual;
  //         }
  //       });

  //       // Adiciona o novo colaborador à tabela
  //       updatedTableData.push({
  //         id: newColaborador[0].id,
  //         emp: selectedOptionsEmp ? selectedOptionsEmp.label : "",
  //         gru: selectedOptionsGru.label,
  //         producaoIndividual,
  //         producaoTotalGrupo,
  //         col: newColaborador[0].col,
  //         funcao: newColaborador[0].funcao,
  //       });
  //     } else {
  //       // Se o grupo não existir na tabela, adiciona o novo colaborador
  //       updatedTableData.push({
  //         id: newColaborador[0].id,
  //         emp: selectedOptionsEmp ? selectedOptionsEmp.label : "",
  //         gru: selectedOptionsGru.label,
  //         producaoIndividual: newColaborador[0].producaoIndividual,
  //         producaoTotalGrupo: newColaborador[0].producaoIndividual,
  //         col: newColaborador[0].col,
  //         funcao: newColaborador[0].funcao,
  //       });
  //     }

  //     return updatedTableData;
  //   });
  // };
  const handleButtonAction = async () => {
    if (selectedOptionsEmp && selectedOptionsGru && selectedOptionsCol.length > 0 && selectedDate) {
      try {
        const formattedDate = format(selectedDate, 'dd/MM/yyyy');

        // Lógica para buscar a produção do grupo
        const requestBody = {
          data: formattedDate,
          grupo: selectedOptionsGru.value,
        };

        console.log("Enviando solicitação para API...");
        console.log("RequestBody:", requestBody);

        const response = await fetch("http://localhost:5000/api/grupoPecista/prod", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        console.log("Resposta da API:", data);

        // Calcula a soma da quantidade
        const producaoTotalGrupo = data.reduce((total, item) => parseFloat(item.QTD) + total, 0);

        // Calcula a produção individual dividindo pela quantidade total de colaboradores do grupo
        const colaboradoresTotais = selectedOptionsCol.length || 1;
        const producaoIndividual = producaoTotalGrupo / colaboradoresTotais;

        console.log("Produção Total do Grupo:", producaoTotalGrupo);
        console.log("Produção Individual:", producaoIndividual);

        // Verifica se o grupo já existe na tabela
        const groupExists = tableData.some((item) => item.gru === selectedOptionsGru.label);

        if (groupExists) {
          console.log("Grupo já existe na tabela. Atualizando dados...");

          // Se o grupo já existe na tabela, recupera os dados dos colaboradores existentes no grupo
          const existingGroupData = tableData.filter((col) => col.gru === selectedOptionsGru.label);

          // Calcula a produção total do grupo considerando os colaboradores existentes e os novos
          const producaoTotalGrupo = existingGroupData.reduce((total, col) => (parseFloat(col.producaoIndividual) || 0) + total, 0) + producaoIndividual;

          const colaboradoresTotais = existingGroupData.length + selectedOptionsCol.length;
          const producaoIndividualAtualizado = producaoTotalGrupo / colaboradoresTotais || 0;
          
          // Atualiza os dados para os colaboradores existentes
          const updatedTableData = tableData.map((col) => {
            if (col.gru === selectedOptionsGru.label) {
              return {
                ...col,
                producaoTotalGrupo,
                producaoIndividual: producaoIndividualAtualizado,
              };
            }
            return col;
          });

          console.log("Dados atualizados na tabela:", updatedTableData);

          // Adiciona novos colaboradores à tabela
          const newData = selectedOptionsCol
            .filter((col) => !tableData.some((existingCol) => existingCol.id === col.value && existingCol.gru === selectedOptionsGru.label))
            .map((col) => ({
              id: col.value,
              emp: selectedOptionsEmp ? selectedOptionsEmp.label : "",
              gru: selectedOptionsGru.label,
              producaoIndividual: producaoIndividualAtualizado,
              producaoTotalGrupo,
              col: col.label,
              funcao: col.funcao,
            }));

          console.log("Novos dados a serem adicionados:", newData);

          setTableData([...updatedTableData, ...newData]);
        } else {
          console.log("Grupo não existe na tabela. Adicionando novo colaborador...");

          // Se o grupo não existe na tabela, adiciona o novo colaborador
          const newData = selectedOptionsCol.map((col) => ({
            id: col.value,
            emp: selectedOptionsEmp ? selectedOptionsEmp.label : "",
            gru: selectedOptionsGru.label,
            producaoIndividual,
            producaoTotalGrupo,
            col: col.label,
            funcao: col.funcao,
          }));

          console.log("Novos dados a serem adicionados:", newData);

          setTableData([...tableData, ...newData]);
        }
      } catch (error) {
        console.error("Erro ao enviar solicitação à API:", error);
      } finally {
        // Limpar seleções após adicionar à tabela
        setSelectedOptionsCol([]);
      }
    } else {
      console.error("Preencha todas as informações antes de executar a ação.");
    }
  };




  const resetCurrentGroup = () => {
    // setSelectedOptionsEmp(null);
    setSelectedOptionsGru([]);
    setSelectedOptionsCol([]);
    console.log("Reseting current group...");
    setTableFilledForCurrentGroup(false);
    // Outras limpezas necessárias relacionadas ao grupo atual
  };




  // console.log("selectedOptionsEmp", selectedOptionsEmp);
  // console.log("selectedOptionsGru", selectedOptionsGru);
  // console.log("selectedOptionsCol", selectedOptionsCol);
  // console.log("selectedDate", selectedDate);





  return (
    <>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        isClearable
        placeholderText="Selecione uma data"
      />
      <Flex direction="column" mt="10px">
        <Flex ml="20px" width="450px" mt="10px">
          <Select
            components={animatedComponents}
            isMulti
            options={optionsEmp}
            className="select"
            isClearable={true}
            isSearchable={true}
            isDisabled={false}
            isLoading={false}
            isRtl={false}
            onChange={handleSelectEmp}
            closeMenuOnSelect={false}
            styles={{
              control: (provided) => ({
                ...provided,
                width: '450px',
              }),
            }}
            autoWidth
          />
        </Flex>

        <Flex ml="20px" width="450px" mt="10px">
          <Select
            components={animatedComponents}
            onChange={handleSelectGru}
            isMulti
            options={optionsGru}
            className="select"
            isClearable={true}
            isSearchable={true}
            isDisabled={false}
            isLoading={false}
            isRtl={false}
            closeMenuOnSelect={false}
            styles={{
              control: (provided) => ({
                ...provided,
                width: '450px',
              }),
            }}
            autoWidth
          />
        </Flex>

        <Flex ml="20px" width="450px" mt="10px">
          <Select
            components={animatedComponents}
            isMulti
            options={optionsCol}
            onChange={handleSelectCol}
            className="select"
            isClearable={true}
            isSearchable={true}
            isDisabled={false}
            isLoading={false}
            isRtl={false}
            closeMenuOnSelect={false}
            styles={{
              control: (provided) => ({
                ...provided,
                width: '450px',
              }),
            }}
            autoWidth
          />
        </Flex>
      </Flex>
      <button onClick={handleButtonAction}>Executar Ação</button>

      {/* <button onClick={handlePrintItems}>Imprimir Prod</button> */}
      <div>
        {tableData.length > 0 && (
          <Table variant="simple" mt="4">
            <Thead>
              <Tr>
                <Th>Emp</Th>
                <Th>Gru</Th>
                <Th>Col</Th>
                <Th>Funcao</Th>
                <Th>Produção Total do Grupo</Th>
                <Th>Produção Individual</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.emp}</Td>
                  <Td>{item.gru}</Td>
                  <Td>{item.col}</Td>
                  <Td>{item.funcao}</Td>
                  <Td>{item.producaoTotalGrupo || ""}</Td>
                  <Td>{item.producaoIndividual || ""}</Td>
                  <Td>
                    <button onClick={() => { console.log("Botão Excluir clicado"); handleDeleteRow(index); }}>Excluir</button>

                  </Td>
                </Tr>
              ))}




            </Tbody>
          </Table>
        )}
      </div>


    </>
  );
};

export default GrupoPecista;
