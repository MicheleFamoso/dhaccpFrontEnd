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
    <div className="flex h-screen bg-beige ">
      <div>
        <SideBar />
      </div>

      <div className="flex-1 justify-items-center justify-center overflow-auto">
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-20 py-2 bg-salviaChiaro/80 sticky top-0 left-0 z-50 backdrop-blur-sm shadow-xs shadow-salvia inset-shadow-sm inset-shadow-salvia/50">
          <h1 className="lg:text-6xl text-2xl font-[Unna] text-salviaScuro text-shadow-xs mb-2 md:mb-0">
            Fornitori
          </h1>
          {!loading && !error && !showForm && (
            <div className=" flex justify-center gap-2 w-full md:w-auto mb-2 md:mb-0">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca fornitori per nome o prodotto"
                className="px-3 py-1 bg-avorio border border-salvia rounded-2xl lg:w-130 md:120 shadow-sm focus:outline-hidden focus:shadow-salvia focus:shadow-md"
              />
              <button
                onClick={handleSearch}
                className="px-2 py-1 bg-salvia border-1 border-salviaScuro shadow-md text-white  hover:bg-ambra  rounded-2xl "
              >
                Cerca
              </button>
            </div>
          )}
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
          {!loading &&
            !error &&
            fornitori.length === 0 &&
            !showForm &&
            isAdmin && (
              <div className="flex flex-col items-center text-center w-full py-10 gap-4">
                <p className="text-xl">Nessun Fornitore disponibile.</p>
                <button
                  className="px-2 py-1 bg-salvia border-1 border-salviaScuro shadow-md text-white  hover:bg-ambra mb-6 rounded-2xl "
                  onClick={() => setShowForm(true)}
                >
                  Aggiungi Fornitore
                </button>
              </div>
            )}
          {!loading && !error && showForm && (
            <div className="md:w-200 w-80 m-auto p-6 rounded-2xl bg-salviaChiaro border-1 border-salvia shadow-md shadow-salvia mt-4">
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
                  className="w-full p-2 text-gray-500 border-b focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  required
                />
                <input
                  type="text"
                  placeholder="Sede"
                  value={sede}
                  onChange={(e) => setSede(e.target.value)}
                  className="w-full p-2 text-gray-500 border-b focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  required
                />
                <input
                  type="text"
                  placeholder="Telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
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
                  type="text"
                  placeholder="Prodotti forniti"
                  value={prodottiForniti}
                  onChange={(e) => setProdottiForniti(e.target.value)}
                  className="w-full p-2 text-gray-500 border-b focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  required
                />
                <div className="flex justify-around ">
                  <button
                    type="button"
                    className=" w-30 px-2 py-1 bg-grigio border-1 border-salviaScuro shadow-md text-white  hover:bg-rosso mb-6 rounded-2xl mr-2"
                    onClick={() => setShowForm(false)}
                  >
                    Annulla
                  </button>{" "}
                  <button
                    type="submit"
                    className="w-60   px-2 py-1 bg-salvia border-1 border-salviaScuro shadow-md text-white  hover:bg-ambra mb-6 rounded-2xl"
                  >
                    {idUtente ? "Salva" : "Crea Fornitore"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!loading && !error && !showForm && fornitori.length > 0 && (
            <div className="flex flex-col gap-4 mt-4 justify-center justify-items-center">
              {isAdmin && (
                <div className="flex justify-start">
                  <button
                    className="px-2 py-1 bg-salvia border-1 border-salviaScuro shadow-md text-white  hover:bg-ambra mb-6 rounded-2xl"
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
                    Aggiungi
                  </button>
                </div>
              )}
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3  ">
                {(risultatiRicerca || fornitori).map((fornitore) => (
                  <div
                    key={fornitore.id}
                    className="relative bg-salviaChiaro p-2  rounded-2xl shadow-salvia shadow-lg border-1 border-salvia flex flex-col  w-80 md:w-110 lg:w-120 xl:w-130 2xl:w-160 mb-6"
                  >
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setFornitoreToDelete(fornitore)
                          setShowDeleteModal(true)
                        }}
                        className="absolute -top-4 right-1  w-8 h-8 bg-avorio border-1 border-salvia text-neutral-800  rounded-full hover:bg-rosso hover:text-white shadow-md shadow-salvia text-center "
                        title="Elimina fornitore"
                      >
                        x
                      </button>
                    )}
                    <div className="md:flex md:items-center md:gap-4  ">
                      <div className="flex flex-col md:ml-5 ml-2 text-center md:text-start ">
                        <p className="text-2xl font-semibold mb-2 text-salviaScuro text-shadow-xs ">
                          {fornitore.nomeFornitore}
                        </p>
                        <p className=" text-gray-700 mb-2 font-semibold ">
                          Sede:
                          <span className=" font-normal ">
                            {" "}
                            {fornitore.sede}
                          </span>
                        </p>
                        <p className=" text-gray-700 mb-2 font-semibold">
                          Email:
                          <span className=" font-normal">
                            {" "}
                            {fornitore.email}
                          </span>
                        </p>
                        <p className=" text-gray-700 mb-2 font-semibold">
                          Telefono:
                          <span className=" font-normal">
                            {" "}
                            {fornitore.telefono}
                          </span>
                        </p>
                      </div>
                      <img
                        className="w-26  h-26 bg-salvia/70 rounded-full border-1 border-salviaScuro  object-cover   drop-shadow-xl shadow-salvia self-auto ml-auto mr-7 hidden  md:inline-flex "
                        src="/public/20.png"
                        alt="user-placeholder"
                      />
                    </div>
                    <hr className="my-3 border-t border-salviaScuro" />
                    <div className="text-center  py-2  ">
                      <p className="font-semibold mb-2">Prodotti:</p>

                      <p className=" text-gray-600 px-10 ">
                        {fornitore.prodottiForniti.join(" • ")}
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        className="mt-4 self-end bg-salvia hover:bg-salviaScuro text-salviaChiaro py-1 px-4 rounded-2xl border-salviaScuro border-1 text-shadow-md"
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
