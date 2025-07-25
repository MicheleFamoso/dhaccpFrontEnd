import React, { useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import {
  BuildingStorefrontIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  BugAntIcon,
  UserCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid"

import NavbarHome from "./NavbarHome"

const Login = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

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
    <div className="bg-[url('/')] bg-contain bg-no-repeat md:bg-right bg-bottom w-screen h-screen bg-beige overflow-auto 2xl:px-60">
      <div className="relative z-50 md:hidden">
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
      <div className="sm:grid grid-cols-2 mt-10  ">
        <div className="bg-salviaChiaro/60 h-fit mx-auto p-6 rounded-3xl shadow-md shadow-salvia w-fit border-1 border-salvia flex backdrop-blur-sm ">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl   mb-4 text-center">Benvenuto</h2>
            {error && (
              <p className="text-rosso text-sm mb-2 text-center animate-fade-in">
                {error}
              </p>
            )}
            <div className="relative mt-6">
              <input
                placeholder=""
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden "
                autoComplete="username"
              />
              <label
                htmlFor="username"
                className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
              >
                Username
              </label>
            </div>
            <div className="relative mt-6">
              <input
                id="password"
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden "
                autoComplete="current-password"
              />
              <label
                htmlFor="password"
                className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
              >
                Password
              </label>
            </div>

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
        </div>{" "}
        <div className="hidden sm:grid grid-flow-col auto-rows-auto gap-4 mr-4">
          {" "}
          <div className="bg-salvia row-span-3 w-fit h-fit rounded-3xl shadow-md shadow-salvia border-1 border-salvia  px-6 py-8">
            <p className="text-center mb-3 text-xl font-semibold text-salviaScuro text-shadow-2xs">
              Chi siamo
            </p>
            <p className=" text-wrap text-xl ">
              <span className="font-[Unna] font-bold text-xl ">d/HACCP</span> è
              una piattaforma digitale pensata per semplificare la gestione
              dell’HACCP per ristoratori e aziende alimentari. Il nostro
              obiettivo è digitalizzare i controlli per migliorare l’efficienza
              e la conformità.
            </p>
          </div>
          <div className="bg-salviaScuro col-span-2  h-fit rounded-3xl shadow-md w-fit shadow-salvia border-1 border-salvia  p-6 text-white">
            <p className="text-center mb-3 font-semibold text-xl text-salviaChiaro">
              Funzionalità
            </p>
            <p className="m2-3 flex items-center gap-2">
              <BuildingStorefrontIcon className="h-5 w-5 text-amber-600" />
              Registrare e gestire più ristoranti
            </p>
            <p className="mt-3 flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-yellow-500 " />
              Tenere traccia delle operazioni di pulizia
            </p>
            <p className="mt-3 flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />
              Monitorare temperature giornaliere
            </p>
            <p className="mt-3 flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5 text-green-600" />
              Gestire fornitori e forniture
            </p>
            <p className="mt-3 flex items-center gap-2">
              <BugAntIcon className="h-5 w-5 text-red-500" />
              Controllare infestanti e scadenze
            </p>
          </div>{" "}
          <div className="bg-salviaChiaro col-span-2 row-span-2   h-fit rounded-3xl shadow-md shadow-salvia border-1 border-salvia px-6 py-3">
            <p className="text-center font-semibold text-xl text-salvia text-shadow-xs">
              Contatti
            </p>
            <p className="mt-1 flex items-center gap-2 justify-center">
              <UserCircleIcon className="h-5 w-5 text-blue-600" />
              Michele Famoso
            </p>
            <p className="mt-3 flex items-center gap-2 justify-center">
              <EnvelopeIcon className="h-5 w-5 text-red-500" />
              michelefamoso@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login
