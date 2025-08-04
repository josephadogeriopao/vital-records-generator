import React, { useState, FC } from 'react';
import { FileUploader } from "react-drag-drop-files";
import ExcelExport from '../helpers/ExcelExport';
import Record from '../models/Record';
import { getDate } from '../utils/getDate';
import Spacer from '../components/Spacer';
import Logo from '../components/Logo';
import Company from '../components/Company';
import Table from '../components/Table';
import Footer from '../layouts/Footer';
import NavBar from "../layouts/NavBar"

const date: Date = new Date();
const formattedDate: string = date.toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric'
}).replace(/ /g, '-');
console.log(formattedDate);

const Home: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [text, setText] = useState<string[]>([]);

  const fileTypes: string[] = ["TXT"];

  const handleChange = (e: File | File[]) => {
    const reader: FileReader = new FileReader();
    reader.readAsText(e as Blob);
    reader.onload = () => {
      const fileText: string | ArrayBuffer | null = reader.result;
      if (typeof fileText === 'string') {
        const lines: string[] = fileText.split('\r\n');

        let records: any[] = [];
        let textRecords: string[] = [];
        for (let index: number = 0; index < lines.length; index++) {
          let record: Record = new Record();
          record.setSSN(lines[index].substr(0, 9));
          record.setOwner(lines[index].substr(9, 27));
          record.setResCode(lines[index].substr(36, 3));
          record.setAddress(lines[index].substr(39, 22));
          record.setCity(lines[index].substr(61, 17));
          record.setDOB(getDate(lines[index].substr(-20, 8)));
          record.setDOD(getDate(lines[index].substr(-12, 8)));
          record.setSex(lines[index].substr(-4, 1));
          record.setAge(lines[index].substr(-3, 3));

          records.push(record);
          textRecords.push(JSON.stringify(record, null, 2));
        }
        setData(records);
        setText(textRecords);
        setFile(e as File)
      }
    };
  };

  const unSelectFile = (): void => {
    setFile(null);
  };

  return (
<>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\nbody,h1,h2,h3,h4,h5,h6 {font-family: "Raleway", sans-serif}\n\nbody, html {\n  height: 100%;\n  line-height: 1.8;\n}\n\n/* Full height image header */\n.bgimg-1 {\n  background-position: center;\n  background-size: cover;\n  background-image: url("/w3images/mac.jpg");\n  min-height: 100%;\n}\n\n.w3-bar .w3-button {\n  padding: 16px;\n}\n'
    }}
  />
  {/* Navbar (sit on top) */}
<NavBar />

  <div 
    className="w3-light-grey"
    style={{ padding: "60px 20px", height :"100vh"}}
    id="contact"
  >
    <h3 className="w3-center">Vital Records Generator</h3>
    <p className="w3-center w3-large"><i>create vital record reports with ease:</i></p>
    <div style={{ marginTop: 40, alignItems: "center", justifyContent:"center",
            alignSelf:"center", justifyItems:"center"
     }}>
   

         <FileUploader handleChange={handleChange} 
            classes="custom-file-uploader w3-center" name="file" types={fileTypes} 
         />
         {data.length === 0 ? "" : <ExcelExport fileName={`${formattedDate}-vitalrecords`} data={data} />}
         <p>{file ? `File name: ${file.name}` : "no files uploaded yet"} {JSON.stringify(file)}</p>
         <h1>content</h1>
  

          {!file?<></> :<Table records={data}/>}
    </div>

  </div>
  {/* Footer */}

  <Footer />

</>

  );
}

export default Home;