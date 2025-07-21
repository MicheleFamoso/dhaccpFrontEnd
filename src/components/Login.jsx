import React, { useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"

import NavbarHome from "./NavbarHome"

const Login = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Email:", userName)
    console.log("Password:", password)
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel login")
        }
        return response.text()
      })
      .then((token) => {
        console.log("Token ricevuto:", token)
        localStorage.setItem("token", token)
        try {
          const decoded = jwtDecode(token)
          localStorage.setItem("ruolo", decoded.role)
          console.log("Ruolo salvato:", decoded.role)
        } catch (err) {
          console.error("Errore nella decodifica del token:", err)
        }
        setError("")
        navigate("/homePage")
      })
      .catch((error) => {
        console.error("Errore:", error.message)
        setError(error.message)
      })
  }

  return (
    <div className="bg-[url('/12.png')] w-screen h-screen bg-no-repeat bg-[position:right_bottom] bg-[length:700px_700px] bg-beige overflow-auto 2xl:px-60">
      <div className="relative z-50">
        <NavbarHome />
      </div>

      <div className="ml-20">
        <div className="flex flex-col items-center  w-fit self-start ">
          <h1 className="font-[Unna] text-7xl md:text-[180px]  mt-2 ">
            d<span className="text-salvia text-shadow-2xs">/</span>haccp
          </h1>
          <p className="md:text-4xl text-2xl font-[Unna]  ">
            Digital <span className="text-salvia text-shadow-2xs">HACCP </span>
            Management
          </p>
        </div>
      </div>

      <div className="bg-salviaChiaro/60  p-6 rounded-3xl shadow-md shadow-salvia w-90 border-1 border-salvia flex md:ml-45   md:mt-10 mx-auto mt-10 backdrop-blur-sm ">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl   mb-4 text-center">Benvenuto</h2>
          {error && (
            <p className="text-red-500 text-sm mb-2 text-center animate-fade-in">
              {error}
            </p>
          )}
          <input
            placeholder="UserName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full mb-3   p-2   border-b focus:border-ambra focus:border-b-2 focus:outline-hidden "
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border-b  focus:border-ambra focus:border-b-2 focus:outline-hidden"
          />
          <div className=" mt-3 mb-3">
            <button
              type="submit"
              className="w-1/1  bg-salvia font-bold text-white text-shadow-2xs py-2 rounded-3xl hover:bg-salviaScuro "
            >
              Accedi
            </button>
          </div>
          <div className="flex justify-center items-center">
            <p className="mr-2 text-gray-700">Non hai un account ? </p>
            <button
              onClick={() => navigate("/registrazione")}
              className=" bg-ambra px-4 py-1 rounded-3xl font-bold cursor-pointer hover:bg-amber-500 "
            >
              Registrati
            </button>{" "}
          </div>
        </form>
      </div>
    </div>
  )
}
export default Login
