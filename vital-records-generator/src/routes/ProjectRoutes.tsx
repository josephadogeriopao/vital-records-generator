import {HashRouter, Route, Routes } from "react-router-dom";

import Home from "../views/Home";

const ProjectRoutes = () => {

  return (
    <HashRouter >	
        <Routes >						
            <Route path="/" element={<Home />} index /> 
        </Routes>
    </HashRouter>

  )
}

export default ProjectRoutes
