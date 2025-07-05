//import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import Login from "./components/Login"
import Home from "./components/Home"
import Registrazione from "./components/Registrazione"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/registrazione" element={<Registrazione />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
