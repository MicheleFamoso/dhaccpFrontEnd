import SideBar from "./SideBar"
import { useState, useEffect, useRef } from "react"
import { PencilSquareIcon, CheckIcon } from "@heroicons/react/24/outline"
const Forniture = () => {
  const descrizioneFiltro = () => {
    if (filtroConformita) {
      return `Filtrato per conformità: ${filtroConformita.toLowerCase()}`
    }
    if (dataFiltro) {
      return `Filtrato per data: ${dataFiltro}`
    }
    if (dataInizio && dataFine) {
      return `Filtrato per intervallo: dal ${dataInizio} al ${dataFine}`
    }
    return "Tutte le forniture"
  }
  const [fornitori, setFornitori] = useState([])
  const [forniture, setForniture] = useState([])
  const [, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dataFiltro, setDataFiltro] = useState("")
  const [dataInizio, setDataInizio] = useState("")
  const [dataFine, setDataFine] = useState("")

  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const [filtroConformita, setFiltroConformita] = useState("")

  const handleFiltroConformita = () => {
    const token = localStorage.getItem("token")
    if (!filtroConformita) return
    fetch(
      `http://localhost:8080/forniture/conformita?conformita=${filtroConformita}`,
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
        console.error("Errore filtro conformità:", err)
        setError("Errore nel filtro per conformità.")
      })
  }

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
  useEffect(() => {
    getFornitori()
  }, [])

  const getForniture = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.warn("Nessun token trovato, fetch annullata.")
      setError("Nessun token trovato, impossibile caricare i Fornitori.")
      return
    }
    setLoading(true)
    setError(null)
    fetch("http://localhost:8080/forniture", {
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
        console.log("Forniture ricevuti:", data)
        setForniture(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Errore nella fetch forniture:", error)
        setError("Errore nel caricamento delle forniture.")
        setLoading(false)
      })
  }
  useEffect(() => {
    getForniture()
  }, [])
  // Gestione click fuori dal dropdown filtri
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

  const [nuovaFornitura, setNuovaFornitura] = useState({
    data: "",
    fornitoreId: "",
    prodotto: "",
    conformita: "",
    lotto: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [fornituraModificata, setfornituraModificata] = useState({})

  const [query, setQuery] = useState("")
  const [risultatiRicerca, setRisultatiRicerca] = useState(null)

  const handleSearch = () => {
    const token = localStorage.getItem("token")
    const url = `http://localhost:8080/forniture/cerca?query=${encodeURIComponent(
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

  const handleFiltroData = () => {
    const token = localStorage.getItem("token")
    if (!dataFiltro) return
    fetch(`http://localhost:8080/forniture/data?data=${dataFiltro}`, {
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
      `http://localhost:8080/forniture/range?start=${dataInizio}&end=${dataFine}`,
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

  const handleAddFornitura = () => {
    const token = localStorage.getItem("token")
    fetch("http://localhost:8080/forniture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...nuovaFornitura,
        fornitoreId: Number(nuovaFornitura.fornitoreId),
      }),
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
        getForniture()
        setNuovaFornitura({
          data: "",
          fornitoreId: "",
          prodotto: "",
          conformita: "",
          lotto: "",
        })
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
      })
  }

  const handleSaveFornitura = (id) => {
    const token = localStorage.getItem("token")
    fetch(`http://localhost:8080/forniture/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...fornituraModificata,
        fornitoreId: Number(fornituraModificata.fornitoreId),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante il salvataggio")
        return res.json()
      })
      .then(() => {
        getForniture()
        setEditingId(null)
        setfornituraModificata({})
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
      })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div>
        <SideBar />
      </div>
      <div className="flex-1 p-6 justify-items-center justify-center relative">
        <div className="mb-4 flex gap-2 items-center relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per prodotto o fornitore"
            className="px-3 py-1 bg-white border border-gray-300 rounded-2xl w-150 shadow-sm mb-6 focus:outline-hidden focus:shadow-blue-300 focus:shadow-md"
          />
          <button
            onClick={handleSearch}
            className="px-2 py-1 bg-blue-400 text-white  hover:bg-blue-600 mb-6 rounded-2xl m"
          >
            Cerca
          </button>
          <button
            id="filter-button"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-blue-200 mb-6 rounded-2xl ml-2"
            type="button"
          >
            Filtri
          </button>

          {showFilterDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full  right-0 z-50 w-105 bg-white rounded-md shadow-2xl p-4 border border-gray-200"
            >
              <h2 className="text-lg font-semibold mb-3">Filtra forniture</h2>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Data specifica
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dataFiltro}
                    onChange={(e) => setDataFiltro(e.target.value)}
                    className="px-2 py-1 border border-gray-300  flex-grow rounded-4xl"
                  />
                  <button
                    onClick={() => {
                      handleFiltroData()
                      setShowFilterDropdown(false)
                    }}
                    className="px-3 py-1 bg-blue-500 text-white  hover:bg-blue-600 text-sm rounded-4xl"
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
                    className="px-2 py-1 border border-gray-300  flex-1 rounded-4xl"
                  />
                  <input
                    type="date"
                    value={dataFine}
                    onChange={(e) => setDataFine(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-4xl flex-1 "
                  />
                  <button
                    onClick={() => {
                      handleFiltroRange()
                      setShowFilterDropdown(false)
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 text-sm"
                  >
                    Filtra
                  </button>
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
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setDataFiltro("")
                      setDataInizio("")
                      setDataFine("")
                      setFiltroConformita("")
                      setRisultatiRicerca(null)
                      setShowFilterDropdown(false)
                    }}
                    className="w-full px-3 py-1 bg-gray-300 text-gray-800 rounded-4xl hover:bg-gray-400 text-sm"
                  >
                    Annulla filtri
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="mb-4 text-center text-red-600 font-medium">
            {error}
          </div>
        )}
        <div className="mb-4 text-center text-gray-700 font-semibold">
          {descrizioneFiltro()}
        </div>
        <table className="w-250 border-collapse bg-neutral-50 shadow-xl">
          <thead>
            <tr>
              <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200">
                Data
              </th>
              <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200">
                Fornitore
              </th>
              <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200">
                Prodotto
              </th>
              <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200">
                Conforme
              </th>
              <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200">
                Lotto
              </th>
              <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200"></th>
            </tr>
          </thead>
          <tbody>
            {(risultatiRicerca || forniture).map((fornitura) => (
              <tr key={fornitura.id}>
                <td className="border-b border-gray-300 py-3 text-center">
                  {editingId === fornitura.id ? (
                    <input
                      type="date"
                      value={fornituraModificata.data}
                      onChange={(e) =>
                        setfornituraModificata({
                          ...fornituraModificata,
                          data: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                    />
                  ) : (
                    fornitura.data
                  )}
                </td>
                <td className="border-b border-gray-300 py-3 text-center bg-neutral-100">
                  {editingId === fornitura.id ? (
                    <select
                      value={fornituraModificata.fornitoreId}
                      onChange={(e) =>
                        setfornituraModificata({
                          ...fornituraModificata,
                          fornitoreId: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                    >
                      <option value="">Seleziona fornitore</option>
                      {fornitori.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.nomeFornitore}
                        </option>
                      ))}
                    </select>
                  ) : (
                    fornitura.fornitore?.nomeFornitore ||
                    fornitori.find(
                      (f) => String(f.id) === String(fornitura.fornitoreId)
                    )?.nomeFornitore ||
                    ""
                  )}
                </td>
                <td className="border-b border-gray-300 py-3 text-center">
                  {editingId === fornitura.id ? (
                    <input
                      type="text"
                      value={fornituraModificata.prodotto}
                      onChange={(e) =>
                        setfornituraModificata({
                          ...fornituraModificata,
                          prodotto: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                    />
                  ) : (
                    fornitura.prodotto
                  )}
                </td>
                <td className="border-b border-gray-300 py-3 text-center bg-neutral-100">
                  {editingId === fornitura.id ? (
                    <select
                      value={fornituraModificata.conformita}
                      onChange={(e) =>
                        setfornituraModificata({
                          ...fornituraModificata,
                          conformita: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                    >
                      <option value="CONFORME">Conforme</option>
                      <option value="NON_CONFORME">Non conforme</option>
                    </select>
                  ) : (
                    fornitura.conformita
                  )}
                </td>
                <td className="border-b border-gray-300 py-3 text-center">
                  {editingId === fornitura.id ? (
                    <input
                      type="text"
                      value={fornituraModificata.lotto}
                      onChange={(e) =>
                        setfornituraModificata({
                          ...fornituraModificata,
                          lotto: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                    />
                  ) : (
                    fornitura.lotto
                  )}
                </td>
                <td className="text-center border-b border-gray-300  bg-neutral-100 p-3">
                  {editingId === fornitura.id ? (
                    <button
                      onClick={() => handleSaveFornitura(fornitura.id)}
                      className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-green-400  hover:bg-green-500 transform transition-transform duration-200 ease-in-out hover:scale-110"
                    >
                      <CheckIcon className="w-4 h-4 " />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(fornitura.id)
                        setfornituraModificata({
                          id: fornitura.id,
                          data: fornitura.data,
                          fornitoreId:
                            fornitura.fornitore?.id ||
                            fornitura.fornitoreId ||
                            "",
                          prodotto: fornitura.prodotto,
                          conformita: fornitura.conformita,
                          lotto: fornitura.lotto,
                        })
                      }}
                      className=" ml-2 flex items-center justify-center w-7 h-7  transform transition-transform duration-200 ease-in-out hover:scale-110 hover:text-yellow-600"
                    >
                      <PencilSquareIcon className="w-6 h-6 " />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border-t border-gray-300 px-2 py-2">
                <input
                  type="date"
                  value={nuovaFornitura.data}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      data: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                  placeholder="Data"
                />
              </td>
              <td className="border-t border-gray-300 px-2 py-2 bg-neutral-100">
                <select
                  value={nuovaFornitura.fornitoreId}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      fornitoreId: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                >
                  <option value="">Seleziona fornitore</option>
                  {fornitori.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nomeFornitore}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border-t border-gray-300 px-2 py-2">
                <input
                  type="text"
                  value={nuovaFornitura.prodotto}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      prodotto: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                  placeholder="Prodotto"
                />
              </td>
              <td className="border-t border-gray-300 px-2 py-2 bg-neutral-100">
                <select
                  value={nuovaFornitura.conformita}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      conformita: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                >
                  <option value="">Seleziona</option>
                  <option value="CONFORME">Conforme</option>
                  <option value="NON_CONFORME">Non conforme</option>
                </select>
              </td>
              <td className="border-t border-gray-300 px-2 py-2 text-center">
                <input
                  type="text"
                  value={nuovaFornitura.lotto}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      lotto: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                  placeholder="Lotto"
                />
              </td>
              <td className="text-center">
                <button
                  onClick={handleAddFornitura}
                  className="w-7 h-7 bg-blue-400 text-white rounded-full hover:bg-blue-600 text-sm hover:shadow-md hover:shadow-blue-600/50 focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                  title="Aggiungi"
                >
                  +
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default Forniture
