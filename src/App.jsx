//import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import Login from "./components/Login"
import Home from "./components/NavbarHome"
import Registrazione from "./components/Registrazione"
import HomePage from "./components/HomePage"
import Profilo from "./components/Profilo"
import Azienda from "./components/Azienda"
import Utenti from "./components/Utenti"
import PianificazionePulizia from "./components/PianificazionePulizia"
import Fornitori from "./components/Fornitori"
import Forniture from "./components/Forniture"
import Infestanti from "./components/Infestanti"
import Temperature from "./components/Temperature"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/registrazione" element={<Registrazione />}></Route>
        <Route path="/homePage" element={<HomePage />}></Route>{" "}
        <Route path="/profilo" element={<Profilo />}></Route>{" "}
        <Route path="/azienda" element={<Azienda />}></Route>{" "}
        <Route path="/utenti" element={<Utenti />}></Route>
        <Route path="/pulizie" element={<PianificazionePulizia />}></Route>
        <Route path="/fornitori" element={<Fornitori />}></Route>
        <Route path="/forniture" element={<Forniture />}></Route>
        <Route path="/infestanti" element={<Infestanti />}></Route>
        <Route path="/temperatura" element={<Temperature />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
