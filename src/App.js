import logo from './logo.svg';
import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
// import './App.css';
import Project from "./project";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/*" element={<Project/>}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
