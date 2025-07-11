import SideBar from "./SideBar"
import { PencilSquareIcon, CheckIcon } from "@heroicons/react/24/outline"
import { useState, useEffect, useRef } from "react"
const Infestanti = () => {
  const [infestanti, SetInfestanti] = useState([])
  const [, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dataFiltro, setDataFiltro] = useState("")
  const [dataInizio, setDataInizio] = useState("")
  const [dataFine, setDataFine] = useState("")
  const [risultatiRicerca, setRisultatiRicerca] = useState(null)
  const [filtroConformita, setFiltroConformita] = useState("")

  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const resetFiltri = () => {
    setDataFiltro("")
    setDataInizio("")
    setDataFine("")
    setFiltroConformita("")
    setRisultatiRicerca(null)
    setShowFilterDropdown(false)
  }

  const getInfestanti = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.warn("Nessun token trovato, fetch annullata.")
      setError("Nessun token trovato, impossibile caricare gli infestanti.")
      return
    }
    setLoading(true)
    setError(null)
    fetch("http://localhost:8080/infestanti/all", {
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
        console.log("Infestanti ricevuti:", data)
        SetInfestanti(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Errore nella fetch infestanti:", error)
        setError("Errore nel caricamento degli infestanti.")
        setLoading(false)
      })
  }
  useEffect(() => {
    getInfestanti()
  }, [])
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.id !== "filter-button"
      ) {
        setShowFilterDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleFiltroData = () => {
    const token = localStorage.getItem("token")
    if (!dataFiltro) return
    fetch(`http://localhost:8080/infestanti/data?data=${dataFiltro}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRisultatiRicerca(data)
        setShowFilterDropdown(false)
      })
      .catch((err) => {
        console.error("Errore filtro data:", err)
        setError("Errore nel filtro per data.")
      })
  }

  const handleFiltroRange = () => {
    const token = localStorage.getItem("token")
    if (!dataInizio || !dataFine) return
    fetch(
      `http://localhost:8080/infestanti/range?start=${dataInizio}&end=${dataFine}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setRisultatiRicerca(data)
        setShowFilterDropdown(false)
      })
      .catch((err) => {
        console.error("Errore filtro intervallo:", err)
        setError("Errore nel filtro per intervallo date.")
      })
  }

  const [nuoviInfestanti, setNuoviInfestanti] = useState({
    data: "",
    roditori: "",
    insettiStriscianti: "",
    insettiVolanti: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [InfestantiModificata, setInfestantiModificata] = useState({})

  const handleSaveInfestante = (id) => {
    const token = localStorage.getItem("token")
    fetch(`http://localhost:8080/infestanti/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(InfestantiModificata),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante il salvataggio")
        return res.json()
      })
      .then(() => {
        getInfestanti()
        setEditingId(null)
        setInfestantiModificata({})
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
      })
  }

  const handleFiltroConformita = () => {
    const token = localStorage.getItem("token")
    if (!filtroConformita) return

    let url = ""
    if (filtroConformita === "CONFORME") {
      url = "http://localhost:8080/infestanti/conformi"
    } else if (filtroConformita === "NON_CONFORME") {
      url = "http://localhost:8080/infestanti/non_conformi"
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRisultatiRicerca(data)
        setShowFilterDropdown(false)
      })
      .catch((err) => {
        console.error("Errore filtro conformità:", err)
        setError("Errore nel filtro per conformità.")
      })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div>
        <SideBar />
      </div>
      <div className="flex-1 p-6 justify-items-center justify-center relative">
        <div className="mb-4 flex gap-2 items-center relative">
          <button
            id="filter-button"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-3 py-1 ml-150 bg-gray-200 text-gray-800 hover:bg-blue-200 rounded-4xl "
            type="button"
          >
            Filtri
          </button>

          {showFilterDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full mt-2 right-0 z-50 w-105 bg-white rounded-md shadow-2xl p-4 border border-gray-200"
            >
              <h2 className="text-lg font-semibold mb-3">Filtra infestanti</h2>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Data specifica
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dataFiltro}
                    onChange={(e) => setDataFiltro(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-4xl flex-grow"
                  />
                  <button
                    onClick={handleFiltroData}
                    className="px-3 py-1 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 text-sm"
                  >
                    Filtra
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Intervallo date
                </label>

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dataInizio}
                    onChange={(e) => setDataInizio(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-4xl flex-1"
                  />
                  <input
                    type="date"
                    value={dataFine}
                    onChange={(e) => setDataFine(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-4xl flex-1"
                  />
                  <button
                    onClick={handleFiltroRange}
                    className=" px-3 py-1 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 text-sm"
                  >
                    Applica
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Conformità
                </label>
                <div className="flex gap-2">
                  <select
                    value={filtroConformita}
                    onChange={(e) => setFiltroConformita(e.target.value)}
                    className="w-full p-2 py-1 border border-gray-300 rounded-4xl"
                  >
                    <option value="">Tutti</option>
                    <option value="CONFORME">Conforme</option>
                    <option value="NON_CONFORME">Non conforme</option>
                  </select>
                  <button
                    onClick={handleFiltroConformita}
                    className="px-3 py-1 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 text-sm"
                  >
                    Filtra
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={resetFiltri}
                    className="w-full px-3 py-1 bg-gray-300 text-gray-800 rounded-4xl hover:bg-gray-400 text-sm"
                  >
                    Annulla filtri
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 text-center text-gray-700 font-semibold">
          {(() => {
            const formattaData = (data) =>
              new Intl.DateTimeFormat("it-IT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(new Date(data))

            if (dataFiltro) {
              return `Filtrato per data: ${formattaData(dataFiltro)}`
            }
            if (dataInizio && dataFine) {
              return `Filtrato per intervallo: dal ${formattaData(
                dataInizio
              )} al ${formattaData(dataFine)}`
            }
            return "Tutti gli infestanti"
          })()}
        </div>

        {error && (
          <div className="mb-2 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="py-2 px-4">Data</th>
                <th className="py-2 px-4">Roditori</th>
                <th className="py-2 px-4">Insetti Striscianti</th>
                <th className="py-2 px-4">Insetti Volanti</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {(risultatiRicerca || infestanti).map((i) => (
                <tr key={i.id} className="border-t border-gray-300">
                  <td className="px-2 py-2">
                    {editingId === i.id ? (
                      <input
                        type="date"
                        value={InfestantiModificata.data}
                        onChange={(e) =>
                          setInfestantiModificata({
                            ...InfestantiModificata,
                            data: e.target.value,
                          })
                        }
                        className="w-full text-center"
                      />
                    ) : (
                      i.data
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {editingId === i.id ? (
                      <select
                        value={InfestantiModificata.roditori}
                        onChange={(e) =>
                          setInfestantiModificata({
                            ...InfestantiModificata,
                            roditori: e.target.value,
                          })
                        }
                        className="w-full text-center"
                      >
                        <option value="">Seleziona...</option>
                        <option value="CONFORME">CONFORME</option>
                        <option value="NON_CONFORME">NON CONFORME</option>
                      </select>
                    ) : filtroConformita ? (
                      i.roditori === filtroConformita ? (
                        i.roditori
                      ) : (
                        ""
                      )
                    ) : (
                      i.roditori
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {editingId === i.id ? (
                      <select
                        value={InfestantiModificata.insettiStriscianti}
                        onChange={(e) =>
                          setInfestantiModificata({
                            ...InfestantiModificata,
                            insettiStriscianti: e.target.value,
                          })
                        }
                        className="w-full text-center"
                      >
                        <option value="">Seleziona...</option>
                        <option value="CONFORME">CONFORME</option>
                        <option value="NON_CONFORME">NON CONFORME</option>
                      </select>
                    ) : filtroConformita ? (
                      i.insettiStriscianti === filtroConformita ? (
                        i.insettiStriscianti
                      ) : (
                        ""
                      )
                    ) : (
                      i.insettiStriscianti
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {editingId === i.id ? (
                      <select
                        value={InfestantiModificata.insettiVolanti}
                        onChange={(e) =>
                          setInfestantiModificata({
                            ...InfestantiModificata,
                            insettiVolanti: e.target.value,
                          })
                        }
                        className="w-full text-center"
                      >
                        <option value="">Seleziona...</option>
                        <option value="CONFORME">CONFORME</option>
                        <option value="NON_CONFORME">NON CONFORME</option>
                      </select>
                    ) : filtroConformita ? (
                      i.insettiVolanti === filtroConformita ? (
                        i.insettiVolanti
                      ) : (
                        ""
                      )
                    ) : (
                      i.insettiVolanti
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {editingId === i.id ? (
                      <button
                        onClick={() => handleSaveInfestante(i.id)}
                        className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-green-400  hover:bg-green-500 transform transition-transform duration-200 ease-in-out hover:scale-110"
                      >
                        <CheckIcon className="w-4 h-4 " />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(i.id)
                          setInfestantiModificata({
                            data: i.data,
                            roditori: i.roditori,
                            insettiStriscianti: i.insettiStriscianti,
                            insettiVolanti: i.insettiVolanti,
                          })
                        }}
                        className=" ml-2 flex items-center justify-center w-7 h-7  transform transition-transform duration-200 ease-in-out hover:scale-110 hover:text-yellow-600"
                      >
                        {" "}
                        <PencilSquareIcon className="w-6 h-6 " />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-300 bg-gray-50">
                <td className="px-2 py-2">
                  <input
                    type="date"
                    value={nuoviInfestanti.data}
                    onChange={(e) =>
                      setNuoviInfestanti({
                        ...nuoviInfestanti,
                        data: e.target.value,
                      })
                    }
                    className="w-full text-center"
                  />
                </td>
                <td className="px-2 py-2">
                  <select
                    value={nuoviInfestanti.roditori}
                    onChange={(e) =>
                      setNuoviInfestanti({
                        ...nuoviInfestanti,
                        roditori: e.target.value,
                      })
                    }
                    className="w-full text-center"
                  >
                    <option value="">Seleziona...</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select
                    value={nuoviInfestanti.insettiStriscianti}
                    onChange={(e) =>
                      setNuoviInfestanti({
                        ...nuoviInfestanti,
                        insettiStriscianti: e.target.value,
                      })
                    }
                    className="w-full text-center"
                  >
                    <option value="">Seleziona...</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select
                    value={nuoviInfestanti.insettiVolanti}
                    onChange={(e) =>
                      setNuoviInfestanti({
                        ...nuoviInfestanti,
                        insettiVolanti: e.target.value,
                      })
                    }
                    className="w-full text-center"
                  >
                    <option value="">Seleziona...</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => {
                      if (
                        !nuoviInfestanti.data ||
                        !nuoviInfestanti.roditori ||
                        !nuoviInfestanti.insettiStriscianti ||
                        !nuoviInfestanti.insettiVolanti
                      ) {
                        setError("Tutti i campi devono essere compilati.")
                        return
                      }

                      const token = localStorage.getItem("token")
                      fetch("http://localhost:8080/infestanti", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(nuoviInfestanti),
                      })
                        .then((res) => {
                          if (!res.ok)
                            throw new Error("Errore durante la creazione")
                          return res.json()
                        })
                        .then(() => {
                          getInfestanti()
                          setNuoviInfestanti({
                            data: "",
                            roditori: "",
                            insettiStriscianti: "",
                            insettiVolanti: "",
                          })
                          setRisultatiRicerca(null)
                        })
                        .catch((err) => {
                          console.error(err)
                          setError(err.message)
                        })
                    }}
                    className="w-7 h-7 bg-blue-400 text-white rounded-full hover:bg-blue-600 text-sm hover:shadow-md hover:shadow-blue-600/50 focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                  >
                    +
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Infestanti
