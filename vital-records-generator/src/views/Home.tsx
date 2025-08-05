import React, { useState, FC } from 'react';
import { FileUploader } from "react-drag-drop-files";
import ExcelExport from '../helpers/ExcelExport';
import Record from '../models/Record';
import { getDate } from '../utils/getDate';
import Table from '../components/Table';
import Footer from '../layouts/Footer';
import NavBar from "../layouts/NavBar"
import Button from '../components/Button';
import exportToExcel from '../helpers/exportToExcel';
import { CSVLink } from "react-csv";

const headers = [
  { label: "First Name", key: "firstname" },
  { label: "Last Name", key: "lastname" },
  { label: "Email", key: "email" }
];

const csvdata = [
  { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
  { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
  { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
];

// <CSVLink data={data} headers={headers}>
//   Download me
// </CSVLink>;

const date: Date = new Date();
const formattedDate: string = date.toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric'
}).replace(/ /g, '-');
console.log(formattedDate);

const Home: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const fileTypes: string[] = ["TXT"];

  const handleClick = () => {
    console.log('Button clicked!');
  };


  
  const handleChange = (e: File | File[]) => {
    try{

    const reader: FileReader = new FileReader();
    reader.readAsText(e as Blob);
    reader.onload = () => {
      const fileText: string | ArrayBuffer | null = reader.result;
      if (typeof fileText === 'string') {
        const lines: string[] = fileText.split('\r\n');

        let records: any[] = [];
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
        }
        setData(records);
        setFile(e as File)
        setIsDisabled(false)
     
      }
    }
    }catch(e : any){
      alert(JSON.stringify("line 63" +e, null , 4))

    }
  };

  const unSelectFile = (): void => {
    setFile(null);
    setIsDisabled(true);
    setData([]);
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
         onTypeError={(error : string)=>{
          alert(error);
          setFile(null);
          setIsDisabled(true);
          setData([]);


         }}
         uploadedLabel={file && data.length > 0?"Uploaded Successfully! Upload another?" : "upload or drop a file right here"}
            classes="custom-file-uploader w3-center" name="file" types={fileTypes} 
         />
         <p>{file ? `File name: ${file.name}` : "no files uploaded yet"} {JSON.stringify(file)}</p>
      <div style={{position : "absolute", top: 400,left: "50%",   transform: "translate(-50%)"}}
     >
          <Button label="Clear File" onClick={unSelectFile} disabled={isDisabled}/>
          {/* <Button label="Export CSV" onClick={() => {exportToCSV(data, `${formattedDate}-vitalrecords`)}} disabled={isDisabled} /> */}
          <Button label="Export Excel" onClick={()=>{exportToExcel(data, `${formattedDate}-vitalrecords`)}} disabled={isDisabled} className="my-custom-button" />
 <CSVLink data={csvdata} headers={headers}  >
             <Button label="Export CSV" disabled={isDisabled}></Button>

 </CSVLink>;
        </div>  

          <Table records={data} isData={file === null}/>
    </div>

  </div>
  {/* Footer */}

  <Footer />

</>

  );
}

export default Home;