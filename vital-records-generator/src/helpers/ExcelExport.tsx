import React, { FC } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const heading: string[][] = [["SSN", "OWNER", "RESCODE", "ADDRESS", "CITY", "DOB", "DOD", "SEX", "AGE"]];

interface ExcelExportProps {
  data: Record<string, any>[];
  fileName: string;
}

const ExcelExport: FC<ExcelExportProps> = ({ data, fileName }) => {
  alert(JSON.stringify(data, null, 2))
  const exportToExcel = (): void => {
    const worksheet = XLSX.utils.json_to_sheet(data,{ skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer: Uint8Array = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream;vnd.ms-excel;charset=utf-8' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <button style={{ width: 200, height: 20, alignSelf: "flex-start" }} onClick={exportToExcel}>Export File</button>
  );
}

export default ExcelExport;