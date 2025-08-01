import React, { useState, FC } from 'react';
import { FileUploader } from "react-drag-drop-files";
import ExcelExport from '../helpers/ExcelExport';
import Record from '../models/Record';
import { getDate } from '../utils/getDate';
import Spacer from '../components/Spacer';
import Footer from '../layouts/Footer';

const date: Date = new Date();
const formattedDate: string = date.toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric'
}).replace(/ /g, '-');
console.log(formattedDate);

const Home: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [text, setText] = useState<string[]>([]);

  const fileTypes: string[] = ["JPG", "PNG", "GIF", "TXT"];

  const handleChange = (e: any) => {
    const reader: FileReader = new FileReader();
    reader.readAsText(e);
    reader.onload = () => {
      const fileText: string | ArrayBuffer | null = reader.result;
      if (typeof fileText === 'string') {
        const lines: string[] = fileText.split('\r\n');

        let records: any[] = [];
        let textRecords: string[] = [];
        for (let index: number = 0; index < lines.length; index++) {
          let record: Record = new Record();
          record.setSSN(lines[index].substring(0, 9));
          record.setOwner(lines[index].substring(9, 27));
          record.setResCode(lines[index].substring(36, 3));
          record.setAddress(lines[index].substring(39, 22));
          record.setCity(lines[index].substring(61, 17));
          record.setDOB(getDate(lines[index].substring(-20, 8)));
          record.setDOD(getDate(lines[index].substring(-12, 8)));
          record.setSex(lines[index].substring(-4, 1));
          record.setAge(lines[index].substring(-3, 3));

          records.push(record.toArray());
          textRecords.push(JSON.stringify(record, null, 2));
        }
        setData(records);
        setText(textRecords);
      }
    };
  };

  const unSelectFile = (): void => {
    setFile(null);
  };

  return (
    <div className="App-header" >
        <Spacer marginTop={30} />
        <FileUploader handleChange={(e : any) => handleChange(e)} name="file" types={fileTypes} />
        {data.length === 0 ? "" : <ExcelExport fileName={`${formattedDate}-vitalrecords`} data={data} />}
        <p>{file ? `File name: ${file.name}` : "no files uploaded yet"} {JSON.stringify(file)}</p>
        <h1>content</h1>
        {text.length === 0 ? "" : text.map((value: string, index: number) => {
            return <p key={index}>{value} {value.length}</p>;
          })}
    </div>
  );
}

export default Home;