import SideBar from "./SideBar"
import { useState, useEffect } from "react"
import SidebMobile from "./SidebMobile"
import {
  PencilIcon,
  AdjustmentsHorizontalIcon,
  EyeSlashIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
const Utenti = () => {
  const [utenti, setUtenti] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [modifica, setModifica] = useState(false)

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
          <SidebMobile></SidebMobile>
          <button
            onClick={() => setModifica((prev) => !prev)}
            className={`px-4 py-1   border border-salviaScuro shadow-md text-shadow-md   rounded-3xl text-white font-semibold  hidden  md:inline-flex transition-colors ${
              modifica
                ? "bg-rosso hover:bg-rosso/80"
                : "bg-salvia hover:bg-salviaScuro"
            }`}
          >
            {modifica ? (
              <EyeSlashIcon className="w-6 h-6" />
            ) : (
              <AdjustmentsHorizontalIcon className="w-6 h-6" />
            )}{" "}
          </button>
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
                <div className="relative mt-6">
                  <input
                    id="nome"
                    type="text"
                    placeholder=""
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <label
                    htmlFor="nome"
                    className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                  >
                    Nome
                  </label>
                </div>
                <div className="relative mt-6">
                  <input
                    id="cognome"
                    type="text"
                    placeholder=""
                    value={cognome}
                    onChange={(e) => setCognome(e.target.value)}
                    className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <label
                    htmlFor="Cognome"
                    className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                  >
                    Cognome
                  </label>
                </div>
                <div className="relative mt-6">
                  <input
                    id="username"
                    type="text"
                    placeholder=""
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
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
                    id="email"
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
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
                    onChange={(e) => setpassword(e.target.value)}
                    className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <label
                    htmlFor="password"
                    className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                  >
                    Password
                  </label>
                </div>

                <div className="flex justify-around mt-2">
                  <button
                    type="button"
                    className="md:w-60 w-40 mr-2 px-2 py-1 bg-salvia/60 border-1 border-salviaScuro shadow-md text-white  hover:bg-rosso mb-6 rounded-2xl"
                    onClick={() => setShowForm(false)}
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="w-60  px-2 py-1 bg-salvia border-1 border-salviaScuro shadow-md text-white  hover:bg-ambra mb-6 rounded-2xl hover:text-black"
                  >
                    {idUtente ? "Salva modifiche" : "Crea utente"}
                  </button>
                </div>
              </form>
            </div>
          )}
          {!loading && !error && !showForm && utenti.length > 0 && (
            <div className="flex flex-col gap-4">
              {modifica && (
                <div className="flex justify-end">
                  <button
                    className="  bg-salvia hover:bg-ambra text-avorio py-1 px-4 rounded-2xl mt-4 border-salviaScuro border-1 text-shadow-md mb-2 hover:text-black"
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
                  </button>{" "}
                </div>
              )}

              <div className="grid md:grid-cols-2 grid-cols-1  gap-4 mt-8">
                {utenti.map((utente) => (
                  <div
                    key={utente.id}
                    className="relative  flex flex-col  bg-salviaChiaro p-4 rounded-2xl shadow-salvia shadow-lg border-1 border-salvia  w-80 md:w-110  xl:w-110 2xl:w-140 mb-6 md:pb-10 pb-4"
                  >
                    {modifica && (
                      <div className="flex justify-end gap-4 ">
                        <button
                          className="text-gray-100 text-shadow-lg w-fit flex items-center justify-center rounded-3xl bg-salvia/40 hover:text-black hover:bg-ambra px-4 py-1 transition-transform hover:scale-105"
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
                          <PencilIcon className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => {
                            setUtenteToDelete(utente)
                            setShowDeleteModal(true)
                          }}
                          className="text-gray-100 text-shadow-lg flex items-center justify-center  rounded-2xl bg-salvia/40 hover:bg-rosso px-4 py-1 transition-transform hover:scale-105"
                          title="Elimina fornitore md:hidden"
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      </div>
                    )}

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
                    <div className="flex justify-between mt-4 md:hidden ">
                      <button
                        className="text-gray-100 hover:text-black text-shadow-lg w-fit flex items-center justify-center rounded-3xl bg-salvia/40 hover:bg-ambra px-4 py-1 transition-transform hover:scale-105"
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
                        <PencilIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => {
                          setUtenteToDelete(utente)
                          setShowDeleteModal(true)
                        }}
                        className="text-gray-100 text-shadow-lg flex items-center justify-center  rounded-2xl bg-salvia/40 hover:bg-rosso px-4 py-1 transition-transform hover:scale-105"
                        title="Elimina fornitore md:hidden"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
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
