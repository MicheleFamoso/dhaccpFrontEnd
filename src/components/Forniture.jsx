import SideBar from "./SideBar"
import { useState, useEffect, useRef } from "react"
import { PencilSquareIcon, CheckIcon } from "@heroicons/react/24/outline"
import SidebMobile from "./SidebMobile"
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
    <div className="flex h-screen bg-beige">
      <div>
        <SideBar />
      </div>
      <div className="flex-1 justify-items-center justify-center overflow-auto">
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-20 py-2 bg-salviaChiaro/80 sticky top-0 left-0 z-50 backdrop-blur-sm shadow-xs shadow-salvia inset-shadow-sm inset-shadow-salvia/50">
          <h1 className="lg:text-6xl  text-2xl font-[Unna] text-salviaScuro text-shadow-xs mb-2 md:mb-0">
            Forniture
          </h1>{" "}
          <SidebMobile></SidebMobile>
          <div className=" flex justify-center  gap-2 w-full md:w-auto mb-2 md:mb-0">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca per prodotto o fornitore"
              className="px-2 py-1 bg-avorio border border-salvia rounded-2xl lg:w-130 md:120 shadow-sm focus:outline-hidden focus:shadow-salvia focus:shadow-md"
            />
            <button
              onClick={handleSearch}
              className="px-2 py-1 bg-salvia border-1 border-salviaScuro shadow-md text-white  hover:bg-ambra  rounded-2xl"
            >
              Cerca
            </button>
            <button
              id="filter-button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-2 py-1 bg-salvia border-1 border-salviaScuro shadow-md text-white  hover:bg-ambra  rounded-2xl"
              type="button"
            >
              Filtri
            </button>

            {showFilterDropdown && (
              <div
                ref={dropdownRef}
                className="absolute md:top-25 top-27 md:right-5 z-50 md:w-105 w-80 bg-salviaChiaro rounded-2xl shadow-salvia shadow-2xl p-4 border border-salvia"
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
                      className="px-2 py-1 border border-salviaScuro rounded-4xl flex-grow"
                    />
                    <button
                      onClick={() => {
                        handleFiltroData()
                        setShowFilterDropdown(false)
                      }}
                      className="px-3 py-1 bg-salvia  text-white rounded-4xl hover:bg-salviaScuro text-shadow-md text-sm"
                    >
                      Filtra
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Intervallo date
                  </label>
                  <div className="flex flex-col md:flex-row gap-2 ">
                    <input
                      type="date"
                      value={dataInizio}
                      onChange={(e) => setDataInizio(e.target.value)}
                      className="px-2 py-1 border border-salviaScuro rounded-4xl flex-1"
                    />
                    <input
                      type="date"
                      value={dataFine}
                      onChange={(e) => setDataFine(e.target.value)}
                      className="px-2 py-1 border border-salviaScuro rounded-4xl flex-1 "
                    />
                    <button
                      onClick={() => {
                        handleFiltroRange()
                        setShowFilterDropdown(false)
                      }}
                      className="px-3 py-1 bg-salvia text-white rounded-4xl hover:bg-salviaScuro text-shadow-md text-sm"
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
                        className="w-full p-2 py-1 border border-salviaScuro rounded-4xl"
                      >
                        <option value="">Tutti</option>
                        <option value="CONFORME">Conforme</option>
                        <option value="NON_CONFORME">Non conforme</option>
                      </select>
                      <button
                        onClick={handleFiltroConformita}
                        className="px-3 py-1 bg-salvia text-white rounded-4xl hover:bg-salviaScuro text-sm"
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
                      className="w-full px-3 text-shadow-md py-1 bg-rosso/80 text-white rounded-4xl hover:bg-rosso text-sm"
                    >
                      Annulla filtri
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 text-center text-rosso font-medium">{error}</div>
        )}
        <div className="mb-4 text-center text-gray-700 font-semibold mt-4">
          {descrizioneFiltro()}
        </div>
        <table className="hidden sm:table w-full max-w-full sm:max-w-[200px] md:max-w-[800px] lg:max-w-[1000px] border-collapse bg-salviaChiaro shadow-md rounded-2xl shadow-salviaScuro">
          <thead>
            <tr>
              <th className="rounded-tl-2xl px-6 py-3 bg-salvia text-shadow-lg text-gray-200">
                Data
              </th>
              <th className="px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                Fornitore
              </th>
              <th className="px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                Prodotto
              </th>
              <th className="px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                Conforme
              </th>
              <th className="px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                Lotto
              </th>
              <th className="px-6 py-3 bg-salvia rounded-tr-2xl"></th>
            </tr>
          </thead>
          <tbody>
            {(risultatiRicerca || forniture).map((fornitura) => (
              <tr key={fornitura.id}>
                <td className="border-b border-salvia py-3 text-center">
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
                      className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    />
                  ) : (
                    fornitura.data
                  )}
                </td>
                <td className="border-b border-salvia py-3 text-center bg-avorio">
                  {editingId === fornitura.id ? (
                    <select
                      value={fornituraModificata.fornitoreId}
                      onChange={(e) =>
                        setfornituraModificata({
                          ...fornituraModificata,
                          fornitoreId: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
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
                <td className="border-b border-salvia py-3 text-center">
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
                      className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    />
                  ) : (
                    fornitura.prodotto
                  )}
                </td>
                <td className="border-b border-salvia py-3 text-center bg-avorio">
                  {editingId === fornitura.id ? (
                    <select
                      value={fornituraModificata.conformita}
                      onChange={(e) =>
                        setfornituraModificata({
                          ...fornituraModificata,
                          conformita: e.target.value,
                        })
                      }
                      className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    >
                      <option value="CONFORME">Conforme</option>
                      <option value="NON_CONFORME">Non conforme</option>
                    </select>
                  ) : (
                    fornitura.conformita
                  )}
                </td>
                <td className="border-b border-salvia py-3 text-center">
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
                      className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    />
                  ) : (
                    fornitura.lotto
                  )}
                </td>
                <td className="text-center border-b border-salvia  bg-avorio p-3">
                  {editingId === fornitura.id ? (
                    <button
                      onClick={() => handleSaveFornitura(fornitura.id)}
                      className="ml-2 text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-salvia hover:bg-salviaScuro py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110 "
                    >
                      salva
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
                      className="ml-2 text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-ambra/90 hover:bg-ambra py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110  "
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
              <td className="px-2 py-2">
                <input
                  type="date"
                  value={nuovaFornitura.data}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      data: e.target.value,
                    })
                  }
                  className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  placeholder="Data"
                />
              </td>
              <td className=" px-2 py-2 bg-avorio">
                <select
                  value={nuovaFornitura.fornitoreId}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      fornitoreId: e.target.value,
                    })
                  }
                  className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                >
                  <option value="">Seleziona fornitore</option>
                  {fornitori.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nomeFornitore}
                    </option>
                  ))}
                </select>
              </td>
              <td className=" px-2 py-2">
                <input
                  type="text"
                  value={nuovaFornitura.prodotto}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      prodotto: e.target.value,
                    })
                  }
                  className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  placeholder="Prodotto"
                />
              </td>
              <td className="px-2 py-2 bg-avorio">
                <select
                  value={nuovaFornitura.conformita}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      conformita: e.target.value,
                    })
                  }
                  className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                >
                  <option value="">Seleziona</option>
                  <option value="CONFORME">Conforme</option>
                  <option value="NON_CONFORME">Non conforme</option>
                </select>
              </td>
              <td className=" px-2 py-2 text-center">
                <input
                  type="text"
                  value={nuovaFornitura.lotto}
                  onChange={(e) =>
                    setNuovaFornitura({
                      ...nuovaFornitura,
                      lotto: e.target.value,
                    })
                  }
                  className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  placeholder="Lotto"
                />
              </td>
              <td className="text-center bg-avorio rounded-br-2xl">
                <button
                  onClick={handleAddFornitura}
                  className="ml-5 text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-salvia hover:bg-salviaScuro py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110 "
                  title="Aggiungi"
                >
                  aggiungi
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
        {/* Mobile */}
        <div className="sm:hidden px-4 space-y-4 mt-4">
          {(risultatiRicerca || forniture).map((fornitura) => (
            <div
              key={fornitura.id}
              className={` p-4 rounded-2xl shadow-md border ${
                fornitura.conformita === "NON_CONFORME"
                  ? "border-rosso bg-rosso/80"
                  : "border-salvia bg-salviaChiaro"
              }`}
            >
              {editingId === fornitura.id ? (
                <div className="space-y-2">
                  <input
                    type="date"
                    value={fornituraModificata.data}
                    onChange={(e) =>
                      setfornituraModificata({
                        ...fornituraModificata,
                        data: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1  rounded"
                  />
                  <select
                    value={fornituraModificata.fornitoreId}
                    onChange={(e) =>
                      setfornituraModificata({
                        ...fornituraModificata,
                        fornitoreId: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1  rounded"
                  >
                    <option value="">Seleziona fornitore</option>
                    {fornitori.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nomeFornitore}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={fornituraModificata.prodotto}
                    onChange={(e) =>
                      setfornituraModificata({
                        ...fornituraModificata,
                        prodotto: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1  rounded"
                    placeholder="Prodotto"
                  />
                  <select
                    value={fornituraModificata.conformita}
                    onChange={(e) =>
                      setfornituraModificata({
                        ...fornituraModificata,
                        conformita: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1  rounded"
                  >
                    <option value="CONFORME">Conforme</option>
                    <option value="NON_CONFORME">Non conforme</option>
                  </select>
                  <input
                    type="text"
                    value={fornituraModificata.lotto}
                    onChange={(e) =>
                      setfornituraModificata({
                        ...fornituraModificata,
                        lotto: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1  rounded"
                    placeholder="Lotto"
                  />
                  <button
                    onClick={() => handleSaveFornitura(fornitura.id)}
                    className="w-full bg-salvia text-white py-1 rounded-3xl"
                  >
                    Salva
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Data:</strong> {fornitura.data}
                  </p>
                  <p>
                    <strong>Fornitore:</strong>{" "}
                    {fornitura.fornitore?.nomeFornitore ||
                      fornitori.find(
                        (f) => String(f.id) === String(fornitura.fornitoreId)
                      )?.nomeFornitore ||
                      ""}
                  </p>
                  <p>
                    <strong>Prodotto:</strong> {fornitura.prodotto}
                  </p>
                  <p>
                    <strong>Conformità:</strong> {fornitura.conformita}
                  </p>
                  <p>
                    <strong>Lotto:</strong> {fornitura.lotto}
                  </p>
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
                    className="mt-2 text-sm rounded-3xl bg-ambra text-white px-3 py-1 border-1 border-amber-400 hover:bg-ambra/90"
                  >
                    Modifica
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* MOBILE */}
          <div className="bg-avorio p-4 rounded-2xl shadow-md  border-1 border-gray-300 mt-4 mb-3">
            <h2 className="text-lg font-semibold mb-2">Aggiungi fornitura</h2>
            <div className="space-y-2">
              <input
                type="date"
                value={nuovaFornitura.data}
                onChange={(e) =>
                  setNuovaFornitura({ ...nuovaFornitura, data: e.target.value })
                }
                className="w-full px-2 py-1  rounded"
                placeholder="Data"
              />
              <select
                value={nuovaFornitura.fornitoreId}
                onChange={(e) =>
                  setNuovaFornitura({
                    ...nuovaFornitura,
                    fornitoreId: e.target.value,
                  })
                }
                className="w-full px-2 py-1  rounded"
              >
                <option value="">Seleziona fornitore</option>
                {fornitori.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nomeFornitore}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={nuovaFornitura.prodotto}
                onChange={(e) =>
                  setNuovaFornitura({
                    ...nuovaFornitura,
                    prodotto: e.target.value,
                  })
                }
                className="w-full px-2 py-1  rounded"
                placeholder="Prodotto"
              />
              <select
                value={nuovaFornitura.conformita}
                onChange={(e) =>
                  setNuovaFornitura({
                    ...nuovaFornitura,
                    conformita: e.target.value,
                  })
                }
                className="w-full px-2 py-1  rounded"
              >
                <option value="">Seleziona</option>
                <option value="CONFORME">Conforme</option>
                <option value="NON_CONFORME">Non conforme</option>
              </select>
              <input
                type="text"
                value={nuovaFornitura.lotto}
                onChange={(e) =>
                  setNuovaFornitura({
                    ...nuovaFornitura,
                    lotto: e.target.value,
                  })
                }
                className="w-full px-2 py-1  rounded"
                placeholder="Lotto"
              />
              <button
                onClick={handleAddFornitura}
                className="w-full bg-salvia text-white py-1 rounded-3xl"
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forniture
