import React, { useState } from "react"
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
} from "@heroicons/react/24/outline"

const Login = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = useState(null)

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
        setError("")
        navigate("/homePage")
      })
      .catch((error) => {
        console.error("Errore:", error.message)
        setError(error.message)
      })
  }

  return (
    <div className=" bg-[url('/4802922.webp')]   min-h-screen bg-cover ">
      <div className=" flex justify-end ">
        <div className=" bg-stone-100/70 w-128 backdrop-blur-[3px]  flex   rounded-4xl shadow-md  border-1 border-stone-200 mr-20 mt-5 ">
          <button
            onClick={() =>
              setActivePanel(activePanel === "features" ? null : "features")
            }
            className={`px-8 py-3 rounded-4xl ${
              activePanel === "features"
                ? "bg-stone-300/70"
                : "hover:bg-stone-300/50"
            }`}
          >
            Funzionalità
          </button>
          <button
            onClick={() => setActivePanel(activePanel === "noi" ? null : "noi")}
            className={`px-8 py-3 rounded-4xl ${
              activePanel === "noi"
                ? "bg-stone-300/70"
                : "hover:bg-stone-300/50"
            }`}
          >
            Chi siamo
          </button>
          <button
            onClick={() =>
              setActivePanel(activePanel === "contact" ? null : "contact")
            }
            className={`px-8 py-3 rounded-4xl ${
              activePanel === "contact"
                ? "bg-stone-300/70"
                : "hover:bg-stone-300/50"
            }`}
          >
            Contatti
          </button>
          <button
            onClick={() =>
              setActivePanel(activePanel === "sede" ? null : "sede")
            }
            className={`px-8 py-3 rounded-4xl ${
              activePanel === "sede"
                ? "bg-stone-300/70"
                : "hover:bg-stone-300/50"
            }`}
          >
            Sede
          </button>
        </div>
      </div>
      {activePanel === "features" && (
        <div className="absolute right-45 top-20 z-10">
          <div className="bg-stone-100/70 backdrop-blur-[3px] rounded-4xl shadow-md border-1 border-stone-200 w-100 p-6">
            <p className="mt-3 flex items-center gap-2">
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
          </div>
        </div>
      )}
      {activePanel === "noi" && (
        <div className="absolute right-45 top-20 z-10">
          <div className="bg-stone-100/70 backdrop-blur-[3px] rounded-4xl shadow-md border-1 border-stone-200 w-80 p-6">
            <p className=" text-wrap">
              <span className="font-[Unna] font-bold text-xl ">d/HACCP</span> è
              una piattaforma digitale pensata per semplificare la gestione
              dell’HACCP per ristoratori e aziende alimentari. Il nostro
              obiettivo è digitalizzare i controlli per migliorare l’efficienza
              e la conformità.
            </p>
          </div>
        </div>
      )}
      {activePanel === "contact" && (
        <div className="absolute right-32 top-20 z-10">
          <div className="bg-stone-100/70 backdrop-blur-[3px] rounded-4xl shadow-md border-1 border-stone-200 w-70 p-6">
            <p className="mt-3 flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5 text-blue-600" />
              Michele Famoso
            </p>
            <p className="mt-3 flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 text-red-500" />
              michelefamoso@gmail.com
            </p>
          </div>
        </div>
      )}
      {activePanel === "sede" && (
        <div className="absolute right-22 top-20 z-10">
          <div className="bg-stone-100/70 backdrop-blur-[3px] rounded-4xl shadow-md border-1 border-stone-200 w-55 p-6">
            <p className="mt-3 flex items-center gap-2 mb-2">
              <MapPinIcon className="h-5 w-5 text-green-600" />
              Sviluppato a Milano
            </p>
          </div>
        </div>
      )}
      <div className="ml-20 flex flex-col  ">
        <h1 className="font-[Unna] text-[200px] -mt-10 ">d/haccp</h1>
        <p className="text-4xl font-[Unna] ml-15 -mt-15">
          Digital HACCP Management
        </p>
      </div>
      <div className="bg-stone-100/70 backdrop-blur-sm p-6 rounded-4xl shadow-md w-90 border-1 border-stone-200 flex ml-45   mt-10  ">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl   mb-4 text-center">Login</h2>
          {error && (
            <p className="text-red-500 text-sm mb-2 text-center animate-fade-in">
              {error}
            </p>
          )}
          <input
            placeholder="UserName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full mb-3   p-2   border-b focus:border-amber-800 focus:outline-hidden "
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border-b  focus:border-amber-800 focus:outline-hidden"
          />
          <div className="flex justify-around mt-3 mb-3">
            <button
              onClick={() => navigate("/")}
              className="w-25 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-4xl hover:bg-red-500/80 border-1 border-stone-200 hover:border-red-300"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="w-25 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-4xl hover:bg-lime-400/60 border-1 border-stone-200 hover:border-lime-300"
            >
              Accedi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Login
