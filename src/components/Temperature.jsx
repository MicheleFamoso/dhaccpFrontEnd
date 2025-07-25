import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import {
  PencilIcon,
  AdjustmentsHorizontalIcon,
  EyeSlashIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { format, subDays, addDays } from "date-fns"
import { it } from "date-fns/locale"
import SidebMobile from "./SidebMobile"

const Temperature = () => {
  const [temperature, setTemperature] = useState([])
  const [giorni, setGiorni] = useState([])
  const [giornoCorrente, setGiornoCorrente] = useState(0)
  const [modifica, setModifica] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [temperaturaDaEliminare, setTemperaturaDaEliminare] = useState(null)

  const [nuovaTemperatura, setNuovaTemperatura] = useState({
    frigo: "",
    temperatura: "",
    conformita: "",
    data: "",
  })

  const [mostraFiltri, setMostraFiltri] = useState(false)
  //filtri
  const [filtroData, setFiltroData] = useState("")
  const [filtroStart, setFiltroStart] = useState("")
  const [filtroEnd, setFiltroEnd] = useState("")
  const [filtroConformita, setFiltroConformita] = useState("")
  const [filtroTemperatura, setFiltroTemperatura] = useState("")
  const [filtroFrigo, setFiltroFrigo] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [temperaturaModificata, setTemperaturaModificata] = useState({
    frigo: "",
    temperatura: "",
    conformita: "",
    data: "",
  })

  const [risultatiFiltrati, setRisultatiFiltrati] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("http://localhost:8080/temperature", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const raggruppate = data.reduce((acc, curr) => {
          if (!acc[curr.data]) acc[curr.data] = []
          acc[curr.data].push(curr)
          return acc
        }, {})
        const giorniOrdinati = Object.keys(raggruppate).sort()
        setGiorni(giorniOrdinati)
        setTemperature(raggruppate)
        setGiornoCorrente(giorniOrdinati.length - 1)
      })
      .catch((err) => {
        console.error("Errore nel caricamento temperature:", err)
      })
  }, [])

  const applicaFiltri = async () => {
    const token = localStorage.getItem("token")
    let url = "http://localhost:8080/temperature"

    if (filtroData) {
      url += `/data?data=${filtroData}`
    } else if (filtroStart && filtroEnd && filtroConformita && filtroFrigo) {
      url += `/${filtroFrigo}/range/conformita?start=${filtroStart}&end=${filtroEnd}&conformita=${filtroConformita}`
    } else if (filtroStart && filtroEnd && filtroFrigo) {
      url += `/${filtroFrigo}/range?start=${filtroStart}&end=${filtroEnd}`
    } else if (filtroStart && filtroEnd) {
      url += `/range?start=${filtroStart}&end=${filtroEnd}`
    } else if (filtroConformita) {
      url += `/conformita?conformita=${filtroConformita}`
    } else if (filtroTemperatura) {
      url += `/valore?temperatura=${filtroTemperatura}`
    }

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setRisultatiFiltrati(data)
    } catch (err) {
      alert("Errore nel filtraggio: " + err)
    }
  }

  const resetFiltri = () => {
    setFiltroData("")
    setFiltroStart("")
    setFiltroEnd("")
    setFiltroConformita("")
    setFiltroTemperatura("")
    setFiltroFrigo("")
    setRisultatiFiltrati([])

    fetch("http://localhost:8080/temperature", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const raggruppate = data.reduce((acc, curr) => {
          if (!acc[curr.data]) acc[curr.data] = []
          acc[curr.data].push(curr)
          return acc
        }, {})
        const giorniOrdinati = Object.keys(raggruppate).sort()
        setGiorni(giorniOrdinati)
        setTemperature(raggruppate)
      })
  }

  const giornoSelezionato = giorni[giornoCorrente]
  const temperatureDelGiorno = temperature[giornoSelezionato] || []

  const formattaData = (data) =>
    new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "long",
    }).format(new Date(data))

  const handleAddTemperatura = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    const payload = {
      ...nuovaTemperatura,
    }
    try {
      const res = await fetch("http://localhost:8080/temperature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Errore nell'inserimento")

      const updatedRes = await fetch("http://localhost:8080/temperature", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await updatedRes.json()
      const raggruppate = data.reduce((acc, curr) => {
        if (!acc[curr.data]) acc[curr.data] = []
        acc[curr.data].push(curr)
        return acc
      }, {})
      const giorniOrdinati = Object.keys(raggruppate).sort()
      setGiorni(giorniOrdinati)
      setTemperature(raggruppate)

      setNuovaTemperatura({
        frigo: "",
        temperatura: "",
        conformita: "",
        data: "",
      })
    } catch (err) {
      alert("Errore durante l'inserimento della temperatura" + err)
    }
  }

  const handleUpdateTemperatura = async (id, e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:8080/temperature/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(temperaturaModificata),
      })
      if (!res.ok) throw new Error("Errore nella modifica")

      const updatedRes = await fetch("http://localhost:8080/temperature", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await updatedRes.json()
      const raggruppate = data.reduce((acc, curr) => {
        if (!acc[curr.data]) acc[curr.data] = []
        acc[curr.data].push(curr)
        return acc
      }, {})
      const giorniOrdinati = Object.keys(raggruppate).sort()
      setGiorni(giorniOrdinati)
      setTemperature(raggruppate)
      setEditingId(null)
    } catch (err) {
      alert("Errore durante la modifica della temperatura" + err)
    }
  }
  const haFiltriAttivi = () =>
    filtroData ||
    filtroStart ||
    filtroEnd ||
    filtroConformita ||
    filtroFrigo ||
    filtroTemperatura

  //  eliminare
  const handleDeleteTemperatura = async (id) => {
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`http://localhost:8080/temperature/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Errore durante l'eliminazione")

      const updatedRes = await fetch("http://localhost:8080/temperature", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await updatedRes.json()
      const raggruppate = data.reduce((acc, curr) => {
        if (!acc[curr.data]) acc[curr.data] = []
        acc[curr.data].push(curr)
        return acc
      }, {})
      const giorniOrdinati = Object.keys(raggruppate).sort()
      setGiorni(giorniOrdinati)
      setTemperature(raggruppate)
    } catch (err) {
      alert("Errore durante l'eliminazione della temperatura: " + err.message)
    }
  }
  return (
    <div className="flex h-screen bg-beige">
      <SideBar />
      <div className="flex-1 overflow-auto  justify-items-center">
        <div className="w-full flex flex-col md:flex-row items-center justify-between md:px-20 px-4 py-2 bg-salviaChiaro sticky top-0 left-0 z-50 backdrop-blur-sm shadow-xs shadow-salvia inset-shadow-sm inset-shadow-salvia/50">
          <h1 className="lg:text-6xl text-2xl font-[Unna] text-salviaScuro text-shadow-xs mb-2 md:mb-0">
            Temperature
          </h1>
          <SidebMobile></SidebMobile>
          <div className="flex justify-center  items-center gap-2 w-full md:w-auto mb-2 md:mb-0">
            <div className="flex gap-5 ">
              <button
                disabled={giornoCorrente === 0}
                onClick={() => setGiornoCorrente((prev) => prev - 1)}
                className="text-xs md:text-xl bg-neutral-200 border border-salvia shadow-md shadow-salviaChiaro text-gray-700 rounded-4xl px-3 disabled:opacity-50 hover:bg-salviaScuro hover:text-white"
              >
                ◀ &nbsp;
                {giornoSelezionato && !isNaN(new Date(giornoSelezionato))
                  ? format(subDays(new Date(giornoSelezionato), 1), "dd", {
                      locale: it,
                    })
                  : "–"}
              </button>
              <span className="text-center self-center bg-ambra shadow-md shadow-salvia text-shadow-md px-4 py-2 rounded-4xl text-gray-800 text-xs md:text-xl">
                {!haFiltriAttivi()
                  ? giornoSelezionato
                    ? ` ${formattaData(giornoSelezionato)}`
                    : "Temperature registrate"
                  : filtroConformita
                  ? `Temperature ${filtroConformita
                      .toLowerCase()
                      .replace("_", " ")} rilevate`
                  : filtroData
                  ? ` ${formattaData(filtroData)}`
                  : filtroStart && filtroEnd
                  ? ` Dal ${formattaData(filtroStart)} al ${formattaData(
                      filtroEnd
                    )}`
                  : filtroFrigo
                  ? ` Frigo ${filtroFrigo}`
                  : filtroTemperatura
                  ? `Temperature pari a ${filtroTemperatura}°C`
                  : "Risultati del filtro"}
              </span>
              <button
                disabled={giornoCorrente === giorni.length - 1}
                onClick={() => setGiornoCorrente((prev) => prev + 1)}
                className="text-xs md:text-xl bg-neutral-200 border border-salvia shadow-md shadow-salviaChiaro text-gray-700 rounded-4xl px-3 disabled:opacity-50 hover:bg-salviaScuro hover:text-white"
              >
                {giornoSelezionato && !isNaN(new Date(giornoSelezionato))
                  ? format(addDays(new Date(giornoSelezionato), 1), "dd", {
                      locale: it,
                    })
                  : "–"}{" "}
                ▶
              </button>{" "}
            </div>
          </div>{" "}
          <div className="flex  px-6 gap-4">
            <button
              className="  md:ms-0 md:px-3 px-2 py-1 bg-salvia border border-salviaScuro shadow-md text-shadow-md text-white hover:bg-ambra rounded-3xl text-xs md:text-base hover:text-black"
              onClick={() => setMostraFiltri((prev) => !prev)}
            >
              Filtri
            </button>{" "}
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
          {mostraFiltri && (
            <div className="absolute  left-2 md:left-140 top-full mt-1 z-50 w-80 md:w-[500px] bg-salviaChiaro rounded-2xl shadow-salvia shadow-2xl p-4 border border-salvia">
              <h2 className="font-semibold mb-2">Filtri</h2>
              <div className="">
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Data specifica
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="px-2 py-1 border border-salviaScuro rounded-4xl flex-grow"
                      placeholder="Data"
                      value={filtroData}
                      onChange={(e) => setFiltroData(e.target.value)}
                    />
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-salvia  text-white rounded-4xl hover:bg-salviaScuro text-shadow-md text-sm"
                    >
                      Filtra
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Intervallo date
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="date"
                      className="px-2 py-1 border border-salviaScuro rounded-4xl flex-grow"
                      placeholder="Da"
                      value={filtroStart}
                      onChange={(e) => setFiltroStart(e.target.value)}
                    />{" "}
                    <input
                      type="date"
                      className="px-2 py-1 border border-salviaScuro rounded-4xl flex-grow"
                      placeholder="A"
                      value={filtroEnd}
                      onChange={(e) => setFiltroEnd(e.target.value)}
                    />
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-salvia  text-white rounded-4xl hover:bg-salviaScuro text-shadow-md text-sm"
                    >
                      Filtra
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Frigo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="px-2 py-1 border border-salviaScuro rounded-4xl flex-grow"
                      placeholder="Frigo"
                      value={filtroFrigo}
                      onChange={(e) => setFiltroFrigo(e.target.value)}
                    />
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-salvia  text-white rounded-4xl hover:bg-salviaScuro text-shadow-md text-sm"
                    >
                      Filtra
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Temperatura
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="px-2 py-1 border border-salviaScuro rounded-4xl flex-grow"
                      placeholder="Temperatura"
                      value={filtroTemperatura}
                      onChange={(e) => setFiltroTemperatura(e.target.value)}
                    />
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-salvia  text-white rounded-4xl hover:bg-salviaScuro text-shadow-md text-sm"
                    >
                      Filtra
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Conformità
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="px-2 py-1 border border-salviaScuro rounded-4xl flex-grow"
                      value={filtroConformita}
                      onChange={(e) => setFiltroConformita(e.target.value)}
                    >
                      <option value="">Seleziona</option>
                      <option value="CONFORME">CONFORME</option>
                      <option value="NON_CONFORME">NON CONFORME</option>
                    </select>
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-salvia  text-white rounded-4xl hover:bg-salviaScuro text-shadow-md text-sm"
                    >
                      Filtra
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="w-full px-3 text-shadow-md py-1 bg-rosso/80 text-white rounded-4xl hover:bg-rosso text-sm"
                  onClick={resetFiltri}
                >
                  Annulla filtri
                </button>
              </div>
            </div>
          )}
        </div>

        <div className=" flex-1 p-6 justify-items-center justify-center ">
          <table className="hidden sm:table w-full max-w-full sm:max-w-[200px] md:max-w-[800px] lg:max-w-[1000px] border-collapse bg-salviaChiaro shadow-md rounded-2xl shadow-salviaScuro">
            <thead>
              <tr>
                <th className="rounded-tl-2xl md:px-6 px-1 md:py-3 py-1 bg-salvia text-shadow-lg text-gray-200">
                  Data
                </th>
                <th className="md:px-6 px-1 md:py-3 py-1 bg-salvia  text-shadow-lg text-gray-200">
                  Frigo
                </th>
                <th className="md:px-6 px-1 md:py-3 py-1 bg-salvia  text-shadow-lg text-gray-200">
                  Temperatura
                </th>
                <th className="md:px-6 px-1 md:py-3 py-1 bg-salvia  text-shadow-lg text-gray-200">
                  Conformità
                </th>
                <th className="md:px-6 px-1 md:py-3 py-1 bg-salvia rounded-tr-2xl"></th>
              </tr>
            </thead>
            <tbody>
              {(risultatiFiltrati?.length > 0
                ? risultatiFiltrati
                : temperatureDelGiorno
              ).map((t, index) => (
                <tr key={t.id || index}>
                  {editingId === t.id ? (
                    <>
                      <td className="border-b border-salvia py-3 text-center bg-avorio">
                        <input
                          type="date"
                          className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                          value={temperaturaModificata.data || ""}
                          onChange={(e) =>
                            setTemperaturaModificata((prev) => ({
                              ...prev,
                              data: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="border-b border-salvia py-3 text-center">
                        <input
                          type="text"
                          className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                          value={temperaturaModificata.frigo}
                          onChange={(e) =>
                            setTemperaturaModificata((prev) => ({
                              ...prev,
                              frigo: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="border-b border-salvia py-3 text-center bg-avorio">
                        <input
                          type="number"
                          className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                          value={temperaturaModificata.temperatura}
                          onChange={(e) =>
                            setTemperaturaModificata((prev) => ({
                              ...prev,
                              temperatura: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="border-b border-salvia py-3 text-center">
                        <select
                          className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                          value={temperaturaModificata.conformita}
                          onChange={(e) =>
                            setTemperaturaModificata((prev) => ({
                              ...prev,
                              conformita: e.target.value,
                            }))
                          }
                        >
                          <option value="">Seleziona</option>
                          <option value="CONFORME">CONFORME</option>
                          <option value="NON_CONFORME">NON CONFORME</option>
                        </select>
                      </td>
                      <td className="border-b border-salvia py-3 text-center bg-avorio">
                        <button
                          className="ml-2 text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-salvia hover:bg-salviaScuro py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110 "
                          onClick={(e) => handleUpdateTemperatura(t.id, e)}
                        >
                          salva
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border-b border-salvia py-3 text-center px-3 bg-avorio">
                        {formattaData(t.data)}
                      </td>
                      <td className="border-b border-salvia py-3 text-center px-3">
                        {t.frigo}
                      </td>
                      <td className="border-b border-salvia py-3 text-center px-3 bg-avorio">
                        {t.temperatura}
                      </td>
                      <td className="border-b border-salvia py-3 text-center px-3">
                        {t.conformita}
                      </td>
                      <td className="border-b border-salvia py-3 text-center px-3 bg-avorio">
                        {modifica && (
                          <div className="flex  items-center gap-4">
                            <button
                              className="text-black text-shadow-lg flex items-center justify-center rounded-3xl bg-ambra/90  hover:bg-ambra px-4 py-1 transition-transform hover:scale-105 shadow-lg "
                              onClick={() => {
                                setEditingId(t.id)
                                setTemperaturaModificata({
                                  frigo: t.frigo,
                                  temperatura: t.temperatura,
                                  conformita: t.conformita,
                                  data: t.data,
                                })
                              }}
                            >
                              <PencilIcon className="w-6 h-6" />
                            </button>
                            <button
                              className="text-gray-100 text-shadow-lg flex items-center justify-center  rounded-3xl bg-rosso/90 hover:bg-rosso px-4 py-1 transition-transform shadow-lg  hover:scale-105"
                              onClick={() => {
                                setTemperaturaDaEliminare(t)
                                setShowDeleteModal(true)
                              }}
                            >
                              <TrashIcon className="w-6 h-6" />
                            </button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {temperatureDelGiorno.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-gray-500 italic">
                    Nessuna temperatura registrata per questo giorno.
                  </td>
                </tr>
              )}

              <tr>
                <td className="px-4 py-2 bg-avorio rounded-bl-2xl">
                  <input
                    type="date"
                    className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    value={nuovaTemperatura.data || ""}
                    onChange={(e) =>
                      setNuovaTemperatura((prev) => ({
                        ...prev,
                        data: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    placeholder="Frigo"
                    value={nuovaTemperatura.frigo}
                    onChange={(e) =>
                      setNuovaTemperatura((prev) => ({
                        ...prev,
                        frigo: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2 bg-avorio">
                  <input
                    type="number"
                    className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    placeholder="Temperatura"
                    value={nuovaTemperatura.temperatura}
                    onChange={(e) =>
                      setNuovaTemperatura((prev) => ({
                        ...prev,
                        temperatura: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    className="w-full px-1 text-center text-gray-500  focus:border-b-2 focus:border-ambra focus:outline-hidden"
                    value={nuovaTemperatura.conformita}
                    onChange={(e) =>
                      setNuovaTemperatura((prev) => ({
                        ...prev,
                        conformita: e.target.value,
                      }))
                    }
                  >
                    <option value="">Seleziona</option>
                    <option value="CONFORME">CONFORME</option>
                    <option value="NON_CONFORME">NON CONFORME</option>
                  </select>
                </td>
                <td className="px-4 py-2 bg-avorio rounded-br-2xl">
                  <button
                    className="m-auto text-gray-100 text-shadow-lg  flex items-center justify-center w-7 h-7 rounded-2xl bg-salvia hover:bg-salviaScuro py-4 px-12 transform transition-transform duration-200 ease-in-out hover:scale-110 "
                    onClick={handleAddTemperatura}
                    disabled={
                      !nuovaTemperatura.data ||
                      !nuovaTemperatura.frigo ||
                      !nuovaTemperatura.temperatura ||
                      !nuovaTemperatura.conformita
                    }
                  >
                    aggiungi
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="block sm:hidden space-y-4 mt-4">
            {(risultatiFiltrati?.length > 0
              ? risultatiFiltrati
              : temperatureDelGiorno
            ).map((t, index) => (
              <div
                key={t.id || index}
                className={`p-4 rounded-2xl shadow-md shadow-salvia border-1 ${
                  t.conformita === "NON_CONFORME"
                    ? "bg-rosso/60 border-rosso"
                    : "bg-salviaChiaro border-salvia "
                }`}
              >
                {editingId === t.id ? (
                  <form
                    onSubmit={(e) => handleUpdateTemperatura(t.id, e)}
                    className="space-y-2"
                  >
                    <input
                      type="date"
                      className="w-full px-2 py-1 rounded"
                      value={temperaturaModificata.data}
                      onChange={(e) =>
                        setTemperaturaModificata((prev) => ({
                          ...prev,
                          data: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      className="w-full px-2 py-1 rounded"
                      placeholder="Frigo"
                      value={temperaturaModificata.frigo}
                      onChange={(e) =>
                        setTemperaturaModificata((prev) => ({
                          ...prev,
                          frigo: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="number"
                      className="w-full px-2 py-1 rounded"
                      placeholder="Temperatura"
                      value={temperaturaModificata.temperatura}
                      onChange={(e) =>
                        setTemperaturaModificata((prev) => ({
                          ...prev,
                          temperatura: e.target.value,
                        }))
                      }
                    />
                    <select
                      className="w-full px-2 py-1 rounded"
                      value={temperaturaModificata.conformita}
                      onChange={(e) =>
                        setTemperaturaModificata((prev) => ({
                          ...prev,
                          conformita: e.target.value,
                        }))
                      }
                    >
                      <option value="">Seleziona</option>
                      <option value="CONFORME">CONFORME</option>
                      <option value="NON_CONFORME">NON CONFORME</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-salvia text-white rounded-3xl px-4 py-1 hover:bg-salviaScuro"
                    >
                      Salva
                    </button>
                  </form>
                ) : (
                  <div className="space-y-1">
                    <p>
                      <strong>Data:</strong> {formattaData(t.data)}
                    </p>
                    <p>
                      <strong>Frigo:</strong> {t.frigo}
                    </p>
                    <p>
                      <strong>Temperatura:</strong> {t.temperatura}°C
                    </p>
                    <p>
                      <strong>Conformità:</strong> {t.conformita}
                    </p>
                    <div className="flex justify-between">
                      <button
                        className="mt-2 text-sm rounded-3xl bg-ambra text-black px-3 py-1 border-1 border-ambra hover:bg-ambra/90"
                        onClick={() => {
                          setEditingId(t.id)
                          setTemperaturaModificata({
                            frigo: t.frigo,
                            temperatura: t.temperatura,
                            conformita: t.conformita,
                            data: t.data,
                          })
                        }}
                      >
                        Modifica
                      </button>

                      <button
                        className="mt-2 text-sm rounded-3xl bg-rosso text-white px-3 py-1 border-1 border-rosso hover:bg-rosso/90"
                        onClick={() => {
                          setTemperaturaDaEliminare(t)
                          setShowDeleteModal(true)
                        }}
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/*  mobile */}
            <div className="p-4 rounded-2xl shadow-md bg-avorio border-1 border-gray-300">
              <h3 className="font-semibold mb-2 text-salviaScuro">
                Aggiungi temperatura
              </h3>
              <form onSubmit={handleAddTemperatura} className="space-y-2">
                <input
                  type="date"
                  className="w-full px-2 py-1 rounded"
                  value={nuovaTemperatura.data}
                  onChange={(e) =>
                    setNuovaTemperatura((prev) => ({
                      ...prev,
                      data: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  className="w-full px-2 py-1 rounded"
                  placeholder="Frigo"
                  value={nuovaTemperatura.frigo}
                  onChange={(e) =>
                    setNuovaTemperatura((prev) => ({
                      ...prev,
                      frigo: e.target.value,
                    }))
                  }
                />
                <input
                  type="number"
                  className="w-full px-2 py-1 rounded"
                  placeholder="Temperatura"
                  value={nuovaTemperatura.temperatura}
                  onChange={(e) =>
                    setNuovaTemperatura((prev) => ({
                      ...prev,
                      temperatura: e.target.value,
                    }))
                  }
                />
                <select
                  className="w-full px-2 py-1 rounded"
                  value={nuovaTemperatura.conformita}
                  onChange={(e) =>
                    setNuovaTemperatura((prev) => ({
                      ...prev,
                      conformita: e.target.value,
                    }))
                  }
                >
                  <option value="">Seleziona</option>
                  <option value="CONFORME">CONFORME</option>
                  <option value="NON_CONFORME">NON CONFORME</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-salvia text-white rounded-3xl px-4 py-1 hover:bg-salviaScuro"
                  disabled={
                    !nuovaTemperatura.data ||
                    !nuovaTemperatura.frigo ||
                    !nuovaTemperatura.temperatura ||
                    !nuovaTemperatura.conformita
                  }
                >
                  Aggiungi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-neutral-400/50 bg-opacity-30 flex items-center justify-center  ">
          <div className="bg-salviaChiaro rounded-2xl border-1 border-salviaScuro p-6 w-100 shadow-lg shadow-salvia text-center ">
            <h2 className="text-xl  mb-4">Conferma eliminazione</h2>
            <p>
              Sei sicuro di voler eliminar
              <span className="font-bold">
                {temperaturaDaEliminare?.frigo || "questa temperatura"}
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
                  if (temperaturaDaEliminare) {
                    handleDeleteTemperatura(temperaturaDaEliminare.id)
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

export default Temperature
