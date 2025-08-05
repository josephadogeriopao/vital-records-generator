
import Record from '../models/Record';
import { mkConfig, generateCsv, asString } from "export-to-csv";

const csvConfig = mkConfig({ useKeysAsHeaders: true });

const addNewLine = (s: string): string => s + "\n";

const heading: string[][] = [["SSN", "OWNER", "RESCODE", "ADDRESS", "CITY", "DOB", "DOD", "SEX", "AGE"]];

const exportToCSV = ( records : Record[], fileName: string ) => {
  let csvData = []
  for(let i = 0; i<= records.length; i++){
    csvData.push(records[i].instance());
  }
  console.log(csvData)

// Converts your Array<Object> to a CsvOutput string based on the configs
const csvOutput = generateCsv(csvConfig)(csvData);
  //saveAs(blob, `${fileName}.xlsx`);
  // This would result in a type error
// const csvOutputWithNewLine = addNewLine(csvOutput);
// ❌ => CsvOutput is not assignable to type string.

// This unpacks CsvOutput which turns it into a string before use
const csvOutputWithNewLine = addNewLine(asString(csvOutput));
alert(csvOutputWithNewLine);

}

export default exportToCSV;