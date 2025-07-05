import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

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
        setError("")
      })
      .catch((error) => {
        console.error("Errore:", error.message)
        setError(error.message)
      })
  }

  return (
    <div className=" bg-[url('/4802922.webp')] min-h-screen bg-cover bg-center ">
      <div className="ml-10 flex flex-col  ">
        <h1 className="font-[Unna] text-[250px] mt-10 ">d/haccp</h1>
        <p className="text-5xl font-[Unna] ml-15 -mt-20">
          Digital HACCP Management
        </p>
      </div>
      <div className="bg-stone-100/70 backdrop-blur-sm p-6 rounded-4xl shadow-md w-90 border-1 border-stone-200 flex ml-50   mt-10  ">
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
              className="w-25 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-4xl hover:bg-red-500 border-1 border-stone-200 hover:border-red-300"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="w-25 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-4xl hover:bg-green-500 border-1 border-stone-200 hover:border-green-300"
            >
              Accedi
            </button>{" "}
          </div>
        </form>
      </div>
    </div>
  )
}
export default Login
