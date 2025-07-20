import SideBar from "./SideBar"
import { useState, useEffect } from "react"
const Utenti = () => {
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

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [utenteToDelete, setUtenteToDelete] = useState(null)

  const getUtenti = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.warn("Nessun token trovato, fetch annullata.")
      setError("Nessun token trovato, impossibile caricare gli utenti.")
      return
    }
    setLoading(true)
    setError(null)
    fetch("http://localhost:8080/admin", {
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
        console.log("Aziende ricevute:", data)
        setUtenti(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Errore nella fetch utenti:", error)
        setError("Errore nel caricamento degli utenti.")
        setLoading(false)
      })
  }
  useEffect(() => {
    getUtenti()
  }, [])

  const creaUtente = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Token mancante, impossibile creare l'utente.")
      return
    }

    fetch("http://localhost:8080/admin", {
      method: "POST",
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
        if (!res.ok) throw new Error("Errore nella creazione dell'utente.")
        return res.json()
      })
      .then(() => {
        setShowForm(false)
        getUtenti()
      })
      .catch((err) => {
        console.error(err)
        setError("Errore durante la creazione dell'utente.")
      })
  }

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
        getUtenti()
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
            Dipendenti
          </h1>
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
          {!loading && !error && utenti.length === 0 && !showForm && (
            <div className="flex flex-col items-center text-center w-full py-10 gap-4">
              <p className="text-xl">Nessun utente disponibile.</p>
              <button
                className="w-60 mt-4  bg-salvia hover:bg-salviaScuro text-salviaChiaro py-1 px-4 rounded-2xl border-salviaScuro border-1 text-shadow-md "
                onClick={() => setShowForm(true)}
              >
                Aggiungi utente
              </button>
            </div>
          )}
          {!loading && !error && showForm && (
            <div className="md:w-200 w-80 mt-4 m-auto p-6 rounded-2xl bg-salviaChiaro border-1 border-salvia shadow-md shadow-salvia">
              <h2 className="text-2xl font-bold text-center mb-6">
                {idUtente ? "Modifica utente" : "Crea utente"}
              </h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault()

                  if (idUtente) {
                    modificaUtente()
                  } else {
                    creaUtente()
                  }
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
                    {idUtente ? "Salva modifiche" : "Crea utente"}
                  </button>
                </div>
              </form>
            </div>
          )}
          {!loading && !error && !showForm && utenti.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-start">
                <button
                  className=" self-start bg-salvia hover:bg-ambra text-avorio py-1 px-4 rounded-2xl mt-4 border-salviaScuro border-1 text-shadow-md mb-2"
                  onClick={() => {
                    setNome("")
                    setCognome("")
                    setUsername("")
                    setEmail("")
                    setpassword("")
                    setIdUtente(null)
                    setShowForm(true)
                  }}
                >
                  Aggiungi
                </button>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
                {utenti.map((utente) => (
                  <div
                    key={utente.id}
                    className="relative  flex flex-col  bg-salviaChiaro p-4 rounded-2xl shadow-salvia shadow-lg border-1 border-salvia  w-80 md:w-110  xl:w-110 2xl:w-160 mb-6"
                  >
                    <button
                      onClick={() => {
                        setUtenteToDelete(utente)
                        setShowDeleteModal(true)
                      }}
                      className="absolute -top-4 right-1  w-8 h-8 bg-gray-200 border-1 border-salvia text-neutral-800  rounded-full hover:bg-rosso hover:text-white shadow-md text-center "
                      title="Elimina utente"
                    >
                      x
                    </button>
                    <div className="flex items-center gap-4">
                      <img
                        className="w-30 h-30 object-cover rounded-full border-1 border-salvia hidden  md:inline-flex"
                        src="/public/IMG_6352.PNG"
                        alt="user-placeholder"
                      />
                      <div className="flex flex-col ml-5">
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
                      className="mt-4 self-end bg-salvia hover:bg-salviaScuro text-salviaChiaro py-1 px-4 rounded-2xl border-salviaScuro border-1 text-shadow-md"
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-neutral-400/50 bg-opacity-30 flex items-center justify-center  ">
          <div className="bg-salviaChiaro rounded-2xl border-1 border-salviaScuro p-6 w-100 shadow-lg shadow-salvia text-center ">
            <h2 className="text-xl  mb-4">Conferma eliminazione</h2>
            <p>
              Sei sicuro di voler eliminare&nbsp;
              <span className="font-bold">
                {utenteToDelete?.cognome} &nbsp;{utenteToDelete?.nome}
              </span>
              ?
            </p>
            <div className="mt-6 flex justify-around gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-1 border-1 border-salvia rounded-2xl bg-gray-300 hover:bg-gray-400"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  const token = localStorage.getItem("token")
                  fetch(`http://localhost:8080/admin/${utenteToDelete.id}`, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                    .then((res) => {
                      if (!res.ok)
                        throw new Error("Errore durante l'eliminazione")
                      getUtenti()
                      setShowDeleteModal(false)
                    })
                    .catch((err) => {
                      console.error(err)
                      setShowDeleteModal(false)
                    })
                }}
                className="px-4 py-1 rounded-2xl bg-rosso text-white hover:bg-red-500 border-1 border-red-200"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Utenti
