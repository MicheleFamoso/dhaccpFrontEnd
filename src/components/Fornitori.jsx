import SideBar from "./SideBar"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

const Fornitori = () => {
  const [fornitori, setFornitori] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [nomeFornitore, setNomeFornitore] = useState("")
  const [sede, setSede] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")
  const [prodottiForniti, setProdottiForniti] = useState([])

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [FornitoreToDelete, setFornitoreToDelete] = useState(null)
  const [idUtente, setIdUtente] = useState(null)

  const [query, setQuery] = useState("")
  const [risultatiRicerca, setRisultatiRicerca] = useState(null)

  const token = localStorage.getItem("token")
  let ruolo = null
  try {
    ruolo = token ? jwtDecode(token).role : null
  } catch (err) {
    console.error("Errore decodifica token:", err)
  }
  const isAdmin = ruolo === "ADMIN"

  const getFornitori = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.warn("Nessun token trovato, fetch annullata.")
      setError("Nessun token trovato, impossibile caricare i Fornitori.")
      return
    }
    setLoading(true)
    setError(null)
    fetch("http://localhost:8080/fornitori/all", {
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
        console.log("Fornitori ricevuti:", data)
        setFornitori(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Errore nella fetch fornitori:", error)
        setError("Errore nel caricamento dei fornitori.")
        setLoading(false)
      })
  }

  const handleSearch = () => {
    const token = localStorage.getItem("token")
    const url = `http://localhost:8080/fornitori/cerca?query=${encodeURIComponent(
      query.trim()
    )}`

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Token scaduto o non autorizzato.")
          } else {
            throw new Error("Errore nella ricerca fornitori")
          }
        }
        return res.json()
      })
      .then((data) => {
        setRisultatiRicerca(data)
      })
      .catch((err) => {
        console.error(err)
        setError("Errore nella ricerca dei fornitori.")
      })
  }

  useEffect(() => {
    getFornitori()
  }, [])

  const creaFornitore = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Token mancante, impossibile creare il fornitore.")
      return
    }

    fetch("http://localhost:8080/fornitori", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nomeFornitore,
        sede,
        telefono,
        email,
        prodottiForniti: prodottiForniti.split(",").map((p) => p.trim()),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nella creazione del fornitore.")
        return res.json()
      })
      .then(() => {
        setShowForm(false)
        getFornitori()
      })
      .catch((err) => {
        console.error(err)
        setError("Errore durante la creazione del fornitore.")
      })
  }

  const modificaFornitore = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Token mancante, impossibile creare il fornitore.")
      return
    }

    fetch(`http://localhost:8080/fornitori/${idUtente}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nomeFornitore,
        sede,
        telefono,
        email,
        prodottiForniti: prodottiForniti.split(",").map((p) => p.trim()),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nella creazione del fornitore.")
        return res.json()
      })
      .then(() => {
        setShowForm(false)
        getFornitori()
      })
      .catch((err) => {
        console.error(err)
        setError("Errore durante la creazione del fornitore.")
      })
  }

  return (
    <div className="flex h-screen bg-gray-100 ">
      <div>
        <SideBar />
      </div>

      <div className="flex-1 mt-10 justify-items-center justify-center p-6">
        <div className=" w-250">
          {loading && (
            <p className="text-xl text-center w-full py-10">
              Caricamento in corso...
            </p>
          )}
          {error && (
            <p className="text-xl  text-center w-full py-10 text-red-600">
              {error}
            </p>
          )}
          {!loading &&
            !error &&
            fornitori.length === 0 &&
            !showForm &&
            isAdmin && (
              <div className="flex flex-col items-center text-center w-full py-10 gap-4">
                <p className="text-xl">Nessun Fornitore disponibile.</p>
                <button
                  className="w-60 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded"
                  onClick={() => setShowForm(true)}
                >
                  Aggiungi Fornitore
                </button>
              </div>
            )}
          {!loading && !error && showForm && (
            <div className="w-full p-6">
              <h2 className="text-2xl font-bold text-center mb-6">
                {idUtente ? "Modifica fornitore" : "Crea fornitore"}
              </h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault()

                  if (idUtente) {
                    modificaFornitore()
                  } else {
                    creaFornitore()
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Nome fornitore"
                  value={nomeFornitore}
                  onChange={(e) => setNomeFornitore(e.target.value)}
                  className="w-full p-2 border-b focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Sede"
                  value={sede}
                  onChange={(e) => setSede(e.target.value)}
                  className="w-full p-2 border-b focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full p-2 border-b focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border-b focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Prodotti forniti"
                  value={prodottiForniti}
                  onChange={(e) => setProdottiForniti(e.target.value)}
                  className="w-full p-2 border-b focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="w-60 self-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 hover:shadow-md hover:shadow-blue-500/50"
                >
                  {idUtente ? "Salva modifiche" : "Crea Fornitore"}
                </button>
                <button
                  type="button"
                  className="w-60 self-center bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 mt-2"
                  onClick={() => setShowForm(false)}
                >
                  Annulla
                </button>
              </form>
            </div>
          )}
          {!loading && !error && !showForm && (
            <div className="mb-4 flex gap-2 items-center justify-items-center justify-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca fornitori per nome o prodotto"
                className="px-3 py-1 bg-white border border-gray-300 rounded-2xl w-150 shadow-sm mb-6 focus:outline-hidden focus:shadow-blue-300 focus:shadow-md"
              />
              <button
                onClick={handleSearch}
                className="px-2 py-1 bg-blue-400 text-white  hover:bg-blue-600 mb-6 rounded-2xl m"
              >
                Cerca
              </button>
            </div>
          )}
          {!loading && !error && !showForm && fornitori.length > 0 && (
            <div className="flex flex-col gap-4">
              {isAdmin && (
                <div className="flex justify-end">
                  <button
                    className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded-sm"
                    onClick={() => {
                      setNomeFornitore("")
                      setSede("")
                      setTelefono("")
                      setEmail("")
                      setProdottiForniti("")
                      setIdUtente(null)
                      setShowForm(true)
                    }}
                  >
                    Aggiungi Fornitore
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                {(risultatiRicerca || fornitori).map((fornitore) => (
                  <div
                    key={fornitore.id}
                    className="relative bg-gray-50 p-4 rounded-xs shadow-lg border-1 border-gray-200 flex flex-col"
                  >
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setFornitoreToDelete(fornitore)
                          setShowDeleteModal(true)
                        }}
                        className="absolute -top-4 right-1  w-8 h-8 bg-gray-200 border-1 border-gray-200 text-neutral-800  rounded-full hover:bg-red-400 hover:text-white shadow-md text-center "
                        title="Elimina fornitore"
                      >
                        x
                      </button>
                    )}
                    <div className="flex items-center gap-4">
                      <img
                        className="w-30 h-30 bg-purple-300 rounded-full border-1 border-gray-200  object-cover   drop-shadow-xl "
                        src="/public/20.png"
                        alt="user-placeholder"
                      />
                      <div className="flex flex-col ml-5">
                        <p className="text-2xl font-semibold mb-2">
                          {fornitore.nomeFornitore}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Sede:
                          {fornitore.sede}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Email: {fornitore.email}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Telefono: {fornitore.telefono}
                        </p>
                      </div>
                    </div>

                    <div className="text-center mt-5 p-5">
                      <hr className=" border-t border-stone-300 mb-2" />
                      <p>Prodotti:</p>
                      <p className="text-sm text-gray-600 px-10">
                        {fornitore.prodottiForniti.join(" • ")}
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        className="mt-4 self-end bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded-sm"
                        onClick={() => {
                          setNomeFornitore(fornitore.nomeFornitore)
                          setSede(fornitore.sede)
                          setEmail(fornitore.email)
                          setTelefono(fornitore.telefono)
                          setProdottiForniti(
                            fornitore.prodottiForniti.join(", ")
                          )
                          setIdUtente(fornitore.id)
                          setShowForm(true)
                        }}
                      >
                        Modifica
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-neutral-400/50 bg-opacity-30 flex items-center justify-center  ">
          <div className="bg-white rounded-sm p-6 w-100 shadow-lg ">
            <h2 className="text-xl  mb-4">Conferma eliminazione</h2>
            <p>
              Sei sicuro di voler eliminare&nbsp;
              <span className="font-bold">
                {FornitoreToDelete?.nomeFornitore}
              </span>
              ?
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-sm bg-gray-300 hover:bg-gray-400"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  const token = localStorage.getItem("token")
                  fetch(
                    `http://localhost:8080/fornitori/${FornitoreToDelete.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                    .then((res) => {
                      if (!res.ok)
                        throw new Error("Errore durante l'eliminazione")
                      getFornitori()
                      setShowDeleteModal(false)
                    })
                    .catch((err) => {
                      console.error(err)
                      setShowDeleteModal(false)
                    })
                }}
                className="px-2 py-1 rounded-sm bg-red-400 text-white hover:bg-red-500 hover:shadow-md hover:shadow-red-500/50"
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

export default Fornitori
