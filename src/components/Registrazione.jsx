import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import NavbarHome from "./NavbarHome"

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
    <div className=" bg-[url('/data.svg')] w-screen h-screen bg-no-repeat bg-[position:right_bottom] bg-[length:700px_700px] ">
      <div className="ml-20 flex flex-col  ">
        <div className="relative z-50">
          <NavbarHome />
        </div>
        <h1 className="font-[Unna] text-[180px] -mt-20 ">
          d<span className="text-blue-500">/</span>haccp
        </h1>
        <p className="text-4xl font-[Unna] ml-12 -mt-18">
          Digital HACCP Management
        </p>
      </div>
      <div className="bg-stone-100/70 backdrop-blur-sm p-6 rounded-sm shadow-md w-90 border-1 border-stone-200 flex ml-45  mt-10 ">
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
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full mb-3   p-2   border-b focus:border-blue-500 focus:border-b-2 focus:outline-hidden "
          />
          <input
            placeholder="Cognome"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            className="w-full mb-3   p-2   border-b focus:border-blue-500 focus:border-b-2 focus:outline-hidden "
          />
          <input
            placeholder="UserName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full mb-3   p-2   border-b focus:border-blue-500 focus:border-b-2 focus:outline-hidden "
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3   p-2   border-b focus:border-blue-500 focus:border-b-2 focus:outline-hidden "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border-b focus:border-blue-500 focus:border-b-2 focus:outline-hidden"
          />
          <div className="flex justify-around mt-3 mb-3">
            <button
              onClick={() => navigate("/")}
              className="w-25 bg-gray-200  text-gray-800 py-2 rounded hover:bg-red-400/60"
              type="button"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="w-25 bg-gray-200  text-gray-800 py-2 rounded hover:bg-lime-400/60"
            >
              Registrati
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Registrazione
