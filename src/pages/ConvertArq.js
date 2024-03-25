import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ConvertArq = () => {
  const [fileContent, setFileContent] = useState("");
  const [extractedData, setExtractedData] = useState([]);

  const processSheet = (sheet) => {
    const impojo = [];
    let verifica;
  
    for (let i = 0; i < sheet.length; i++) {
      const row = sheet[i];
      verifica = false;
      let t = null;
      const s = {};
  
      for (const cellKey in row) {
        const cell = row[cellKey];
  
        if (cell !== undefined) {
          switch (cell.t) {
            case "s":
              t = cell.v.toUpperCase().trim();
              break;
            case "n":
              t = String(cell.v).toUpperCase().trim();
              break;
            default:
              t = String(cell.v).toUpperCase().trim();
              break;
          }
        }
  
        if (
          cellKey === "B" &&
          cell.t === "n" &&
          XLSX.SSF.is_date(cell.v) &&
          cell.v !== ""
        ) {
          try {
            const excelDate = XLSX.SSF.parse_date_code(cell.v);
            const jsDate = new Date(
              excelDate.y,
              excelDate.m - 1,
              excelDate.d
            );
            const formatter = new Intl.DateTimeFormat("pt-BR", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            });
            s.data = formatter.format(jsDate);
          } catch (e) {}
        } else if (cellKey === "E" && t === "TOTAL") {
          s.documento = s.data;
          s.tipo = "TRANSFERÊNCIA";
          verifica = true;
        } else if (
          (cellKey === "H" ||
            cellKey === "I" ||
            cellKey === "K" ||
            cellKey === "L") &&
          t !== "" &&
          t.includes(".") &&
          t !== "0.0"
        ) {
          t = String(Number(t.replace(",", "").replace(".", "")));
          switch (cellKey) {
            case "H":
              s.iof = t;
              break;
            case "I":
              s.irf = t;
              break;
            case "K":
              s.juros = t;
              break;
            case "L":
              s.movliquido = t;
              break;
            default:
              break;
          }
        }
      }
  
      if (
        verifica &&
        s.documento !== null &&
        s.data !== null &&
        s.movliquido !== null
      ) {
        impojo.push(s);
        verifica = false;
      }
    }
  
    return impojo;
  };
  

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const importaItau = processSheet(XLSX.utils.sheet_to_json(sheet));

      const formattedData = JSON.stringify(importaItau, null, 2);
      setFileContent(formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "exported_data.txt");
  };

  return (
    <div>
      <h1>Convert Arq</h1>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      <button onClick={handleExport}>Exportar Dados</button>
      <pre>{fileContent}</pre>
      <div>
        <h2>Dados Extraídos</h2>
        <ul>
          {extractedData.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConvertArq;