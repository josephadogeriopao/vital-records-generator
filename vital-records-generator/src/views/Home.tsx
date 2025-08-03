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
    // <div className="App-header" >
    //     <Spacer marginTop={30} />
    //     <FileUploader handleChange={(e : any) => handleChange(e)} name="file" types={fileTypes} 
    //     />
    //     {data.length === 0 ? "" : <ExcelExport fileName={`${formattedDate}-vitalrecords`} data={data} />}
    //     <p>{file ? `File name: ${file.name}` : "no files uploaded yet"} {JSON.stringify(file)}</p>
    //     <h1>content</h1>
    //     {text.length === 0 ? "" : text.map((value: string, index: number) => {
    //         return <p key={index}>{value} {value.length}</p>;
    //       })}
    // </div>
<>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\nbody,h1,h2,h3,h4,h5,h6 {font-family: "Raleway", sans-serif}\n\nbody, html {\n  height: 100%;\n  line-height: 1.8;\n}\n\n/* Full height image header */\n.bgimg-1 {\n  background-position: center;\n  background-size: cover;\n  background-image: url("/w3images/mac.jpg");\n  min-height: 100%;\n}\n\n.w3-bar .w3-button {\n  padding: 16px;\n}\n'
    }}
  />
  {/* Navbar (sit on top) */}
  <div className="w3-top">
    <div className="w3-bar w3-white w3-card" id="myNavbar">
      <a href="#home" className="w3-bar-item w3-button w3-wide">
        LOGO
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
        <a href="#pricing" className="w3-bar-item w3-button">
          <i className="fa fa-usd" /> PRICING
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
  {/* Sidebar on small screens when clicking the menu icon */}
  <nav
    className="w3-sidebar w3-bar-block w3-black w3-card w3-animate-left w3-hide-medium w3-hide-large"
    style={{ display: "none" }}
    id="mySidebar"
  >
    <a
      href="javascript:void(0)"
 onClick={()=>{}}      
 className="w3-bar-item w3-button w3-large w3-padding-16"
    >
      Close ×
    </a>
    <a href="#about"  onClick={()=>{}} className="w3-bar-item w3-button">
      ABOUT
    </a>
    <a href="#team"  onClick={()=>{}} className="w3-bar-item w3-button">
      TEAM
    </a>
    <a href="#work"  onClick={()=>{}} className="w3-bar-item w3-button">
      WORK
    </a>
    <a href="#pricing"  onClick={()=>{}} className="w3-bar-item w3-button">
      PRICING
    </a>
    <a href="#contact"  onClick={()=>{}} className="w3-bar-item w3-button">
      CONTACT
    </a>
  </nav>



  {/* Header with full-height image */}
  {/* <header className="bgimg-1 w3-display-container w3-grayscale-min" id="home">
    <div className="w3-display-left w3-text-white" style={{ padding: 48 }}>
      <span className="w3-jumbo w3-hide-small">
        Start something that matters
      </span>
      <br />
      <span className="w3-xxlarge w3-hide-large w3-hide-medium">
        Start something that matters
      </span>
      <br />
      <span className="w3-large">
        Stop wasting valuable time with projects that just isn't you.
      </span>
      <p>
        <a
          href="#about"
          className="w3-button w3-white w3-padding-large w3-large w3-margin-top w3-opacity w3-hover-opacity-off"
        >
          Learn more and start today
        </a>
      </p>
    </div>
    <div
      className="w3-display-bottomleft w3-text-grey w3-large"
      style={{ padding: "24px 48px" }}
    >
      <i className="fa fa-facebook-official w3-hover-opacity" />
      <i className="fa fa-instagram w3-hover-opacity" />
      <i className="fa fa-snapchat w3-hover-opacity" />
      <i className="fa fa-pinterest-p w3-hover-opacity" />
      <i className="fa fa-twitter w3-hover-opacity" />
      <i className="fa fa-linkedin w3-hover-opacity" />
    </div>
  </header> */}



  {/* Modal for full size images on click*/}
  <div
    id="modal01"
    className="w3-modal w3-black"
    onClick={()=>{//this.style.display='none'

    }}
  >
    <span
      className="w3-button w3-xxlarge w3-black w3-padding-large w3-display-topright"
      title="Close Modal Image"
    >
      ×
    </span>
    <div className="w3-modal-content w3-animate-zoom w3-center w3-transparent w3-padding-64">
      <img id="img01" className="w3-image" />
      <p id="caption" className="w3-opacity w3-large" />
    </div>
  </div>



  {/* Contact Section */}
  <div 
    className="w3-light-grey"
    style={{ padding: "128px 16px"}}
    id="contact"
  >
    <h3 className="w3-center">CONTACT</h3>
    <p className="w3-center w3-large">Lets get in touch. Send us a message:</p>
    <div style={{ marginTop: 48 }}>
      <p>
        <i className="fa fa-map-marker fa-fw w3-xxlarge w3-margin-right" />{" "}
        Chicago, US
      </p>
      <p>
        <i className="fa fa-phone fa-fw w3-xxlarge w3-margin-right" /> Phone:
        +00 151515
      </p>
      <p>
        <i className="fa fa-envelope fa-fw w3-xxlarge w3-margin-right"> </i>{" "}
        Email: mail@mail.com
      </p>
      <br />
      <form action="/action_page.php" target="_blank">
        <p>
          <input
            className="w3-input w3-border"
            type="text"
            placeholder="Name"
            required={false}            name="Name"
          />
        </p>
        <p>
          <input
            className="w3-input w3-border"
            type="text"
            placeholder="Email"
            required={false}            
            name="Email"
          />
        </p>
        <p>
          <input
            className="w3-input w3-border"
            type="text"
            placeholder="Subject"
            required={false}            
            name="Subject"
          />
        </p>
        <p>
          <input
            className="w3-input w3-border"
            type="text"
            placeholder="Message"
            required={false}            
            name="Message"
          />
        </p>
        <p>
          <button className="w3-button w3-black" type="submit">
            <i className="fa fa-paper-plane" /> SEND MESSAGE
          </button>
        </p>
      </form>
      {/* Image of location/map */}
      <img
        src="/w3images/map.jpg"
        className="w3-image w3-greyscale"
        style={{ width: "100%", marginTop: 48 }}
      />
    </div>
  </div>
  {/* Footer */}
  <Footer />

</>

  );
}

export default Home;