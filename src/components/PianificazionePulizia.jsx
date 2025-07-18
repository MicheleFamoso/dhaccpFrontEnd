import SideBar from "./SideBar"
import { useState, useEffect } from "react"

import { PencilSquareIcon, CheckIcon } from "@heroicons/react/24/outline"
const PianificazionePulizia = () => {
  const [pulizie, setPulizie] = useState([])

  const [error, setError] = useState(null)
  const [nuovaPulizia, setNuovaPulizia] = useState({
    oggetto: "",
    detergente: "",
    attrezzatureUtilizzate: "",
    frequenza: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [puliziaModificata, setPuliziaModificata] = useState({})

  const [query, setQuery] = useState("")
  const [risultatiRicerca, setRisultatiRicerca] = useState(null)

  const getPulizie = () => {
    const token = localStorage.getItem("token")
    console.log("Token:", token)
    if (!token) {
      console.warn("Nessun token trovato, fetch annullata.")
      setError("Nessun token trovato, impossibile caricare le pulizie.")
      return
    }

    setError(null)

    fetch("http://localhost:8080/pulizie", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Token scaduto o non autorizzato.")
          } else {
            throw new Error(`Errore nella risposta: ${res.statusText}`)
          }
        }
        return res.json()
      })
      .then((data) => {
        console.log("Pulizie ricevute:", data)
        setPulizie(data)
      })
      .catch((error) => {
        console.log("Errore nella fetch pulizie:", error)
        setError(error.message || "Errore nel caricamento delle pulizie.")
      })
  }
  useEffect(() => {
    getPulizie()
  }, [])

  const handleSearch = () => {
    const token = localStorage.getItem("token")
    const url = `http://localhost:8080/pulizie/cerca?query=${encodeURIComponent(
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
            throw new Error("Errore nella ricerca")
          }
        }
        return res.json()
      })
      .then((data) => {
        setRisultatiRicerca(data)
        console.log("Risultati ricerca:", data)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
      })
  }

  const handleAddPulizia = () => {
    const token = localStorage.getItem("token")
    fetch("http://localhost:8080/pulizie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuovaPulizia),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Token scaduto o non autorizzato.")
          } else {
            throw new Error("Errore durante l'aggiunta")
          }
        }
        return res.json()
      })
      .then(() => {
        getPulizie()
        setNuovaPulizia({
          oggetto: "",
          detergente: "",
          attrezzatureUtilizzate: "",
          frequenza: "",
        })
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
      })
  }

  return (
    <div className="flex h-screen bg-beige">
      <div>
        <SideBar />
      </div>
      <div className="flex-1  justify-items-center justify-center overflow-auto">
        <div className="mx-auto flex bg-salviaChiaro/80  pt-6 pb-3 mb-6 sticky left-0 top-0 backdrop-blur-sm shadow-xs shadow-salvia inset-shadow-sm inset-shadow-salvia/50">
          <h1 className="text-6xl ml-12 mb-2 font-[Unna] text-salviaScuro text-shadow-xs">
            Pulizie
          </h1>
          <div className=" flex gap-2 items-center justify-center ml-30">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca per oggetto, frequenza o altro"
              className="px-3 py-1 bg-avorio border border-salvia rounded-2xl w-150 shadow-sm focus:outline-hidden focus:shadow-salvia focus:shadow-md"
            />
            <button
              onClick={handleSearch}
              className="px-2 py-1 bg-salvia border-1 border-salviaScuro shadow-md text-white  hover:bg-ambra  rounded-2xl "
            >
              Cerca
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-center text-rosso font-medium">{error}</div>
        )}
        <table className="w-250 border-collapse bg-salviaChiaro shadow-md rounded-2xl shadow-salviaScuro mb-10">
          <thead>
            <tr>
              <th className=" rounded-tl-2xl px-6 py-3 bg-salvia text-shadow-lg text-gray-200">
                Oggetto
              </th>
              <th className=" px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                Detergente
              </th>
              <th className=" px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                Attrezzature utilizzate
              </th>
              <th className=" px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                Frequenza
              </th>
              <th className=" px-6 py-3 bg-salvia rounded-tr-2xl"></th>
            </tr>
          </thead>
          <tbody>
            {(risultatiRicerca || pulizie).map((pulizia) => (
              <tr key={pulizia.id}>
                <td className="border-b border-salvia py-3 text-center">
                  {editingId === pulizia.id ? (
                    <input
                      type="text"
                      value={puliziaModificata.oggetto}
                      onChange={(e) =>
                        setPuliziaModificata({
                          ...puliziaModificata,
                          oggetto: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    />
                  ) : (
                    pulizia.oggetto
                  )}
                </td>
                <td className="border-b border-salvia py-3 text-center bg-avorio">
                  {editingId === pulizia.id ? (
                    <input
                      type="text"
                      value={puliziaModificata.detergente}
                      onChange={(e) =>
                        setPuliziaModificata({
                          ...puliziaModificata,
                          detergente: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    />
                  ) : (
                    pulizia.detergente
                  )}
                </td>
                <td className="border-b border-salvia py-3 text-center">
                  {editingId === pulizia.id ? (
                    <input
                      type="text"
                      value={puliziaModificata.attrezzatureUtilizzate}
                      onChange={(e) =>
                        setPuliziaModificata({
                          ...puliziaModificata,
                          attrezzatureUtilizzate: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    />
                  ) : (
                    pulizia.attrezzatureUtilizzate
                  )}
                </td>
                <td className="border-b border-salvia py-3 text-center bg-avorio">
                  {editingId === pulizia.id ? (
                    <input
                      type="text"
                      value={puliziaModificata.frequenza}
                      onChange={(e) =>
                        setPuliziaModificata({
                          ...puliziaModificata,
                          frequenza: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    />
                  ) : (
                    pulizia.frequenza
                  )}
                </td>
                <td className="border-b border-salvia bg-avorio py-3 text-center px-3">
                  {editingId === pulizia.id ? (
                    <button
                      onClick={() => {
                        const token = localStorage.getItem("token")
                        fetch(`http://localhost:8080/pulizie/${pulizia.id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(puliziaModificata),
                        })
                          .then((res) => {
                            if (!res.ok) {
                              if (res.status === 401) {
                                throw new Error(
                                  "Token scaduto o non autorizzato."
                                )
                              } else {
                                throw new Error("Errore durante la modifica")
                              }
                            }
                            return res.json()
                          })
                          .then(() => {
                            getPulizie()
                            setEditingId(null)
                            setPuliziaModificata({})
                          })
                          .catch((err) => {
                            console.error(err)
                            setError(err.message)
                          })
                      }}
                      className="ml-2 text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-salvia hover:bg-salviaScuro py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110  "
                    >
                      salva
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(pulizia.id)
                        setPuliziaModificata({
                          oggetto: pulizia.oggetto,
                          detergente: pulizia.detergente,
                          attrezzatureUtilizzate:
                            pulizia.attrezzatureUtilizzate,
                          frequenza: pulizia.frequenza,
                        })
                      }}
                      className=" ml-2 text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-ambra/90 hover:bg-ambra py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110   "
                    >
                      modifica
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className=" px-2 py-4">
                <input
                  type="text"
                  value={nuovaPulizia.oggetto}
                  onChange={(e) =>
                    setNuovaPulizia({
                      ...nuovaPulizia,
                      oggetto: e.target.value,
                    })
                  }
                  className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  placeholder="Oggetto"
                />
              </td>
              <td className=" px-2 py-4 bg-avorio">
                <input
                  type="text"
                  value={nuovaPulizia.detergente}
                  onChange={(e) =>
                    setNuovaPulizia({
                      ...nuovaPulizia,
                      detergente: e.target.value,
                    })
                  }
                  className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden "
                  placeholder="Detergente"
                />
              </td>
              <td className=" px-2 py-4">
                <input
                  type="text"
                  value={nuovaPulizia.attrezzatureUtilizzate}
                  onChange={(e) =>
                    setNuovaPulizia({
                      ...nuovaPulizia,
                      attrezzatureUtilizzate: e.target.value,
                    })
                  }
                  className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  placeholder="Attrezzature"
                />
              </td>
              <td className=" px-2 py-4 bg-avorio flex justify-center">
                <input
                  type="text"
                  value={nuovaPulizia.frequenza}
                  onChange={(e) =>
                    setNuovaPulizia({
                      ...nuovaPulizia,
                      frequenza: e.target.value,
                    })
                  }
                  className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  placeholder="Frequenza"
                />
              </td>
              <td className="text-center px-4 py4 bg-avorio rounded-br-2xl ">
                <button
                  onClick={handleAddPulizia}
                  className="ml-1 text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-salvia hover:bg-salviaScuro py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110 "
                  title="Aggiungi"
                >
                  aggiungi
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default PianificazionePulizia
