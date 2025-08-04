import React, { useState, FC } from 'react';
import { FileUploader } from "react-drag-drop-files";
import ExcelExport from '../helpers/ExcelExport';
import Record from '../models/Record';
import { getDate } from '../utils/getDate';
import Spacer from '../components/Spacer';
import Logo from '../components/Logo';
import Company from '../components/Company';
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

  const fileTypes: string[] = ["TXT"];

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
<>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\nbody,h1,h2,h3,h4,h5,h6 {font-family: "Raleway", sans-serif}\n\nbody, html {\n  height: 100%;\n  line-height: 1.8;\n}\n\n/* Full height image header */\n.bgimg-1 {\n  background-position: center;\n  background-size: cover;\n  background-image: url("/w3images/mac.jpg");\n  min-height: 100%;\n}\n\n.w3-bar .w3-button {\n  padding: 16px;\n}\n'
    }}
  />
  {/* Navbar (sit on top) */}
  <div className="w3-top">
    <div className="w3-bar w3-white w3-card" id="myNavbar" style={{height:50}}>
      <a href="#home" className="w3-bar-item w3-button w3-wide">
        <Logo />

        <Company />
      </a>
      {/* Right-sided navbar links */}
      <div className="w3-right w3-hide-small">
        <a href="#about" className="w3-bar-item w3-button">
          ABOUT
        </a>
        <a href="#team" className="w3-bar-item w3-button">
          <i className="fa fa-user" /> TEAM
        </a>
        <a href="#work" className="w3-bar-item w3-button">
          <i className="fa fa-th" /> WORK
        </a>
        <a href="#contact" className="w3-bar-item w3-button">
          <i className="fa fa-envelope" /> CONTACT
        </a>
      </div>
      {/* Hide right-floated links on small screens and replace them with a menu icon */}
      <a
        href="javascript:void(0)"
        className="w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium"
         onClick={()=>{}}
      >
        <i className="fa fa-bars" />
      </a>
    </div>
  </div>

  <div 
    className="w3-light-grey"
    style={{ padding: "90px"}}
    id="contact"
  >
    <h3 className="w3-center">Vital Records Generator</h3>
    <p className="w3-center w3-large">Lets get in touch. Send us a message:</p>
    <div style={{ marginTop: 40, alignItems: "center", justifyContent:"center",
            alignSelf:"center", justifyItems:"center"
     }}>
   

         <FileUploader handleChange={(e : any) => handleChange(e)} 
            classes="custom-file-uploader w3-center" name="file" types={fileTypes} 
         />
         {data.length === 0 ? "" : <ExcelExport fileName={`${formattedDate}-vitalrecords`} data={data} />}
         <p>{file ? `File name: ${file.name}` : "no files uploaded yet"} {JSON.stringify(file)}</p>
         <h1>content</h1>
         {text.length === 0 ? "" : text.map((value: string, index: number) => {
             return <p key={index}>{value} {value.length}</p>;
           })}

    </div>
  </div>
  {/* Footer */}
  <Footer />

</>

  );
}

export default Home;