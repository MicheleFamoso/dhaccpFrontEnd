//import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import Login from "./components/Login"
import Home from "./components/Home"
import Registrazione from "./components/Registrazione"
import HomePage from "./components/HomePage"
import Profilo from "./components/Profilo"
import Azienda from "./components/Azienda"
import Utenti from "./components/Utenti"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/registrazione" element={<Registrazione />}></Route>
        <Route path="/homePage" element={<HomePage />}></Route>{" "}
        <Route path="/profilo" element={<Profilo />}></Route>{" "}
        <Route path="/azienda" element={<Azienda />}></Route>{" "}
        <Route path="/utenti" element={<Utenti />}></Route>{" "}
      </Routes>
    </BrowserRouter>
  )
}

export default App
