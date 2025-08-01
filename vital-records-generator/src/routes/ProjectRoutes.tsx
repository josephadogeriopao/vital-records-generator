import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react'

import Home from "../views/Home";

const ProjectRoutes = () => {

  return (
    <BrowserRouter >	
        <Routes >						
            <Route path="/" element={<Home />} index /> 
        </Routes>
    </BrowserRouter>

  )
}

export default ProjectRoutes
