import {HashRouter, Route, Routes } from "react-router-dom";
import Footer from "../layouts/Footer";

import Home from "../views/Home";

const ProjectRoutes = () => {

  return (
          <div style={{ alignItems :'center', justifyItems : 'center',justifyContent: "center", alignContent:"center" ,
                      alignSelf:"center",justifySelf:'center',
        }}>
    <HashRouter >	
        <Routes >						
            <Route path="/" element={<Home />} index /> 
        </Routes>
    </HashRouter>

    </div>

  )
}

export default ProjectRoutes
