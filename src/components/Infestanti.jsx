import SideBar from "./SideBar"

import { useState, useEffect, useRef } from "react"
import SidebMobile from "./SidebMobile"
import {
  PencilIcon,
  AdjustmentsHorizontalIcon,
  EyeSlashIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
const Infestanti = () => {
  const [infestanti, SetInfestanti] = useState([])
  const [, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dataFiltro, setDataFiltro] = useState("")
  const [dataInizio, setDataInizio] = useState("")
  const [dataFine, setDataFine] = useState("")
  const [risultatiRicerca, setRisultatiRicerca] = useState(null)
  const [filtroConformita, setFiltroConformita] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [InfestanteDaEliminare, setInfestanteDaEliminare] = useState(null)
  const [modifica, setModifica] = useState(false)

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

  //  eliminare
  const handleDeleteInfestante = async (id) => {
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`http://localhost:8080/infestanti/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Errore durante l'eliminazione")

      const updatedRes = await fetch("http://localhost:8080/infestanti/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await updatedRes.json()

      SetInfestanti(data)
    } catch (err) {
      setError("Errore durante l'eliminazione dell'infestante: " + err.message)
    }
  }

  return (
    <div className="flex h-screen bg-beige">
      <div>
        <SideBar />
      </div>
      <div className="flex-1  justify-items-center justify-center overflow-auto">
        <div className="w-full flex flex-col md:flex-row items-center justify-between  px-20 py-2 bg-salviaChiaro/80 sticky top-0 left-0 z-50 backdrop-blur-sm shadow-xs shadow-salvia inset-shadow-sm inset-shadow-salvia/50">
          <h1 className="lg:text-6xl text-2xl font-[Unna] text-salviaScuro text-shadow-xs mb-2 md:mb-0">
            Infestanti
          </h1>{" "}
          <SidebMobile></SidebMobile>
          <div className="flex gap-6 ">
            <button
              id="filter-button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className=" px-4 py-1 bg-salvia border-1 border-salviaScuro shadow-md shadow-salvia text-shadow-md text-white  hover:bg-ambra  rounded-2xl "
              type="button"
            >
              Filtri
            </button>
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
              )}
            </button>
          </div>
        </div>
        <div className="relative z-50 w-full flex justify-center md:justify-end mt-2 md:mr-6">
          {showFilterDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full mt-2 w-11/12 sm:w-auto bg-salviaChiaro rounded-2xl shadow-salvia shadow-2xl p-4 border border-salvia"
            >
              <h2 className="text-lg font-semibold mb-3 text-center">Filtri</h2>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Data specifica
                </label>
                <div className="flex  gap-2">
                  <input
                    type="date"
                    value={dataFiltro}
                    onChange={(e) => setDataFiltro(e.target.value)}
                    className="px-2 py-1 border border-salviaScuro rounded-4xl flex-grow"
                  />
                  <button
                    onClick={handleFiltroData}
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
                    className="px-2 py-1 border border-salviaScuro rounded-4xl flex-1"
                  />
                  <button
                    onClick={handleFiltroRange}
                    className=" px-3 py-1 bg-salvia text-white rounded-4xl hover:bg-salviaScuro text-shadow-md text-sm"
                  >
                    Filtra
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
                <div className="mt-4">
                  <button
                    onClick={resetFiltri}
                    className="w-full px-3 text-shadow-md py-1 bg-rosso/80 text-white rounded-4xl hover:bg-rosso text-sm"
                  >
                    Annulla filtri
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 text-center text-gray-600 font-semibold">
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
            return "Tutti i controlli"
          })()}
        </div>

        {error && (
          <div className="mb-2 text-center text-rosso font-medium">{error}</div>
        )}

        <div className=" ">
          <table className="hidden sm:table w-full max-w-full sm:max-w-[200px] md:max-w-[800px] lg:max-w-[1000px] border-collapse bg-salviaChiaro shadow-md rounded-2xl shadow-salviaScuro">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="rounded-tl-2xl px-6 py-3 bg-salvia text-shadow-lg text-gray-200">
                  Data
                </th>
                <th className="px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                  Roditori
                </th>
                <th className="px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                  Insetti Striscianti
                </th>
                <th className="px-6 py-3 bg-salvia  text-shadow-lg text-gray-200">
                  Insetti Volanti
                </th>
                <th className="px-6 py-3 bg-salvia rounded-tr-2xl"></th>
              </tr>
            </thead>
            <tbody>
              {(risultatiRicerca || infestanti).map((i) => (
                <tr key={i.id}>
                  <td className="border-b border-salvia py-3 text-center">
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
                        className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                      />
                    ) : (
                      i.data
                    )}
                  </td>
                  <td className="border-b border-salvia py-3 text-center bg-avorio">
                    {editingId === i.id ? (
                      <select
                        value={InfestantiModificata.roditori}
                        onChange={(e) =>
                          setInfestantiModificata({
                            ...InfestantiModificata,
                            roditori: e.target.value,
                          })
                        }
                        className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                      >
                        <option value="">Seleziona</option>
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
                  <td className="border-b border-salvia py-3 text-center">
                    {editingId === i.id ? (
                      <select
                        value={InfestantiModificata.insettiStriscianti}
                        onChange={(e) =>
                          setInfestantiModificata({
                            ...InfestantiModificata,
                            insettiStriscianti: e.target.value,
                          })
                        }
                        className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                      >
                        <option value="">Seleziona</option>
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
                  <td className="border-b border-salvia py-3 text-center bg-avorio">
                    {editingId === i.id ? (
                      <select
                        value={InfestantiModificata.insettiVolanti}
                        onChange={(e) =>
                          setInfestantiModificata({
                            ...InfestantiModificata,
                            insettiVolanti: e.target.value,
                          })
                        }
                        className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                      >
                        <option value="">Seleziona</option>
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
                  <td className="border-b border-salvia bg-avorio py-3 text-center px-3">
                    {editingId === i.id ? (
                      <button
                        onClick={() => handleSaveInfestante(i.id)}
                        className="ml-2 text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-salvia hover:bg-salviaScuro py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110  "
                      >
                        salva
                      </button>
                    ) : (
                      modifica && (
                        <div className="flex  items-center gap-4">
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
                            className="  text-shadow-lg flex items-center justify-center rounded-3xl bg-ambra/90 hover:bg-ambra px-4 py-1 transition-transform hover:scale-105 shadow-lg "
                          >
                            <PencilIcon className="w-6 h-6" />
                          </button>
                          <button
                            className="text-gray-100 text-shadow-lg flex items-center justify-center  rounded-2xl bg-rosso/90 hover:bg-rosso px-4 py-1 transition-transform hover:scale-105 shadow-lg"
                            onClick={() => {
                              setInfestanteDaEliminare(i)
                              setShowDeleteModal(true)
                            }}
                          >
                            <TrashIcon className="w-6 h-6" />
                          </button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-2 py-4">
                  <input
                    type="date"
                    value={nuoviInfestanti.data}
                    onChange={(e) =>
                      setNuoviInfestanti({
                        ...nuoviInfestanti,
                        data: e.target.value,
                      })
                    }
                    className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                  />
                </td>
                <td className="px-2 py-4 bg-avorio">
                  <select
                    value={nuoviInfestanti.roditori}
                    onChange={(e) =>
                      setNuoviInfestanti({
                        ...nuoviInfestanti,
                        roditori: e.target.value,
                      })
                    }
                    className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden "
                  >
                    <option value="">Seleziona</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                </td>
                <td className="px-2 py-4">
                  <select
                    value={nuoviInfestanti.insettiStriscianti}
                    onChange={(e) =>
                      setNuoviInfestanti({
                        ...nuoviInfestanti,
                        insettiStriscianti: e.target.value,
                      })
                    }
                    className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden "
                  >
                    <option value="">Seleziona</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                </td>
                <td className="px-2 py-4 bg-avorio">
                  <select
                    value={nuoviInfestanti.insettiVolanti}
                    onChange={(e) =>
                      setNuoviInfestanti({
                        ...nuoviInfestanti,
                        insettiVolanti: e.target.value,
                      })
                    }
                    className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden "
                  >
                    <option value="">Seleziona</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                </td>
                <td className="text-center px-4 py4 bg-avorio rounded-br-2xl ">
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
                    className="ml-1 text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-salvia hover:bg-salviaScuro py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110 "
                  >
                    aggiungi
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="block md:hidden px-4 space-y-4 mt-6">
          {(risultatiRicerca || infestanti).map((i) => (
            <div
              key={i.id}
              className="bg-salviaChiaro shadow-md rounded-xl p-4 space-y-2 shadow-salvia border-1 border-salvia"
            >
              {editingId === i.id ? (
                <>
                  <input
                    type="date"
                    value={InfestantiModificata.data}
                    onChange={(e) =>
                      setInfestantiModificata({
                        ...InfestantiModificata,
                        data: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 rounded "
                  />
                  <select
                    value={InfestantiModificata.roditori}
                    onChange={(e) =>
                      setInfestantiModificata({
                        ...InfestantiModificata,
                        roditori: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 rounded "
                  >
                    <option value="">Roditori</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                  <select
                    value={InfestantiModificata.insettiStriscianti}
                    onChange={(e) =>
                      setInfestantiModificata({
                        ...InfestantiModificata,
                        insettiStriscianti: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 rounded "
                  >
                    <option value="">Insetti Striscianti</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                  <select
                    value={InfestantiModificata.insettiVolanti}
                    onChange={(e) =>
                      setInfestantiModificata({
                        ...InfestantiModificata,
                        insettiVolanti: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 rounded "
                  >
                    <option value="">Insetti Volanti</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                  <button
                    onClick={() => handleSaveInfestante(i.id)}
                    className="w-full bg-salvia text-white px-4 py-1 rounded-3xl hover:bg-salviaScuro"
                  >
                    Salva
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <strong>Data:</strong> {i.data}
                  </p>
                  <p>
                    <strong>Roditori:</strong> {i.roditori}
                  </p>
                  <p>
                    <strong>Insetti Striscianti:</strong> {i.insettiStriscianti}
                  </p>
                  <p>
                    <strong>Insetti Volanti:</strong> {i.insettiVolanti}
                  </p>
                  <div className=" flex justify-between">
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
                      className="mt-2 text-sm  rounded-3xl bg-ambra text-black px-3 py-1  hover:bg-ambra/90"
                    >
                      Modifica
                    </button>
                    <button
                      className="mt-2 text-sm  rounded-3xl bg-rosso text-white px-3 py-1 border-1 border-rosso hover:bg-rosso/90"
                      onClick={() => {
                        setInfestanteDaEliminare(i)
                        setShowDeleteModal(true)
                      }}
                    >
                      Elimina
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Mobile */}
          <div className="bg-avorio shadow-md rounded-2xl p-4 space-y-3 border-1 border-gray-300 mb-3">
            <h2 className="text-lg font-semibold text-salviaScuro">
              Aggiungi infestante
            </h2>
            <input
              type="date"
              value={nuoviInfestanti.data}
              onChange={(e) =>
                setNuoviInfestanti({ ...nuoviInfestanti, data: e.target.value })
              }
              className="w-full px-2 py-1 rounded "
            />
            <select
              value={nuoviInfestanti.roditori}
              onChange={(e) =>
                setNuoviInfestanti({
                  ...nuoviInfestanti,
                  roditori: e.target.value,
                })
              }
              className="w-full px-2 py-1 rounded "
            >
              <option value="">Roditori</option>
              <option value="CONFORME">CONFORME</option>
              <option value="NON_CONFORME">NON CONFORME</option>
            </select>
            <select
              value={nuoviInfestanti.insettiStriscianti}
              onChange={(e) =>
                setNuoviInfestanti({
                  ...nuoviInfestanti,
                  insettiStriscianti: e.target.value,
                })
              }
              className="w-full px-2 py-1 rounded "
            >
              <option value="">Insetti Striscianti</option>
              <option value="CONFORME">CONFORME</option>
              <option value="NON_CONFORME">NON CONFORME</option>
            </select>
            <select
              value={nuoviInfestanti.insettiVolanti}
              onChange={(e) =>
                setNuoviInfestanti({
                  ...nuoviInfestanti,
                  insettiVolanti: e.target.value,
                })
              }
              className="w-full px-2 py-1 rounded "
            >
              <option value="">Insetti Volanti</option>
              <option value="CONFORME">CONFORME</option>
              <option value="NON_CONFORME">NON CONFORME</option>
            </select>
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
                    if (!res.ok) throw new Error("Errore durante la creazione")
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
              className="w-full bg-salvia text-white px-4 py-1 rounded-3xl hover:bg-salviaScuro"
            >
              Aggiungi
            </button>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-neutral-400/50 bg-opacity-30 flex items-center justify-center  ">
          <div className="bg-salviaChiaro rounded-2xl border-1 border-salviaScuro p-6 w-100 shadow-lg shadow-salvia text-center ">
            <h2 className="text-xl  mb-4">Conferma eliminazione</h2>
            <p>
              Sei sicuro di voler eliminar
              <span className="font-bold">{InfestanteDaEliminare?.data}</span>?
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
                  if (InfestanteDaEliminare) {
                    handleDeleteInfestante(InfestanteDaEliminare.id)
                  }
                  setShowDeleteModal(false)
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

export default Infestanti
