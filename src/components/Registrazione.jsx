import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import NavbarHome from "./NavbarHome"
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

const Registrazione = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [nome, setNome] = useState("")
  const [cognome, setCognome] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const Handleregister = (e) => {
    e.preventDefault()

    if (!userName || !password || !nome || !cognome || !email) {
      setError("Compila tutti i campi")
      return
    }
    setError("")

    fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        password: password,
        nome: nome,
        cognome: cognome,
        email: email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella registrazione")
        } else {
          setSuccess("Registrazione avvenuta con successo!")
          setTimeout(() => navigate("/"), 1000)
        }
      })
      .catch((error) => {
        console.error("Errore:", error.message)
        setError(error.message)
      })
  }

  return (
    <div className="bg-[url('/')] bg-contain bg-no-repeat md:bg-right bg-bottom w-screen h-screen bg-beige overflow-auto 2xl:px-60 ">
      <div className="relative z-50 md:hidden">
        <NavbarHome />
      </div>
      <div className="md:ml-20">
        <div className="flex flex-col items-center  md:w-fit md:self-start  ">
          <h1 className="font-[Unna] text-7xl 2xl:text-[180px] md:text-[140px]  mt-2 ">
            d<span className="text-salvia text-shadow-2xs">/</span>haccp
          </h1>
          <p className="md:text-4xl text-2xl font-[Unna]  ">
            Digital <span className="text-salvia text-shadow-2xs">HACCP </span>
            Management
          </p>
        </div>
      </div>
      <div className="sm:grid grid-cols-2 mt-10 ">
        <div className="bg-salviaChiaro/60 h-fit mx-auto p-8 rounded-3xl shadow-md shadow-salvia w-fit border-1 border-salvia flex backdrop-blur-sm">
          <form onSubmit={Handleregister}>
            <h2 className="text-2xl   mb-4 text-center">Registrazione</h2>
            {error && (
              <p className="text-red-500 text-sm mb-2 text-center animate-fade-in">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-600 text-sm mb-2 text-center animate-fade-in">
                {success}
              </p>
            )}
            <div className="relative mt-6">
              <input
                id="nome"
                placeholder=""
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden "
              />
              <label
                for="nome"
                class="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
              >
                Nome
              </label>
            </div>
            <div className="relative mt-6">
              <input
                placeholder=""
                id="cognome"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
                className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden "
              />
              <label
                for="cognome
                  "
                class="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
              >
                Cognome
              </label>
            </div>
            <div className="relative mt-6">
              <input
                id="username"
                placeholder=""
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden  "
              />
              <label
                for="username"
                class="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
              >
                username
              </label>
            </div>
            <div className="relative mt-6">
              <input
                id="email"
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden  "
              />
              <label
                for="email"
                class="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
              >
                Email
              </label>
            </div>
            <div className="relative mt-6">
              <input
                id="password"
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden  "
              />
              <label
                for="password"
                class="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
              >
                Password
              </label>
            </div>

            <div className="flex justify-around mt-3 mb-1">
              <button
                onClick={() => navigate("/")}
                className="w-25 bg-salvia/50 shadow-2xl shadow-salvia  text-gray-800 py-2 rounded-3xl hover:bg-rosso hover:text-amber-50 mr-10"
                type="button"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="w-25  bg-salvia/50 shadow-2xl shadow-salvia  text-gray-800 py-2 rounded-3xl hover:bg-salviaScuro hover:text-amber-50"
              >
                Registrati
              </button>
            </div>
          </form>
        </div>{" "}
        <div className="hidden sm:grid grid-flow-col auto-rows-auto gap-4 mr-4 ">
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
export default Registrazione
