import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import {
  PencilSquareIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"

const Temperature = () => {
  const [temperature, setTemperature] = useState([])
  const [giorni, setGiorni] = useState([])
  const [giornoCorrente, setGiornoCorrente] = useState(0)

  // Stato per nuova temperatura (inserimento inline)
  const [nuovaTemperatura, setNuovaTemperatura] = useState({
    frigo: "",
    temperatura: "",
    conformita: "",
    data: "",
  })
  // Stato per modifica inline
  // Stato per visibilità filtri
  const [mostraFiltri, setMostraFiltri] = useState(false)
  // Stati per i filtri
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
  // Stato per risultati filtrati
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

  // Funzione per applicare i filtri e chiamare l'endpoint corretto
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

  // Funzione per resettare i filtri e ricaricare tutte le temperature
  const resetFiltri = () => {
    setFiltroData("")
    setFiltroStart("")
    setFiltroEnd("")
    setFiltroConformita("")
    setFiltroTemperatura("")
    setFiltroFrigo("")
    setRisultatiFiltrati([])
    // ricarica tutte le temperature
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
      year: "numeric",
    }).format(new Date(data))

  // Gestione aggiunta nuova temperatura
  const handleAddTemperatura = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    // Costruisci payload
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
      // Aggiorna stato locale (reload temperature)
      // Reload temperature
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
      // Reset form
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

  // Gestione modifica temperatura esistente (inline)
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
      // Reload temperature
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

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 p-6">
        {/* Bottone mostra/nascondi filtri e dropdown */}
        <div className="relative flex justify-end mb-4 mr-20">
          <button
            className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-blue-200 rounded-4xl"
            onClick={() => setMostraFiltri((prev) => !prev)}
          >
            Filtri
          </button>

          {mostraFiltri && (
            <div className="absolute right-0 top-full mt-2 z-50 w-[500px] bg-white rounded-md shadow-2xl p-4 border border-gray-200">
              <h2 className="font-semibold mb-2">Filtri</h2>
              <div className="">
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Data specifica
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="px-2 py-1 border border-gray-300 rounded-4xl flex-1"
                      placeholder="Data"
                      value={filtroData}
                      onChange={(e) => setFiltroData(e.target.value)}
                    />
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 text-sm"
                    >
                      Filtra
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Intervallo date
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="px-2 py-1 border border-gray-300 rounded-4xl flex-1"
                      placeholder="Da"
                      value={filtroStart}
                      onChange={(e) => setFiltroStart(e.target.value)}
                    />{" "}
                    <input
                      type="date"
                      className="px-2 py-1 border border-gray-300 rounded-4xl flex-1"
                      placeholder="A"
                      value={filtroEnd}
                      onChange={(e) => setFiltroEnd(e.target.value)}
                    />
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 text-sm"
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
                      className="px-2 py-1 border border-gray-300 rounded-4xl flex-1"
                      placeholder="Frigo"
                      value={filtroFrigo}
                      onChange={(e) => setFiltroFrigo(e.target.value)}
                    />
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 text-sm"
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
                      className="px-2 py-1 border border-gray-300 rounded-4xl flex-1"
                      placeholder="Temperatura"
                      value={filtroTemperatura}
                      onChange={(e) => setFiltroTemperatura(e.target.value)}
                    />
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 text-sm"
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
                      className="px-2 py-1 border border-gray-300 rounded-4xl flex-1"
                      value={filtroConformita}
                      onChange={(e) => setFiltroConformita(e.target.value)}
                    >
                      <option value="">Seleziona</option>
                      <option value="CONFORME">CONFORME</option>
                      <option value="NON_CONFORME">NON CONFORME</option>
                    </select>
                    <button
                      onClick={applicaFiltri}
                      className="px-3 py-1 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 text-sm"
                    >
                      Filtra
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="w-full px-3 py-1 bg-gray-300 text-gray-800 rounded-4xl hover:bg-gray-400 text-sm"
                  onClick={resetFiltri}
                >
                  Annulla filtri
                </button>
              </div>
            </div>
          )}
        </div>

        <div className=" flex-1 p-6 justify-items-center justify-center ">
          <div className="flex justify-between mb-6">
            <button
              disabled={giornoCorrente === 0}
              onClick={() => setGiornoCorrente((prev) => prev - 1)}
              className=" bg-blue-500 text-white p-2 rounded-full disabled:opacity-50 mr-30  hover:bg-blue-800"
            >
              <ArrowLeftIcon className="h-8" />
            </button>

            <h1 className="text-2xl mb-4 text-center">
              {!haFiltriAttivi()
                ? giornoSelezionato
                  ? `Temperature registrate - Giorno: ${formattaData(
                      giornoSelezionato
                    )}`
                  : "Temperature registrate"
                : filtroConformita
                ? `Temperature ${filtroConformita
                    .toLowerCase()
                    .replace("_", " ")} rilevate`
                : filtroData
                ? `Temperature del ${formattaData(filtroData)}`
                : filtroStart && filtroEnd
                ? `Temperature dal ${formattaData(
                    filtroStart
                  )} al ${formattaData(filtroEnd)}`
                : filtroFrigo
                ? `Temperature del frigo ${filtroFrigo}`
                : filtroTemperatura
                ? `Temperature pari a ${filtroTemperatura}°C`
                : "Risultati del filtro"}
            </h1>
            <button
              disabled={giornoCorrente === giorni.length - 1}
              onClick={() => setGiornoCorrente((prev) => prev + 1)}
              className=" p-2 bg-blue-500 text-white rounded-full disabled:opacity-50 ml-30 hover:bg-blue-800"
            >
              <ArrowRightIcon className="h-8" />
            </button>
          </div>
          <table className="w-250 border-collapse bg-neutral-50 shadow-xl">
            <thead>
              <tr>
                <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200">
                  Data
                </th>
                <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200">
                  Frigo
                </th>
                <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200">
                  Temperatura
                </th>
                <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200">
                  Conformità
                </th>
                <th className="border-b border-gray-300 px-6 py-3 bg-neutral-200"></th>
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
                      <td className="border-b border-gray-300 py-3 text-center">
                        <input
                          type="date"
                          className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                          value={temperaturaModificata.data || ""}
                          onChange={(e) =>
                            setTemperaturaModificata((prev) => ({
                              ...prev,
                              data: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="border-b border-gray-300 py-3 text-center ">
                        <input
                          type="text"
                          className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                          value={temperaturaModificata.frigo}
                          onChange={(e) =>
                            setTemperaturaModificata((prev) => ({
                              ...prev,
                              frigo: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="border-b border-gray-300 py-3 text-center">
                        <input
                          type="number"
                          className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                          value={temperaturaModificata.temperatura}
                          onChange={(e) =>
                            setTemperaturaModificata((prev) => ({
                              ...prev,
                              temperatura: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="border-b border-gray-300 py-3 text-center">
                        <select
                          className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                          value={temperaturaModificata.conformita}
                          onChange={(e) =>
                            setTemperaturaModificata((prev) => ({
                              ...prev,
                              conformita: e.target.value,
                            }))
                          }
                        >
                          <option value="">Seleziona...</option>
                          <option value="CONFORME">CONFORME</option>
                          <option value="NON_CONFORME">NON CONFORME</option>
                        </select>
                      </td>
                      <td className="border-b border-gray-300 py-3 text-center">
                        <button
                          className="ml-5 flex items-center justify-center w-7 h-7 rounded-full bg-green-400  hover:bg-green-500 transform transition-transform duration-200 ease-in-out hover:scale-110"
                          onClick={(e) => handleUpdateTemperatura(t.id, e)}
                        >
                          <CheckIcon className="w-4 h-4 " />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border-b border-gray-300 py-3 text-center px-3 bg-neutral-100">
                        {formattaData(t.data)}
                      </td>
                      <td className="border-b border-gray-300 py-3 text-center px-3">
                        {t.frigo}
                      </td>
                      <td className="border-b border-gray-300 py-3 text-center px-3 bg-neutral-100">
                        {t.temperatura}
                      </td>
                      <td className="border-b border-gray-300 py-3 text-center px-3">
                        {t.conformita}
                      </td>
                      <td className="border-b border-gray-300 py-3 text-center px-3 bg-neutral-100">
                        <button
                          className="ml-2 flex items-center justify-center w-7 h-7  transform transition-transform duration-200 ease-in-out hover:scale-110  hover:text-yellow-600 "
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
                          <PencilSquareIcon className="w-6 h-6 " />
                        </button>
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
              {/* Riga per inserimento nuova temperatura */}
              <tr>
                <td className="px-4 py-2">
                  <input
                    type="date"
                    className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
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
                    className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
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
                <td className="px-4 py-2">
                  <input
                    type="number"
                    className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
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
                    className="w-full px-1 text-center text-sm focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
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
                <td className="px-4 py-2">
                  <button
                    className="w-7 h-7 bg-blue-400 text-white rounded-full hover:bg-blue-600 text-sm hover:shadow-md hover:shadow-blue-600/50 focus:border-b-2 focus:border-blue-800 focus:outline-hidden"
                    onClick={handleAddTemperatura}
                    disabled={
                      !nuovaTemperatura.data ||
                      !nuovaTemperatura.frigo ||
                      !nuovaTemperatura.temperatura ||
                      !nuovaTemperatura.conformita
                    }
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

export default Temperature
