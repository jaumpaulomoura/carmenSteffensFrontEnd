const calcularProducao = async () => {
  try {
    const orderArray = tableData.slice().sort((a, b) => b.porcentagemTrabalhada - a.porcentagemTrabalhada);

    for (const newData of orderArray) {
      const PECGRUPO = newData.PECGRUPO;
      let PECPRODGRU = 0;

      const totalPECPRODIND = tableData.reduce((acc, item) => {
        return acc + item.PECPRODIND;
      }, 0);

      const PECPRODGRUProducaoInd = tableData.reduce((acc, item) => {
        return acc + (newData.FUNCAO === 'C' ? item.PECPRODGRU * 0.3 : item.PECPRODGRU * 0.4);
      }, 0);

      const countByGroup = {};
      tableData.forEach(item => {
        countByGroup[item.PECGRUPO] = (countByGroup[item.PECGRUPO] || 0) + 1;
      });

      if (countByGroup[PECGRUPO] < 3) {
        const countC = tableData.filter(item => item.PECGRUPO === PECGRUPO && item.FUNCAO === 'C').length;
        const countP = tableData.filter(item => item.PECGRUPO === PECGRUPO && item.FUNCAO === 'P').length;

        if (countC === 2) {
          const PECPRODGRUPerColab = totalPECPRODIND / countByGroup[PECGRUPO];
          for (let i = 0; i < tableData.length; i++) {
            const item = tableData[i];
            if (item.PECGRUPO === PECGRUPO) {
              if (item.FUNCAO === 'C') {
                item.PECPRODGRU = PECPRODGRUPerColab;
                item.PECPRODIND = totalPECPRODIND;
              }
            }
          }
        } else if (countC === 1 && countP === 1) {
          const PECPRODGRUP = totalPECPRODIND * 0.6;
          const PECPRODGRUC = totalPECPRODIND * 0.4;
          for (let i = 0; i < tableData.length; i++) {
            const item = tableData[i];
            if (item.PECGRUPO === PECGRUPO) {
              if (item.FUNCAO === 'C') {
                item.PECPRODGRU = PECPRODGRUC;
                item.PECPRODIND = totalPECPRODIND;
              } else if (item.FUNCAO === 'P') {
                item.PECPRODGRU = PECPRODGRUP;
                item.PECPRODIND = totalPECPRODIND;
              }
            }
          }
        }
        setTableData((prevTableData) => {
          const updatedTableData = prevTableData.map((item) => {
            const dataIndex = orderArray.findIndex((newData) => newData.PECCODCOL === item.PECCODCOL);
            if (dataIndex !== -1) {
              const newData = orderArray[dataIndex];
              // Atualiza os dados do colaborador com os valores corretos
              return {
                ...item,
                PECPRODGRU: newData.PECPRODGRU,
                PECPRODIND: newData.PECPRODIND,
              };
            }
            return item;
          });
          return updatedTableData;
        });
      } else {
        for (let i = 0; i < newData.porcentagemTrabalhada.length; i++) {
          if (newData.porcentagemTrabalhada[i] < 100) {
            const PECPRODGRUReceber = tableData.reduce((acc, item) => {
              const percentual = newData.FUNCAO === 'C' ? 0.3 : 0.4;
              const valor = item.PECPRODGRU * percentual;
              return acc + valor;
            }, 0) * (newData.porcentagemTrabalhada[i] / 100);

            const desconto = PECPRODGRUProducaoInd - PECPRODGRUReceber;

            PECPRODGRU = PECPRODGRUReceber;
            newData.PECPRODGRU = PECPRODGRU;
            newData.PECPRODIND = totalPECPRODIND;

            for (const colab of tableData) {
              if (colab.PECGRUPO === newData.PECGRUPO && colab.PECCODCOL !== newData.PECCODCOL) {
                let percentual;
                if (colab.FUNCAO === 'C') {
                  percentual = 0.3;
                } else {
                  percentual = 0.4;
                }
                if (percentual !== undefined) {
                  const valorReceber = desconto * percentual;
                  colab.PECPRODGRU += valorReceber;
                }
              }
            }
          } else {
            PECPRODGRU = tableData.reduce((acc, item) => {
              const percentual = newData.FUNCAO === 'C' ? 0.3 : 0.4;
              const valor = item.PECPRODGRU * percentual;
              return acc + valor;
            }, 0);
          }
        }

        // Configura os dados atualizados na tabela.
        setTableData((prevTableData) => {
          const updatedTableData = [...prevTableData];
          const dataIndex = updatedTableData.findIndex((item) => item.PECCODCOL === newData.PECCODCOL);
          if (dataIndex !== -1) {
            updatedTableData[dataIndex].PECPRODGRU = PECPRODGRU;
            updatedTableData[dataIndex].PECPRODIND = totalPECPRODIND;
          }
          return updatedTableData;
        });
      }
    }
  } catch (error) {
    console.error("Erro ao calcular a produção:", error.message);
  }
};
