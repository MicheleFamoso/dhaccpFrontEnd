import SideBar from "./SideBar"
import { useState, useEffect } from "react"
import SidebMobile from "./SidebMobile"

const Profilo = () => {
  const [utenti, setUtenti] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [nome, setNome] = useState("")
  const [cognome, setCognome] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")

  const [idUtente, setIdUtente] = useState(null)

  const getProfilo = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.warn("Nessun token trovato, fetch annullata.")
      setError("Nessun token trovato, impossibile caricare il profilo.")
      return
    }
    setLoading(true)
    setError(null)
    fetch("http://localhost:8080/admin/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Errore nella risposta: ${res.statusText}`)
        }
        return res.json()
      })
      .then((data) => {
        setUtenti([data])
        setIdUtente(data.id)
        setNome(data.nome)
        setCognome(data.cognome)
        setUsername(data.username)
        setEmail(data.email)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Errore nella fetch profilo:", error)
        setError("Errore nel caricamento del profilo.")
        setLoading(false)
      })
  }
  useEffect(() => {
    getProfilo()
  }, [])

  const modificaUtente = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Token mancante, impossibile modificare l'azienda.")
      return
    }

    fetch(`http://localhost:8080/admin/${idUtente}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        cognome,
        username,
        email,
        password,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nella modifica dell'utente.")
        return res.json()
      })
      .then(() => {
        setShowForm(false)
        getProfilo()
      })
      .catch((err) => {
        console.error(err)
        setError("Errore durante la modifica dell utente.")
      })
  }

  return (
    <div className="flex h-screen bg-beige">
      <div>
        <SideBar />
      </div>
      <div className="flex-1 justify-items-center justify-center overflow-auto">
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-20 py-2 bg-salviaChiaro/80 sticky top-0 left-0 z-50 backdrop-blur-sm shadow-xs shadow-salvia inset-shadow-sm inset-shadow-salvia/50">
          <h1 className="lg:text-6xl text-2xl font-[Unna] text-salviaScuro text-shadow-xs mb-2 md:mb-0">
            Profilo
          </h1>
          <SidebMobile></SidebMobile>
        </div>
        <div>
          {loading && (
            <p className="text-xl text-center w-full py-10">
              Caricamento in corso...
            </p>
          )}
          {error && (
            <p className="text-xl  text-center w-full py-10 text-rosso">
              {error}
            </p>
          )}

          {!loading && !error && showForm && (
            <div className="md:w-200 w-80 mt-4 m-auto p-6 rounded-2xl bg-salviaChiaro border-1 border-salvia shadow-md shadow-salvia">
              <h2 className="text-2xl font-bold text-center mb-6">Modifica</h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault()

                  modificaUtente()
                }}
              >
                <input
                  type="text"
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full p-2 text-gray-500 border-b focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  required
                />
                <input
                  type="text"
                  placeholder="Cognome"
                  value={cognome}
                  onChange={(e) => setCognome(e.target.value)}
                  className="w-full p-2 text-gray-500 border-b focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  required
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 text-gray-500 border-b focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 text-gray-500 border-b focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="w-full p-2 text-gray-500 border-b focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  required
                />
                <div className="flex justify-around mt-2">
                  <button
                    type="button"
                    className="md:w-60 w-40 mr-2 px-2 py-1 bg-grigio border-1 border-salviaScuro shadow-md text-white  hover:bg-rosso mb-6 rounded-2xl"
                    onClick={() => setShowForm(false)}
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="w-60  px-2 py-1 bg-salvia border-1 border-salviaScuro shadow-md text-white  hover:bg-ambra mb-6 rounded-2xl"
                  >
                    Salva modifiche
                  </button>
                </div>
              </form>
            </div>
          )}
          {!loading && !error && !showForm && utenti.length > 0 && (
            <div className="flex flex-col gap-4 mt-6">
              <div className="grid  grid-cols-1  gap-4">
                {utenti.map((utente) => (
                  <div
                    key={utente.id}
                    className="relative  flex flex-col  bg-salviaChiaro p-4 rounded-2xl shadow-salvia shadow-lg border-1 border-salvia  w-80 md:w-110  xl:w-110 2xl:w-140 mb-6"
                  >
                    <div className="flex items-center gap-4 justify-center md:justify-normal">
                      <img
                        className="w-30 h-30 object-cover rounded-full border-1 border-salvia hidden  md:inline-flex"
                        src="/public/IMG_6352.PNG"
                        alt="user-placeholder"
                      />
                      <div className="flex flex-col md:ml-5 ml-0 text-center md:text-start">
                        <p className="text-xl font-bold text-salviaScuro text-shadow-xs mt-1.5">
                          {utente.nome} {utente.cognome}
                        </p>
                        <p className=" text-gray-800 mb-1 mt-2">
                          <span className="font-semibold">Username:</span>{" "}
                          {utente.username}
                        </p>
                        <p className=" text-gray-800 mb-1">
                          <span className="font-semibold">Email:</span>{" "}
                          {utente.email}
                        </p>
                        <p className=" text-gray-800 mb-1">
                          <span className="font-semibold">Ruolo:</span>{" "}
                          {utente.role}
                        </p>
                        <p className=" text-gray-800">
                          <span className="font-semibold">Azienda:</span>{" "}
                          {utente.azienda.denominazioneAziendale}
                        </p>
                      </div>
                    </div>
                    <button
                      className="mt-4 md:self-end self-center bg-salvia hover:bg-salviaScuro text-salviaChiaro py-1 px-4 rounded-2xl border-salviaScuro border-1 text-shadow-md"
                      onClick={() => {
                        setNome(utente.nome)
                        setCognome(utente.cognome)
                        setUsername(utente.username)
                        setEmail(utente.email)
                        setpassword("")
                        setIdUtente(utente.id)
                        setShowForm(true)
                      }}
                    >
                      Modifica
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Profilo
