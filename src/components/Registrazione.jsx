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
    <div className=" bg-[url('/12.png')] w-screen h-screen bg-no-repeat bg-[position:right_bottom] bg-[length:700px_700px] bg-beige overflow-auto 2xl:px-60 ">
      <div className="relative z-50">
        <NavbarHome />
        <div className="md:ml-20">
          <div className="flex flex-col items-center  md:w-fit md:self-start  ">
            <h1 className="font-[Unna] text-7xl 2xl:text-[180px] md:text-[140px]  mt-2 ">
              d<span className="text-salvia text-shadow-2xs">/</span>haccp
            </h1>
            <p className="md:text-4xl text-2xl font-[Unna]  ">
              Digital{" "}
              <span className="text-salvia text-shadow-2xs">HACCP </span>
              Management
            </p>
            <div className="bg-salviaChiaro/60  py-6 px-8 rounded-3xl shadow-md shadow-salvia w-fit border-1 border-salvia flex   mt-10 backdrop-blur-sm ">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Registrazione
